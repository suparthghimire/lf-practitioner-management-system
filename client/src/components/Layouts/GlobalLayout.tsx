import { AppShell, ColorScheme } from "@mantine/core";
import HeaderPartial from "../partials/Header.Partial";
import { useState } from "react";
import FooterPartial from "../partials/Footer.Partial";
import { useAppSelector } from "../../redux/hooks";
import NavbarPartial from "../partials/Navbar.Partial";

// Layout for Entire application
interface Props {
  children: React.ReactNode;
}
export default function GlobalLayout(props: Props) {
  const [toggleNavbar, setToggleNavbar] = useState(false);

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
      // If user is authenticated, only then show navbar
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
