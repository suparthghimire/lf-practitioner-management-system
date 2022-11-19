import { useEffect, useState } from "react";
import { Practitioner } from "../../models/Practitioner";
import moment from "moment";
import {
  Badge,
  Switch,
  Tooltip,
  ActionIcon,
  Flex,
  Modal,
  Group,
  Button,
} from "@mantine/core";
import {
  IconCheck,
  IconEdit,
  IconEye,
  IconFileDatabase,
  IconTrash,
  IconX,
} from "@tabler/icons";
import HELPERS from "../../utils/helpers";
import SinglePractitionerModalCard from "./SinglePractitionerModalCard";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { User } from "../../models/User";
import { useDeletePractitionerMutation } from "../../redux/practitioner/practitioner.query";
import { showNotification, updateNotification } from "@mantine/notifications";

import { removePractitionerById } from "../../redux/practitioner/practitioner.slice";

export default function PractitionerTableRow({
  practitioner,
  sn,
}: {
  practitioner: Practitioner;
  sn: number;
}) {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { user, accessToken } = useAppSelector((state) => state.authReducer);
  const dispatch = useAppDispatch();
  const [deletePractitioner, { isLoading, isSuccess, isError, error, data }] =
    useDeletePractitionerMutation();

  useEffect(() => {
    if (isSuccess) {
      updateNotification({
        title: "Deletion Successful",
        message: "Deletion Successful",
        color: "green",
        icon: <IconCheck />,
        id: "delete-practitioner",
      });
      dispatch(removePractitionerById(practitioner.id as number));
      setDeleteModalOpen(false);
    } else if (isError) {
      updateNotification({
        title: "Deletion Failed",
        message: "There was an error while deleting the practitioner",
        color: "red",
        icon: <IconX />,
        id: "delete-practitioner",
      });
    } else if (isLoading) {
      showNotification({
        title: "Deleting Practitioner",
        message: "Please wait...",
        color: "blue",
        loading: true,
        id: "delete-practitioner",
      });
    }
  }, [isLoading, isError, isSuccess]);

  return (
    <tr>
      <td>{sn}</td>
      <td>{practitioner.id}</td>
      <td>{practitioner.fullname}</td>
      <td>{HELPERS.TrailingDot(practitioner.contact, 10)}</td>
      <td>{moment(practitioner.dob).format("LL")}</td>
      <td>
        <Flex align="flex-end" gap="sm">
          {practitioner.icuSpecialist === true ? (
            <Badge variant="light" color="green">
              Yes
            </Badge>
          ) : (
            <Badge variant="light" color="red">
              No
            </Badge>
          )}
          <Switch
            size="sm"
            color="green"
            checked={practitioner.icuSpecialist === true}
            disabled={
              user
                ? user.id === (practitioner.createdBy as unknown as User).id
                  ? false
                  : true
                : false
            }
          />
        </Flex>
      </td>
      <td>
        <Flex gap="sm">
          {practitioner.WorkingDays.map((day, idx) => {
            return (
              <Tooltip
                key={`working-day-practitioner-${day}-${idx}`}
                label={day.day}
              >
                <Badge variant="light" color="blue">
                  {day.day.substring(0, 3)}
                </Badge>
              </Tooltip>
            );
          })}
        </Flex>
      </td>
      <td>
        {moment(practitioner.startTime).format("LT")} to{" "}
        {moment(practitioner.endTime).format("LT")}
      </td>

      <td>
        <Flex gap="sm">
          <Tooltip
            label={`View ${HELPERS.TrailingDot(practitioner.fullname, 10)}`}
          >
            <ActionIcon
              onClick={() => setViewModalOpen(true)}
              color="blue"
              variant="light"
            >
              <IconEye />
            </ActionIcon>
          </Tooltip>
          <Tooltip
            label={`Edit ${HELPERS.TrailingDot(practitioner.fullname, 10)}`}
          >
            <ActionIcon
              color="orange"
              variant="light"
              disabled={
                user
                  ? user.id === (practitioner.createdBy as unknown as User).id
                    ? false
                    : true
                  : false
              }
            >
              <IconEdit />
            </ActionIcon>
          </Tooltip>
          <Tooltip
            label={`Delete ${HELPERS.TrailingDot(practitioner.fullname, 10)}`}
          >
            <ActionIcon
              disabled={
                user
                  ? user.id === (practitioner.createdBy as unknown as User).id
                    ? false
                    : true
                  : false
              }
              onClick={() => setDeleteModalOpen(true)}
              color="red"
              variant="light"
            >
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </td>
      <Modal
        opened={viewModalOpen}
        centered
        title={practitioner.fullname}
        onClose={() => setViewModalOpen(false)}
      >
        <SinglePractitionerModalCard practitioner={practitioner} />
      </Modal>
      <Modal
        opened={deleteModalOpen}
        centered
        title="Delete Confirmation"
        onClose={() => setDeleteModalOpen(false)}
      >
        Are you sure you want to delete {practitioner.fullname} ?
        <Group mt="xl">
          <Button
            onClick={() => setDeleteModalOpen(false)}
            variant="light"
            color="blue"
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await deletePractitioner({
                id: practitioner.id as number,
                token: accessToken as string,
              });
            }}
            variant="light"
            color="red"
          >
            Yes, Delete
          </Button>
        </Group>
      </Modal>
    </tr>
  );
}
