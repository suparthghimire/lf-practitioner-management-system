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
import CustomLoader from "./components/common/Loader";

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const dispatch = useAppDispatch();

  const { isSuccess, data, isError } = useMyDataQuery("");
  useEffect(() => {
    console.log("FETCH USER");
    if (isSuccess) {
      dispatch(setUser(data?.data));
    } else if (isError) {
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
  return (
    <Routes>
      <Route element={<UnProtectedRoutes />}>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
      </Route>
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/practitioner" element={<PractitionerIndexPage />} />
        <Route
          path="/practitioner/create"
          element={<PractitionerCreatePage />}
        />
        <Route
          path="/practitioner/:id/edit"
          element={<PractitionerEditPage />}
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function ProtectedRoutes() {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector(
    (state) => state.authReducer
  );

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
  return <Outlet />;
}

function UnProtectedRoutes() {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector(
    (state) => state.authReducer
  );

  if (!isAuthenticated && !user) return <Outlet />;

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
