import React from "react";
import { Text, Flex, Divider, Button } from "@mantine/core";
export default function UserInfo(props: {
  user: {
    id: number | undefined;
    name: string;
    email: string;
  };
  onClose: () => void;
}) {
  return (
    <>
      <Flex gap="sm">
        <Text weight="bold">Id</Text>
        {props.user.id}
      </Flex>
      <Flex gap="sm">
        <Text weight="bold">Name</Text>
        {props.user.name}
      </Flex>
      <Flex gap="sm">
        <Text weight="bold">Email</Text>
        {props.user.email}
      </Flex>
      <Divider my="lg" />
      <Button variant="light" onClick={props.onClose}>
        Close
      </Button>
    </>
  );
}
