import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  createEmotionCache,
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
import PractitionerSigninPage from "./pages/auth/practitioner/Signin.page";
import PractitionerDashboard from "./pages/practitioners/Dashboard.Page";

function App() {
  // mantine hook to set color theme from local storage and theme persist
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "colorScheme",
    defaultValue: "light",
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const dispatch = useAppDispatch();
  const emotionCache = createEmotionCache({
    key: "mantine",
  });
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
          emotionCache={emotionCache}
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
        <Route
          path="/practitioner/signin"
          element={<PractitionerSigninPage />}
        />
      </Route>
      <Route element={<PractitionerProtected />}>
        {/* Signed In Practitioner can access these routes */}
        <Route
          path="/practitioner/dashboard"
          element={<PractitionerDashboard />}
        />
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

function PractitionerProtected() {
  const location = useLocation();
  const { isAuthenticated, practitioner } = useAppSelector(
    (state) => state.practitionerAuthReducer
  );
  const { isAuthenticated: isUserAuthenticated, user } = useAppSelector(
    (state) => state.authReducer
  );
  // check if user is authenticated, if yes then redirect to dashboard

  if (isUserAuthenticated && user)
    return (
      <Navigate
        replace
        to="/"
        state={{
          from: location,
        }}
      />
    );

  // If practitioner is Not authenticated, they can't access child routes
  if (!practitioner && !isAuthenticated) {
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
  // If practitioner is authenticated, they can access child routes
  // Outlet component renders child route component if these is one
  return <Outlet />;
}

function ProtectedRoutes() {
  // ProtectedRoutes component to handle protected routes
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector(
    (state) => state.authReducer
  );
  const { isAuthenticated: isPracAuthenticated, practitioner } = useAppSelector(
    (state) => state.practitionerAuthReducer
  );

  if (isPracAuthenticated && practitioner)
    return (
      <Navigate
        replace
        to="/practitioner/dashboard"
        state={{
          from: location,
        }}
      />
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

  const { isAuthenticated: isPracAuthenticated, practitioner } = useAppSelector(
    (state) => state.practitionerAuthReducer
  );

  const noAuth =
    !isAuthenticated && !user && !isPracAuthenticated && !practitioner;

  // If user is not authenticated, they can access child routes
  // Outlet component renders child route component if these is one

  if (noAuth) return <Outlet />;

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
