import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useEffect, useState } from "react";

import GlobalLayout from "./components/Layouts/GlobalLayout";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";

import SigninPage from "./pages/auth/Signin.Page";
import SignupPage from "./pages/auth/Signup.Page";
import DashboardPage from "./pages/user/Dashboard.Page";
import NotFoundPage from "./pages/error/404";
import { NotificationsProvider } from "@mantine/notifications";

import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { useMyDataQuery } from "./redux/auth/auth.query";
import { resetUser, setUser } from "./redux/auth/auth.slice";
import PractitionerIndexPage from "./pages/practitioners";
import PractitionerCreatePage from "./pages/practitioners/create";
import PractitionerEditPage from "./pages/practitioners/edit";
import { useLocalStorage } from "@mantine/hooks";

function App() {
  // mantine hook to set color theme from local storage and theme persist
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "colorScheme",
    defaultValue: "light",
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const dispatch = useAppDispatch();

  // get user data from redux store
  const { isSuccess, data, isError } = useMyDataQuery("");
  useEffect(() => {
    // if user data is successfull then set user data in redux store
    if (isSuccess) {
      dispatch(setUser(data?.data));
    } else if (isError) {
      // if user data is not successfull then reset user data in redux store
      dispatch(resetUser());
    }
  }, [isSuccess]);

  return (
    <BrowserRouter>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{ colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          <GlobalLayout>
            <NotificationsProvider position="bottom-right">
              <Router />
            </NotificationsProvider>
          </GlobalLayout>
        </MantineProvider>
      </ColorSchemeProvider>
    </BrowserRouter>
  );
}

function Router() {
  // Router component to handle routes
  return (
    <Routes>
      <Route element={<UnProtectedRoutes />}>
        {/* Signed Up User cantt enter these routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
      </Route>
      <Route element={<ProtectedRoutes />}>
        {/* Signed Out User can access these routes */}
        <Route path="/" element={<DashboardPage />} />
        <Route path="/practitioner" element={<PractitionerIndexPage />} />
        <Route
          path="/practitioner/create"
          element={<PractitionerCreatePage />}
        />
        <Route
          path="/practitioner/:practitioner_id/edit"
          element={<PractitionerEditPage />}
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function ProtectedRoutes() {
  // ProtectedRoutes component to handle protected routes
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector(
    (state) => state.authReducer
  );

  // If user is Not authenticated, they can't access child routes

  if (!user && !isAuthenticated) {
    return (
      <Navigate
        replace
        to="/signin"
        state={{
          from: location,
        }}
      />
    );
  }
  // If user is authenticated, they can access child routes
  // Outlet component renders child route component if these is one
  return <Outlet />;
}

function UnProtectedRoutes() {
  // UnProtectedRoutes component to handle un protected routes
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector(
    (state) => state.authReducer
  );

  // If user is not authenticated, they can access child routes
  // Outlet component renders child route component if these is one

  if (!isAuthenticated && !user) return <Outlet />;

  // If user is authenticated, they can't access child routes
  return (
    <Navigate
      replace
      to={location.state?.from || "/"}
      state={{
        from: location,
      }}
    />
  );
}

export default App;
