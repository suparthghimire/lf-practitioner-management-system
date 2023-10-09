import {
  Badge,
  Button,
  Divider,
  Modal,
  ModalProps,
  PasswordInput,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { UseFormReturnType, useForm, zodResolver } from "@mantine/form";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../../redux/hooks";
import { useDisclosure } from "@mantine/hooks";
import { useGenerate2faMutation } from "../../../redux/auth/auth.query";
import { z } from "zod";

export default function UserTwoFactorAuth() {
  const { user, accessToken } = useAppSelector((state) => state.authReducer);

  const passwordForm = useForm({
    initialValues: {
      password: "",
    },
    validate: zodResolver(
      z.object({
        password: z.string().min(1, "Password is required"),
      })
    ),
  });

  const twoFaEnabled = useMemo(() => {
    if (!user) return false;
    if (!user.UserTwoFa) return false;
    if (!user.UserTwoFa.verified) return false;
    return true;
  }, [user]);

  const form = useForm({
    initialValues: {
      status: twoFaEnabled,
      secret: user?.UserTwoFa?.verified ? user?.UserTwoFa.secret : "" ?? "",
      qrurl: user?.UserTwoFa?.verified ? user?.UserTwoFa.qrImage : "" ?? "",
    },
  });

  const [generateData, generateState] = useGenerate2faMutation();

  useEffect(() => {
    if (!generateState.error) return;
    const error = generateState.error as any;
    const status = error.status;

    if (status === 401) {
      passwordForm.setErrors({
        password: "Password is incorrect",
      });
    }
  }, [generateState.error]);

  useEffect(() => {
    if (!generateState.data) return;
    closeEnable2Fa();
    closeDisable2Fa();

    form.setValues({
      status: true,
      secret: generateState.data.data.secret,
      qrurl: generateState.data.data.qrImage,
    });
  }, [generateState.data]);

  const [disable2FaPwdOpen, { open: openDisable2Fa, close: closeDisable2Fa }] =
    useDisclosure(false);

  const [enable2FaPwdOpen, { open: openEnable2Fa, close: closeEnable2Fa }] =
    useDisclosure(false);

  useEffect(() => {
    if (!user) return;
    else if (!user.UserTwoFa) return;
    if (!user.UserTwoFa.verified) return;

    form.setFieldValue("status", true);
  }, [user]);

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // form.setFieldValue("status", event.target.checked);
    if (!event.target.checked) {
      openDisable2Fa();
    } else {
      openEnable2Fa();
    }

    // if event is true, then we need to generate a code
    // else if event is false then we need to show a modal that asks for user password to disable 2fa
  };

  const handleGenerate2fa = useCallback(async (password: string) => {
    if (!user) return;
    if (!accessToken) return;

    console.log("GENERATE");

    await generateData({
      email: user.email,
      token: accessToken,
      password,
    });
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <Text weight={600}>Two Factor Authentication</Text>
        <Switch
          offLabel="Off"
          onLabel="On"
          styles={() => ({
            trackLabel: {
              fontSize: "0.875rem",
            },
          })}
          checked={form.values.status}
          onChange={handleStatusChange}
        />
      </div>
      {form.values.status && (
        <>
          <div className="flex items-start mt-10">
            <div>
              <Text>
                Please Scan the QR with your preferred authenticator app
              </Text>
              <div className="w-[200px] h-[200px]">
                <img
                  className="w-full h-full object-contain"
                  src={form.values.qrurl}
                />
              </div>
            </div>
            <div className="w-full">
              <Text>Cant Scan QR Code?</Text>
              <TextInput label="Secret Key" {...form.getInputProps("secret")} />
            </div>
          </div>
          <Divider my="xs" label="FINALLY" labelPosition="center" />
          <form className="w-full">
            <Text>Enter Code from Authenticator App</Text>
            <PasswordInput
              label="Authenticator Code"
              {...form.getInputProps("token")}
            />
          </form>
        </>
      )}
      <PasswordModal
        twoFaStatus={false}
        modal={{
          opened: disable2FaPwdOpen,
          onClose: closeDisable2Fa,
        }}
        btnName="Disable 2FA"
        btnColor="red"
        onSubmit={form.onSubmit((v) => {
          console.log(v);
          form.setFieldValue("status", false);
          closeDisable2Fa();
        })}
        passwordForm={passwordForm}
      />

      <PasswordModal
        twoFaStatus={true}
        passwordForm={passwordForm}
        modal={{
          opened: enable2FaPwdOpen,
          onClose: closeEnable2Fa,
        }}
        btnName="Enable 2FA"
        btnColor="green"
        onSubmit={passwordForm.onSubmit((v) => {
          handleGenerate2fa(v.password);
        })}
      />
    </>
  );
}

function PasswordModal(props: {
  twoFaStatus: boolean;
  modal: ModalProps;
  onSubmit: () => void;
  btnName: string;
  btnColor: string;
  passwordForm: UseFormReturnType<{
    password: string;
  }>;
}) {
  return (
    <Modal radius={8} centered size="lg" {...props.modal}>
      <Text>
        To {props.twoFaStatus ? "Enable" : "Disable"} 2FA on this account, you
        need to enter your password.
      </Text>
      <form onSubmit={props.onSubmit} className="mt-5 grid gap-[12px]">
        <PasswordInput
          label="Password"
          {...props.passwordForm.getInputProps("password")}
        />
        <div className="flex gap-[12px]">
          <Button type="submit" variant="light" color={props.btnColor}>
            {props.btnName}
          </Button>
          <Button variant="light" onClick={close}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
