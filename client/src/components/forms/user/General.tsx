import React from "react";
import { DisplayUser } from "../../../models/User";
import { Button, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function UserGeneral(props: { user: DisplayUser }) {
  const form = useForm<DisplayUser>({
    initialValues: props.user,
  });
  return (
    <form className="w-full grid gap-[12px]">
      <Text weight={600}>Update General Info</Text>
      <TextInput {...form.getInputProps("name")} label="Name" />
      <TextInput {...form.getInputProps("email")} label="Email" />
      <Button variant="light" type="submit">
        Update Info
      </Button>
    </form>
  );
}
