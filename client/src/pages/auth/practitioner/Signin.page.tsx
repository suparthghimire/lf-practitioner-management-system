import AuthPageLayout from "../../../components/Layouts/AuthPageLayout";
import { useForm, zodResolver } from "@mantine/form";
import { UserLogin, UserLoginSchema } from "../../../models/User";
import {
  Button,
  Text,
  TextInput,
  PasswordInput,
  Flex,
  Center,
} from "@mantine/core";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ServerErrorPartial from "../../../components/partials/ServerError.Partial";
import { useAppDispatch } from "../../../redux/hooks";
import { useEffect } from "react";
import { showNotification, updateNotification } from "@mantine/notifications";
import { ServerError } from "../../../models/Error";
import { IconCheck, IconX } from "@tabler/icons";
import { usePractitionerSigninMutation } from "../../../redux/auth/practitioner/auth.query";
import {
  setPractitioner,
  setAccessToken,
} from "../../../redux/auth/practitioner/auth.slice";
export default function PractitionerSigninPage() {
  const [
    practitionerSignin,
    { isSuccess, isLoading: signUpLoading, isError, data, error },
  ] = usePractitionerSigninMutation();

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
      await practitionerSignin(values);
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

      dispatch(setPractitioner(data.data.practitioner));
      dispatch(
        setAccessToken({
          accessToken: data.data.accessToken,
        })
      );
      navigate("/practitioner/dashboard");
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
    <AuthPageLayout title="Practitioner Sign In">
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
        </Flex>
      </form>
    </AuthPageLayout>
  );
}
