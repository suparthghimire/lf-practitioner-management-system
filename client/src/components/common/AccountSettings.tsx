import React from "react";
import { Practitioner } from "../../models/Practitioner";
import { DisplayUser, User } from "../../models/User";
import { Accordion, Tabs, useMantineTheme } from "@mantine/core";
import UserGeneral from "../forms/user/General";
import PractitionerGeneral from "../forms/practitioner/General";
import UserPassword from "../forms/user/Password";
import PractitionerPassword from "../forms/practitioner/Password";
import UserTwoFactorAuth from "../forms/user/2FA";
import PractitionerTwoFactorAuth from "../forms/practitioner/2FA";
import { IconKey, IconPassword, IconUser } from "@tabler/icons";

type T_Practitioner = {
  type: "practitioner";
  data: Practitioner;
};
type T_User = {
  type: "user";
  data: DisplayUser;
};

type T_Props = T_Practitioner | T_User;
export default function AccountSettings(props: T_Props) {
  const theme = useMantineTheme();
  const getColor = (color: string) =>
    theme.colors[color][theme.colorScheme === "dark" ? 5 : 7];

  return (
    <Tabs
      defaultValue="general"
      styles={() => ({
        tabsList: {
          marginBottom: "1rem",
        },
      })}
    >
      <Tabs.List grow>
        <Tabs.Tab value="general">General</Tabs.Tab>
        <Tabs.Tab value="password">Password</Tabs.Tab>
        <Tabs.Tab value="2fa">2FA</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="general">
        {props.type === "user" && <UserGeneral user={props.data} />}
        {props.type === "practitioner" && <PractitionerGeneral />}
      </Tabs.Panel>
      <Tabs.Panel value="password">
        {props.type === "user" && <UserPassword />}
        {props.type === "practitioner" && <PractitionerPassword />}
      </Tabs.Panel>
      <Tabs.Panel value="2fa">
        {props.type === "user" && <UserTwoFactorAuth />}
        {props.type === "practitioner" && <PractitionerTwoFactorAuth />}
      </Tabs.Panel>
    </Tabs>
  );
}

// <Accordion defaultValue="customization">
// <Accordion.Item value="customization">
//   <Accordion.Control icon={<IconUser color={getColor("green")} />}>
//     General
//   </Accordion.Control>
//   <Accordion.Panel>
//     {props.type === "user" && <UserGeneral />}
//     {props.type === "practitioner" && <PractitionerGeneral />}
//   </Accordion.Panel>
// </Accordion.Item>

// <Accordion.Item value="flexibility">
//   <Accordion.Control icon={<IconPassword color={getColor("red")} />}>
//     Password
//   </Accordion.Control>
//   <Accordion.Panel>
//     {props.type === "user" && <UserPassword />}
//     {props.type === "practitioner" && <PractitionerPassword />}
//   </Accordion.Panel>
// </Accordion.Item>

// <Accordion.Item value="focus-ring">
//   <Accordion.Control icon={<IconKey color={getColor("yellow")} />}>
//     2 Factor Authentication
//   </Accordion.Control>
//   <Accordion.Panel>
//     {props.type === "user" && <UserTwoFactorAuth />}
//     {props.type === "practitioner" && <PractitionerTwoFactorAuth />}
//   </Accordion.Panel>
// </Accordion.Item>
// </Accordion>
