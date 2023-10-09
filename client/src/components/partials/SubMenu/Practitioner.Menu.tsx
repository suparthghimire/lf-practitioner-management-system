import { Menu } from "@mantine/core";
import { IconDoorExit, IconSettings, IconUser } from "@tabler/icons";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { resetUser } from "../../../redux/auth/auth.slice";
import { Modal } from "@mantine/core";
import { useSignoutMutation } from "../../../redux/auth/auth.query";
import { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import UserInfo from "../../common/UserInfo";
import AccountSettings from "../../common/AccountSettings";
import { Link, useNavigate } from "react-router-dom";
import { resetPractitioner } from "../../../redux/auth/practitioner/auth.slice";

export default function PractitionerMenu() {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [prfViewOpem, { open: prfViewOpen, close: prfViewClose }] =
    useDisclosure(false);

  const [accSetOpened, { open: accStOpen, close: accStClose }] =
    useDisclosure(false);

  const { practitioner } = useAppSelector(
    (state) => state.practitionerAuthReducer
  );

  // if user signs out , thenreset the user
  return (
    <>
      <Menu.Dropdown>
        <Menu.Item icon={<IconUser size={14} />} onClick={prfViewOpen}>
          View Profile
        </Menu.Item>
        {/* <Menu.Item icon={<IconSettings size={14} />} onClick={accStOpen}>
          Account Settings
        </Menu.Item> */}
        {/* <Link to="/practitioner/signin"> */}
        <Menu.Item
          color="red"
          icon={<IconDoorExit size={14} />}
          onClick={() => {
            // resetPractitioner();
            window.location.href = "/practitioner/signin";
            // navigate("/practitioner/signin");
          }}
        >
          Log Out
        </Menu.Item>
        {/* </Link> */}
      </Menu.Dropdown>
      {practitioner && (
        <Modal
          centered
          title="User Profile"
          opened={prfViewOpem}
          onClose={prfViewClose}
        >
          <UserInfo
            onClose={prfViewClose}
            user={{
              id: practitioner.id,
              name: practitioner.fullname,
              email: practitioner.email,
            }}
          />
        </Modal>
      )}
      {practitioner && (
        <Modal
          centered
          title="Account Settings"
          opened={accSetOpened}
          onClose={accStClose}
          size="xl"
        >
          <AccountSettings data={practitioner} type="practitioner" />
        </Modal>
      )}
    </>
  );
}
