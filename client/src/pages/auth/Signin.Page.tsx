import AuthPageLayout from "../../components/Layouts/AuthPageLayout";
import { useForm, zodResolver } from "@mantine/form";
import { UserLogin, UserLoginSchema } from "../../models/User";
import { Button, Text, TextInput, PasswordInput, Flex } from "@mantine/core";
import { Link } from "react-router-dom";
export default function SigninPage() {
  const form = useForm<UserLogin>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(UserLoginSchema),
  });
  return (
    <AuthPageLayout title="Sign In">
      <form
        onSubmit={form.onSubmit((values) => {
          console.log(values);
        })}
      >
        <TextInput
          withAsterisk
          label="Enter Your Email"
          placeholder="jhondoe@email.com"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          mt="xl"
          withAsterisk
          label="Enter Your Password"
          placeholder="********"
          {...form.getInputProps("password")}
        />

        <Flex align="flex-end" gap="xl">
          <Button type="submit" variant="filled" color="green" mt="xl">
            Sign In
          </Button>
          <Flex gap="xs">
            <Text size="sm" italic color="dimmed">
              Dont Have an Account?{" "}
            </Text>
            <Link to="/signup">
              <Text size="sm" italic color="dimmed">
                Signup Instead
              </Text>
            </Link>
          </Flex>
        </Flex>
      </form>
    </AuthPageLayout>
  );
}
