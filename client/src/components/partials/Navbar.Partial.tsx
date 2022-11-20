import { useState } from "react";
import { createStyles, Navbar, Group } from "@mantine/core";
import {
  IconCalendar,
  IconHealthRecognition,
  IconBuildingHospital,
  IconDashboard,
} from "@tabler/icons";
import { Link, useLocation } from "react-router-dom";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "flex-end",
      gap: theme.spacing.xs,
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({
          variant: "light",
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: "light",
            color: theme.primaryColor,
          }).color,
        },
      },
    },
  };
});

const data = [
  { link: "", label: "Dashboard", icon: <IconDashboard />, to: "/" },
  {
    link: "practitioner",
    label: "Practitioners",
    icon: <IconHealthRecognition />,
    to: "/practitioner",
  },
];

interface Props {
  opened: boolean;
}

function LinkItem({
  item: { icon, label, link, to },
}: {
  item: {
    link: string;
    label: string;
    icon: JSX.Element;
    to: string;
  };
}) {
  const { classes, cx } = useStyles();
  const location = useLocation();

  // check if url has /practitioner if yes, then set active to true
  // remove slash form location path
  let path = location.pathname.replace("/", "");
  const dashboardMatches = label === "Dashboard" && path === "";
  const linkMatches = path.includes(link);

  // Active is toggled if url matches the link in the navbar
  return (
    <Link
      to={to}
      className={cx(classes.link, {
        [classes.linkActive]:
          label === "Dashboard"
            ? dashboardMatches && linkMatches
            : !dashboardMatches && linkMatches,
      })}
      key={label}
    >
      <>
        {icon}
        <span>{label}</span>
      </>
    </Link>
  );
}

export default function NavbarPartial(props: Props) {
  const links = data.map((item) => <LinkItem item={item} key={item.label} />);

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="md"
      hidden={!props.opened}
      width={{ sm: 300, lg: 300 }}
    >
      <Navbar.Section grow>{links}</Navbar.Section>
    </Navbar>
  );
}
