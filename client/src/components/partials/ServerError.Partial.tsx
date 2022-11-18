import { Alert, Box, List, Text, useMantineColorScheme } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";

const errors: string[] = [];

export default function ServerErrorPartial() {
  return errors.length > 0 ? (
    <Box mb="xl">
      <Alert icon={<IconAlertCircle size={16} />} title="Bummer!" color="red">
        Opps! Something Went Wrong. Please Fix the Issues Listed Below
        <List mt="sm">
          {errors.map((error) => (
            <SingleError error={error} />
          ))}
        </List>
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
