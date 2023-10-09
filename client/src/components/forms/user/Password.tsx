import React from "react";
import { DisplayUser } from "../../../models/User";
import { Button, PasswordInput, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function UserGeneral() {
  const form = useForm({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  return (
    <form className="w-full grid gap-[12px]">
      <Text weight={600}>Change Password</Text>
      <PasswordInput
        {...form.getInputProps("oldPassword")}
        label="Old Password"
      />
      <PasswordInput
        {...form.getInputProps("newPassword")}
        label="New Password"
      />
      <PasswordInput
        {...form.getInputProps("confirmPassword")}
        label="Confirm Password"
      />
      <Button variant="light" type="submit">
        Update Info
      </Button>
    </form>
  );
}
