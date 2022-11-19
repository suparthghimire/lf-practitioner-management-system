import AuthPageLayout from "../../components/Layouts/AuthPageLayout";
import { useForm, zodResolver } from "@mantine/form";
import { UserLogin, UserLoginSchema } from "../../models/User";
import {
  Button,
  Text,
  TextInput,
  PasswordInput,
  Flex,
  Center,
} from "@mantine/core";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ServerErrorPartial from "../../components/partials/ServerError.Partial";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useSigninMutation } from "../../redux/auth/auth.query";
import { useEffect } from "react";
import { setTokens, setUser } from "../../redux/auth/auth.slice";
import { showNotification, updateNotification } from "@mantine/notifications";
import { ServerError } from "../../models/Error";
import { IconCheck, IconX } from "@tabler/icons";
export default function SigninPage() {
  const [
    signin,
    { isSuccess, isLoading: signUpLoading, isError, data, error },
  ] = useSigninMutation();

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<UserLogin>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(UserLoginSchema),
  });

  async function handleSubmit(values: UserLogin) {
    try {
      await signin(values);
    } catch (error) {
      console.error(error);
    } finally {
      form.reset();
    }
  }

  useEffect(() => {
    if (isSuccess) {
      updateNotification({
        id: "signin-notification",
        title: "Sign in Successful",
        message: "You have successfully signed in",
        color: "green",
        icon: <IconCheck />,
        autoClose: 2000,
      });
      console.log("SININING");
      console.log(data.data.user);
      dispatch(setUser(data.data.user));
      dispatch(
        setTokens({
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        })
      );
      if (location?.state?.from) {
        navigate(location.state.from);
      }
    } else if (isError) {
      updateNotification({
        id: "signin-notification",
        title: "Sign in Failed",
        message: "You have Some errors to Fix",
        color: "red",
        icon: <IconX />,
        autoClose: 2000,
      });
    } else if (signUpLoading) {
      showNotification({
        id: "signin-notification",
        title: "Attempting to Sign in",
        message: "You have successfully signed in",
        color: "blue",
        loading: true,
        autoClose: false,
        disallowClose: true,
      });
    }
  }, [isSuccess, isError, signUpLoading]);

  return (
    <AuthPageLayout title="Sign In">
      <ServerErrorPartial errors={(error as any)?.data as ServerError} />
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
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
          <Button
            loading={signUpLoading}
            type="submit"
            variant="filled"
            color="green"
            mt="xl"
          >
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
