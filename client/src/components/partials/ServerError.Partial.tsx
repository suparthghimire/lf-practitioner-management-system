import { Alert, Box, List, Text, useMantineColorScheme } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import { ServerError } from "../../models/Error";

export default function ServerErrorPartial({
  errors,
}: {
  errors: ServerError | undefined;
}) {
  return errors ? (
    <Box mb="xl">
      <Alert
        pt="lg"
        icon={<IconAlertCircle size={16} />}
        title={errors.message}
        color="red"
      >
        <div></div>
      </Alert>
    </Box>
  ) : (
    <></>
  );
}

function SingleError({ error }: { error: string }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  return (
    <List.Item>
      <Text color={colorScheme === "dark" ? "white" : "dark"} size="sm">
        Invalid Email or Password
      </Text>
    </List.Item>
  );
}
