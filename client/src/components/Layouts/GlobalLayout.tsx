import { AppShell, ColorScheme } from "@mantine/core";
import HeaderPartial from "../partials/Header.Partial";
import { useState } from "react";
import FooterPartial from "../partials/Footer.Partial";
import { useAppSelector } from "../../redux/hooks";
import NavbarPartial from "../partials/Navbar.Partial";

interface Props {
  children: React.ReactNode;
}
export default function GlobalLayout(props: Props) {
  const [toggleNavbar, setToggleNavbar] = useState(false);

  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  const isAuthenticated = useAppSelector(
    (state) => state.authReducer.isAuthenticated
  );
  return (
    <AppShell
      padding="md"
      header={
        <HeaderPartial
          burgerOpen={toggleNavbar}
          setBurgerOpen={setToggleNavbar}
        />
      }
      navbarOffsetBreakpoint="md"
      navbar={isAuthenticated ? <NavbarPartial opened={toggleNavbar} /> : <></>}
      footer={<FooterPartial />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <div>{props.children}</div>
    </AppShell>
  );
}
