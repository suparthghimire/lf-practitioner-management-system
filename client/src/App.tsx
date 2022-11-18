import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useState } from "react";

import GlobalLayout from "./components/Layouts/GlobalLayout";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import SigninPage from "./pages/auth/Signin.Page";
import SignupPage from "./pages/auth/Signup.Page";
import DashboardPage from "./pages/user/Dashboard.Page";
import NotFoundPage from "./pages/error/404";

function WrappedApp() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
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
            <App />
          </GlobalLayout>
        </MantineProvider>
      </ColorSchemeProvider>
    </BrowserRouter>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default WrappedApp;
