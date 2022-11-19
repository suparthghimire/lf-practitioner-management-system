import AuthPageLayout from "../../components/Layouts/AuthPageLayout";
import { useForm, zodResolver } from "@mantine/form";
import { User, UserSchema } from "../../models/User";
import {
  Button,
  Text,
  SimpleGrid,
  TextInput,
  PasswordInput,
  Flex,
  Center,
} from "@mantine/core";
import { Link } from "react-router-dom";
import ServerErrorPartial from "../../components/partials/ServerError.Partial";
import { useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CustomLoader from "../../components/common/Loader";
import { useSignupMutation } from "../../redux/auth/auth.query";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import { ServerError } from "../../models/Error";
export default function SignupPage() {
  const form = useForm<User>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
    validate: zodResolver(UserSchema),
  });
  const navigate = useNavigate();

  async function handleSubmit(values: User) {
    try {
      await signup(values);
    } catch (error) {
      console.error(error);
    } finally {
      form.reset();
    }
  }
  const [
    signup,
    { isLoading: signUpLoading, isError, isSuccess, data, error },
  ] = useSignupMutation();

  useEffect(() => {
    if (isSuccess) {
      updateNotification({
        id: "signup-notification",
        title: "Signup Success",
        message: "Signup successful. Please signin to continue",
        color: "green",
        icon: <IconCheck />,
      });
      navigate("/signin");
    } else if (isError) {
      updateNotification({
        id: "signup-notification",
        title: "Signup Failed",
        message: "Failed to Signup user",
        color: "red",
        icon: <IconX />,
      });
    } else if (signUpLoading) {
      showNotification({
        id: "signup-notification",
        title: "Signing up",
        message: "Please wait while we sign you up",
        loading: true,
      });
    }
  }, [signUpLoading, isSuccess, isError]);

  return (
    <AuthPageLayout title="Sign Up">
      <ServerErrorPartial errors={(error as any)?.data as ServerError} />
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <SimpleGrid>
          <TextInput
            withAsterisk
            label="Enter Your Name"
            placeholder="John Doe"
            {...form.getInputProps("name")}
          />
          <TextInput
            withAsterisk
            label="Enter Your Email"
            placeholder="jhondoe@email.com"
            {...form.getInputProps("email")}
          />
        </SimpleGrid>
        <SimpleGrid mt="xl">
          <PasswordInput
            withAsterisk
            label="Enter Your Password"
            placeholder="********"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            withAsterisk
            label="Confirm Password"
            placeholder="********"
            {...form.getInputProps("confirmPassword")}
          />
        </SimpleGrid>
        <Text mt="xl" size="sm" italic color="dimmed">
          By Signing Up, you agree to our Terms and Conditions and Privacy
          Policy
        </Text>
        <Flex align="flex-end" gap="xl">
          <Button
            loading={signUpLoading}
            type="submit"
            variant="filled"
            color="blue"
            mt="xl"
          >
            Sign Up
          </Button>
          <Flex gap="xs">
            <Text size="sm" italic color="dimmed">
              Already Have an Account?{" "}
            </Text>
            <Link to="/signin">
              <Text size="sm" italic color="dimmed">
                Signin Instead
              </Text>
            </Link>
          </Flex>
        </Flex>
      </form>
    </AuthPageLayout>
  );
}
