import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import GlobalLayout from "./components/Layouts/GlobalLayout";

function WrapperApp() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <React.StrictMode>
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
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <WrapperApp />
);
