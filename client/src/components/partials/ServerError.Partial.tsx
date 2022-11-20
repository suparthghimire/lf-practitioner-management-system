import { Alert, Box, List, Text, useMantineColorScheme } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import { ServerError } from "../../models/Error";

export default function ServerErrorPartial({
  errors,
}: {
  errors: ServerError | undefined;
}) {
  const data = errors?.data ? Object.values(errors.data).flat() : undefined;
  console.log(errors);
  return errors ? (
    <Box mb="xl">
      <Alert
        pt="lg"
        icon={<IconAlertCircle size={16} />}
        title={errors.message}
        color="red"
      >
        <div>
          <List>
            {data?.map((error) => (
              <Text key={error}>{error}</Text>
            ))}
          </List>
        </div>
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
