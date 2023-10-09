import { useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  rem,
  Button,
  Menu,
  Text,
  Center,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { useColorScheme, useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconChevronDown, IconMoon, IconSun } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    padding: theme.spacing.md,
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

interface HeaderSimpleProps {
  links: { link: string; label: string }[];
}

const links: { link: string; label: string }[] = [
  {
    link: "/",
    label: "Home",
  },
  {
    link: "/auth/user/signin",
    label: "User Sign In",
  },
  {
    link: "/auth/practitioner/signin",
    label: "Practitioner Sign In",
  },
];

const HeaderNav = () => {
  const [opened, { toggle }] = useDisclosure(false);

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();

  return (
    <Header height={60} mb={120}>
      <div className={classes.header}>
        <div>Logo</div>
        <Group spacing={20} className={classes.links}>
          <Menu
            trigger="click"
            transitionProps={{ exitDuration: 0 }}
            withinPortal
          >
            <Menu.Target>
              <Button
                variant="light"
                rightIcon={<IconChevronDown size="0.9rem" stroke={1.5} />}
              >
                User
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item>
                <Link href="/auth/user/signin">User Sign In</Link>
              </Menu.Item>
              <Menu.Item>
                <Link href="/auth/user/signup">User Sign Up</Link>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Menu trigger="click">
            <Menu.Target>
              <Center className="cursor-pointer">
                <Button
                  variant="light"
                  rightIcon={<IconChevronDown size="0.9rem" stroke={1.5} />}
                >
                  Practitioner
                </Button>
              </Center>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item>Practitioner Sign In</Menu.Item>
              <Menu.Item>Practitioner Sign Up</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <ActionIcon
            variant="light"
            color={colorScheme === "light" ? "dark" : "yellow"}
            size="lg"
            onClick={() => toggleColorScheme()}
          >
            {colorScheme === "light" ? <IconMoon size="1.2rem" /> : <IconSun />}
          </ActionIcon>
        </Group>

        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />
      </div>
    </Header>
  );
};

export default HeaderNav;
