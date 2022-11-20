import { Alert, Box, List, Text, useMantineColorScheme } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import { ServerError } from "../../models/Error";

export default function ServerErrorPartial({
  errors,
}: {
  errors: ServerError | undefined;
}) {
  // Flattens the errors object into an array of strings
  const data = errors?.data ? Object.values(errors.data).flat() : undefined;
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
            {data?.map((error, idx) =>
              error ? (
                <SingleError error={error} key={`server-error-${idx}`} />
              ) : (
                <></>
              )
            )}
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
        {error}
      </Text>
    </List.Item>
  );
}
