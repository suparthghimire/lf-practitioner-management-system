import { useAuth } from "@/lib/providers/auth/AuthProvider";
import { createStyles, Navbar, Group } from "@mantine/core";
import { IconHealthRecognition, IconDashboard } from "@tabler/icons-react";

import Link from "next/link";

export default function NavbarNav() {
  const { auth } = useAuth();

  return (
    <Navbar p="md" hiddenBreakpoint="md" width={{ sm: 300, lg: 300 }}>
      {auth.status === true && auth.type === "PRACTITIONER" && (
        <PractitionerNavbar />
      )}
      {auth.status === true && auth.type === "USER" && <UserNavbar />}
    </Navbar>
  );
}

function UserNavbar() {
  return <Navbar.Section grow>User Section</Navbar.Section>;
}

function PractitionerNavbar() {
  return <Navbar.Section grow>Practitioner Section</Navbar.Section>;
}
