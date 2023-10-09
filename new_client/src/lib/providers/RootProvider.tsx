"use client";
import React, { PropsWithChildren } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {
  ColorSchemeProvider,
  ColorScheme,
  MantineProvider,
  createEmotionCache,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { NavigationProgress } from "@mantine/nprogress";
import AuthProvider from "./auth/AuthProvider";

const queryClient = new QueryClient();

const RootProvider: React.FC<PropsWithChildren> = (props) => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "colorScheme",
    defaultValue: "light",
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  const emotionCache = createEmotionCache({
    key: "mantine",
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          emotionCache={emotionCache}
          theme={{
            colorScheme,
            defaultRadius: 8,
          }}
        >
          <AuthProvider>{props.children}</AuthProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  );
};

export default RootProvider;
