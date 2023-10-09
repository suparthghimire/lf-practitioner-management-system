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

export default function UserMenu() {
  const dispatch = useAppDispatch();
  const [signout, { isSuccess }] = useSignoutMutation();

  const [prfViewOpem, { open: prfViewOpen, close: prfViewClose }] =
    useDisclosure(false);

  const [accSetOpened, { open: accStOpen, close: accStClose }] =
    useDisclosure(false);

  const { user } = useAppSelector((state) => state.authReducer);
  // if user signs out , thenreset the user
  useEffect(() => {
    if (isSuccess) {
      dispatch(resetUser());
    }
  }, [isSuccess]);
  return (
    <>
      <Menu.Dropdown>
        <Menu.Item icon={<IconUser size={14} />} onClick={prfViewOpen}>
          View Profile
        </Menu.Item>
        {/* <Menu.Item icon={<IconSettings size={14} />} onClick={accStOpen}>
          Account Settings
        </Menu.Item> */}
        <Menu.Item
          color="red"
          icon={<IconDoorExit size={14} />}
          onClick={async () => {
            await signout("");
          }}
        >
          Log Out
        </Menu.Item>
      </Menu.Dropdown>
      {user && (
        <Modal
          centered
          title="User Profile"
          opened={prfViewOpem}
          onClose={prfViewClose}
        >
          <UserInfo
            onClose={prfViewClose}
            user={{
              id: user.id,
              name: user.name,
              email: user.email,
            }}
          />
        </Modal>
      )}
      {user && (
        <Modal
          centered
          title="Account Settings"
          opened={accSetOpened}
          onClose={accStClose}
          size="xl"
        >
          <AccountSettings data={user} type="user" />
        </Modal>
      )}
    </>
  );
}
