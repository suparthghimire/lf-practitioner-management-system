"use client";
import { AppShell, Navbar, Header, Container } from "@mantine/core";
import { PropsWithChildren } from "react";
import HeaderNav from "../common/Header";
import { useAuth } from "@/lib/providers/auth/AuthProvider";
import NavbarNav from "../common/Navbar";

const MainLayout: React.FC<PropsWithChildren> = (props) => {
  const { auth } = useAuth();
  return (
    <AppShell
      padding="md"
      header={<HeaderNav />}
      navbar={auth.status ? <NavbarNav /> : undefined}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <main>{props.children}</main>
    </AppShell>
  );
};

export default MainLayout;
