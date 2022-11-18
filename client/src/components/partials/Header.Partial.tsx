import {
  Burger,
  Header,
  MediaQuery,
  useMantineTheme,
  Text,
  SimpleGrid,
  Flex,
  useMantineColorScheme,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons";

interface Props {
  burgerOpen: boolean;
  setBurgerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function HeaderPartial(props: Props) {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const oppositeColorScheme = dark ? "light" : "dark";
  return (
    <Header height={{ base: 75, md: 75 }} p="lg">
      <Flex align="center" justify="space-between">
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={props.burgerOpen}
              onClick={() => props.setBurgerOpen(!props.burgerOpen)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>

          <Text weight="bolder" size="xl">
            Practitioner Management System
          </Text>
        </div>
        <div>
          <Tooltip label={`Switch to ${oppositeColorScheme} theme`}>
            <ActionIcon
              variant="outline"
              color={dark ? "yellow" : "blue"}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
            </ActionIcon>
          </Tooltip>
        </div>
      </Flex>
    </Header>
  );
}
