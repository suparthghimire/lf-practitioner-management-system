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
import { Link } from "react-router-dom";
import ServerErrorPartial from "../../components/partials/ServerError.Partial";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useSigninMutation } from "../../redux/auth/auth.query";
import { useEffect } from "react";
import { setTokens, setUser } from "../../redux/auth/auth.slice";
import { showNotification, updateNotification } from "@mantine/notifications";
import { ServerError } from "../../models/Error";
import { IconCheck, IconX } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../components/common/Loader";
export default function SigninPage() {
  const navigate = useNavigate();
  const [signin, { isSuccess, isLoading, isError, data, error }] =
    useSigninMutation();
  const dispatch = useAppDispatch();

  const form = useForm<UserLogin>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(UserLoginSchema),
  });

  const { isAuthenticated, isLoading: userLoading } = useAppSelector(
    (state) => state.authReducer
  );

  async function handleSubmit(values: UserLogin) {
    try {
      const data = await signin(values);
    } catch (error) {
      console.error(error);
    }
    form.reset();
  }

  useEffect(() => {
    if (!userLoading && isAuthenticated) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated]);

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
      dispatch(setUser(data.data.user));
      dispatch(
        setTokens({
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        })
      );
      // navigate("/");
    } else if (isError) {
      updateNotification({
        id: "signin-notification",
        title: "Sign in Failed",
        message: "You have Some errors to Fix",
        color: "red",
        icon: <IconX />,
        autoClose: 2000,
      });
    } else if (isLoading) {
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
  }, [isSuccess, isError, isLoading]);

  if (!isLoading && !isAuthenticated)
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
              loading={isLoading}
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
  else return <CustomLoader />;
}
