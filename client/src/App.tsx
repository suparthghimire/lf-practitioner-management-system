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
import { resetUser, setLoading, setUser } from "./redux/auth/auth.slice";
import PractitionerIndexPage from "./pages/practitioners";
import PractitionerCreatePage from "./pages/practitioners/create";
import PractitionerEditPage from "./pages/practitioners/edit";

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const dispatch = useAppDispatch();

  const { isSuccess, data, isError } = useMyDataQuery("");
  useEffect(() => {
    if (isSuccess) {
      dispatch(setUser(data?.data));
    } else if (isError) {
      dispatch(setLoading(false));
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
      <Route path="/" element={<DashboardPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/practitioner" element={<PractitionerIndexPage />} />
      <Route path="/practitioner/create" element={<PractitionerCreatePage />} />
      <Route path="/practitioner/edit" element={<PractitionerEditPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
