import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useEffect, useState } from "react";

import GlobalLayout from "./components/Layouts/GlobalLayout";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import SigninPage from "./pages/auth/Signin.Page";
import SignupPage from "./pages/auth/Signup.Page";
import DashboardPage from "./pages/user/Dashboard.Page";
import NotFoundPage from "./pages/error/404";
import { NotificationsProvider } from "@mantine/notifications";

import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { useMyDataQuery } from "./redux/auth/auth.query";
import { setLoading, setUser } from "./redux/auth/auth.slice";

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const accessToken = useAppSelector((state) => state.authReducer.accessToken);

  const dispatch = useAppDispatch();

  const { isSuccess, isLoading, data, isError } = useMyDataQuery(
    accessToken ?? ""
  );
  useEffect(() => {
    if (isSuccess) dispatch(setUser(data?.data));
    else if (isError) dispatch(setLoading(false));
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
      <Route path="/" element={<DashboardPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
