import {
  Header,
  useMantineTheme,
  Text,
  Flex,
  useMantineColorScheme,
  ActionIcon,
  Tooltip,
  Button,
  Container,
  Menu,
  MediaQuery,
  Burger,
} from "@mantine/core";
import { IconDoorExit, IconMoonStars, IconSun, IconUser } from "@tabler/icons";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { resetUser } from "../../redux/auth/auth.slice";

import Logo from "../common/Logo";
import { useSignoutMutation } from "../../redux/auth/auth.query";
import { useEffect } from "react";

interface Props {
  burgerOpen: boolean;
  setBurgerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HeaderPartial(props: Props) {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const oppositeColorScheme = dark ? "light" : "dark";

  const isAuthenticated = useAppSelector(
    (state) => state.authReducer.isAuthenticated
  );
  return (
    <Header height={{ base: 100, md: 100 }} p="lg">
      {/* <Container px={0}> */}
      <Flex align="center" justify="space-between">
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={props.burgerOpen}
              onClick={() => props.setBurgerOpen((p) => !p)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: dark ? theme.colors.dark[0] : theme.colors.dark[8],
            }}
          >
            <Flex gap="md" align="center">
              <Logo size={50} />
              <Text
                styles={(theme) => ({
                  main: {
                    color:
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[8]
                        : theme.colors.gray[0],
                  },
                })}
                weight="bolder"
                size="xl"
              >
                Practitioner Management System
              </Text>
            </Flex>
          </Link>
        </div>
        <Flex gap="lg" align="center">
          {!isAuthenticated && (
            <>
              <Link to="/signin">
                <Button variant="light" color="teal">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="light" color="blue">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          {isAuthenticated && (
            <div>
              <Menu
                shadow="md"
                width={200}
                trigger="hover"
                openDelay={100}
                closeDelay={100}
              >
                <Menu.Target>
                  <ActionIcon size="lg" variant="light" color="green">
                    <IconUser />
                  </ActionIcon>
                </Menu.Target>
                <UserMenu />
              </Menu>
            </div>
          )}
          <p>|</p>
          <Tooltip label={`Switch to ${oppositeColorScheme} theme`}>
            <ActionIcon
              size="lg"
              variant="light"
              color={dark ? "yellow" : "blue"}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Flex>
      {/* </Container> */}
    </Header>
  );
}

function UserMenu() {
  const dispatch = useAppDispatch();

  const [signout, { isSuccess }] = useSignoutMutation();

  useEffect(() => {
    if (isSuccess) {
      dispatch(resetUser());
    }
  }, [isSuccess]);
  return (
    <Menu.Dropdown>
      <Menu.Item icon={<IconUser size={14} />}>View Profile</Menu.Item>
      <Menu.Item
        color="red"
        icon={<IconDoorExit size={14} />}
        onClick={async () => {
          await signout("");
        }}
      >
        Log Out
      </Menu.Item>
    </Menu.Dropdown>
  );
}
