import { Text, Paper, Center, Divider, Box } from "@mantine/core";
interface Props {
  children: React.ReactNode;
  title: string;
}

// Layout foir Authenticated Pages
export default function UserPageLayout(props: Props) {
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
