import { AppShell, ColorScheme } from "@mantine/core";
import HeaderPartial from "../partials/Header.Partial";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}
export default function GlobalLayout(props: Props) {
  const [toggleNavbar, setToggleNavbar] = useState(false);
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <AppShell
      padding="md"
      header={
        <HeaderPartial
          burgerOpen={toggleNavbar}
          setBurgerOpen={setToggleNavbar}
        />
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {props.children}
      {/* Your application here */}
    </AppShell>
  );
}
