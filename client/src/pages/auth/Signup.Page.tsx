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

  const isAuthenticated = useAppSelector(
    (state) => state.authReducer.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  if (isAuthenticated) return <Center>Already Signedin</Center>;
  return (
    <AuthPageLayout title="Sign Up">
      {/* <ServerErrorPartial /> */}
      <form
        onSubmit={form.onSubmit((values) => {
          console.log(values);
        })}
      >
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
          <Button type="submit" variant="filled" color="blue" mt="xl">
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
