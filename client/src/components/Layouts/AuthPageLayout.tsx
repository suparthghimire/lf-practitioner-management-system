import { Text, Paper, Flex, Center, Image, Divider, Box } from "@mantine/core";
import Logo from "../common/Logo";
interface Props {
  children: React.ReactNode;
  title: string;
}
export default function AuthPageLayout(props: Props) {
  return (
    <Center>
      <Paper withBorder style={{ width: "100%" }} shadow="sm" p="lg">
        <Text size="xl" weight="bold">
          {props.title}
        </Text>
        <Divider mt="xl" />
        <Box mt="xl">{props.children}</Box>
      </Paper>
    </Center>
  );
}
