import {
  Header,
  useMantineTheme,
  Text,
  Flex,
  useMantineColorScheme,
  ActionIcon,
  Tooltip,
  Button,
  Menu,
  MediaQuery,
  Burger,
  Divider,
  ModalProps,
  Paper,
  Card,
  Container,
  Box,
} from "@mantine/core";
import {
  IconDoorExit,
  IconMoonStars,
  IconSettings,
  IconStethoscope,
  IconSun,
  IconUser,
} from "@tabler/icons";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { resetUser } from "../../redux/auth/auth.slice";
import { Modal } from "@mantine/core";
import Logo from "../common/Logo";
import { useSignoutMutation } from "../../redux/auth/auth.query";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { resetPractitioner } from "../../redux/auth/practitioner/auth.slice";
import UserMenu from "./SubMenu/User.Menu";
import PractitionerMenu from "./SubMenu/Practitioner.Menu";

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
  const isPractitionerAuthenticated = useAppSelector(
    (state) => state.practitionerAuthReducer.isAuthenticated
  );

  const [signInOptOpened, { open: openSigninOpt, close: closeSigninOpt }] =
    useDisclosure(false);

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
          {!isAuthenticated && !isPractitionerAuthenticated && (
            <>
              {/* <Link to="/signin"> */}
              <Button variant="light" color="teal" onClick={openSigninOpt}>
                Sign In
              </Button>
              {/* </Link> */}
              <Link to="/signup">
                <Button variant="light" color="blue">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          {isAuthenticated || isPractitionerAuthenticated ? (
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
                {isAuthenticated ? <UserMenu /> : <PractitionerMenu />}
              </Menu>
            </div>
          ) : (
            <></>
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
      <SignInOptions onClose={closeSigninOpt} opened={signInOptOpened} />
    </Header>
  );
}

function SignInOptions(props: ModalProps) {
  return (
    <Modal
      {...props}
      centered
      radius={8}
      title="Who are You?"
      styles={() => ({
        title: {
          fontSize: "1.25rem",
          fontWeight: 700,
        },
      })}
    >
      <Flex gap="1rem">
        <Link to="/signin">
          <Button
            variant="light"
            leftIcon={<IconUser />}
            onClick={props.onClose}
          >
            User
          </Button>
        </Link>

        <Link to="/practitioner/signin">
          <Button
            variant="light"
            color="teal"
            leftIcon={<IconStethoscope />}
            onClick={props.onClose}
          >
            Practitioner
          </Button>
        </Link>
      </Flex>
    </Modal>
  );
}
