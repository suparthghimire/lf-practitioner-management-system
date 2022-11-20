import { useEffect, useState } from "react";
import { Practitioner } from "../../models/Practitioner";
import moment from "moment";
import { Link } from "react-router-dom";
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
import { IconCheck, IconEdit, IconEye, IconTrash, IconX } from "@tabler/icons";
import HELPERS from "../../utils/helpers";
import SinglePractitionerModalCard from "./SinglePractitionerModalCard";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { User } from "../../models/User";
import {
  useDeletePractitionerMutation,
  useToggleIcuSpecialistMutation,
} from "../../redux/practitioner/practitioner.query";
import { showNotification, updateNotification } from "@mantine/notifications";

import { removePractitionerById } from "../../redux/practitioner/practitioner.slice";

export default function PractitionerTableRow({
  practitioner,
  sn,
  refetch,
}: {
  practitioner: Practitioner;
  sn: number;
  refetch: Function;
}) {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isIcuSpecialist, setIsIcuSpecialist] = useState(
    practitioner.icuSpecialist === true ? true : false
  );
  const { user, accessToken } = useAppSelector((state) => state.authReducer);
  const dispatch = useAppDispatch();
  const [
    deletePractitioner,
    {
      isLoading: deleteLoading,
      isSuccess: deleteSuccess,
      isError: deleteError,
    },
  ] = useDeletePractitionerMutation();

  const [
    toggleIcuSpecialist,
    {
      isLoading: icuSpecialistLoading,
      isSuccess: icuSpecialistSuccess,
      isError: icuSpecialistError,
    },
  ] = useToggleIcuSpecialistMutation();

  useEffect(() => {
    if (icuSpecialistSuccess) {
      refetch();
    }
  }, [icuSpecialistSuccess]);

  useEffect(() => {
    if (deleteSuccess) {
      updateNotification({
        title: "Deletion Successful",
        message: "Deletion Successful",
        color: "green",
        icon: <IconCheck />,
        id: "delete-practitioner",
      });
      dispatch(removePractitionerById(practitioner.id as number));
      refetch();
      setDeleteModalOpen(false);
    } else if (deleteError) {
      updateNotification({
        title: "Deletion Failed",
        message: "There was an error while deleting the practitioner",
        color: "red",
        icon: <IconX />,
        id: "delete-practitioner",
      });
    } else if (deleteLoading) {
      showNotification({
        title: "Deleting Practitioner",
        message: "Please wait...",
        color: "blue",
        loading: true,
        id: "delete-practitioner",
      });
    }
  }, [deleteLoading, deleteError, deleteSuccess]);

  return (
    <tr>
      <td>{sn}</td>
      <td>{practitioner.id}</td>
      <td>{practitioner.fullname}</td>
      <td>{HELPERS.TrailingDot(practitioner.contact, 10)}</td>
      <td>{moment(practitioner.dob).format("LL")}</td>
      <td>
        <Flex align="flex-end" gap="sm">
          {isIcuSpecialist === true ? (
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
            checked={isIcuSpecialist}
            onChange={async (e) => {
              setIsIcuSpecialist(e.target.checked);
              await toggleIcuSpecialist({
                practitionerId: practitioner.id as number,
                status: e.target.checked,
                token: accessToken as string,
              });
            }}
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
            const dataFrpmApi: { id: number; day: string } = day as unknown as {
              id: number;
              day: string;
            };
            return (
              <Tooltip
                key={`working-day-practitioner-${day}-${idx}`}
                label={dataFrpmApi.day}
              >
                <Badge variant="light" color="blue">
                  {dataFrpmApi.day.substring(0, 3)}
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
              component={Link}
              to={`/practitioner/${practitioner.id}/edit`}
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
