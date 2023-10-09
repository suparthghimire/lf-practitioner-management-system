import { useEffect, useMemo, useState } from "react";
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
import { T_Attendance } from "../../models/Attendance";

export default function PractitionerTableRow({
  practitioner,
  sn,
  refetch,
}: {
  practitioner: Practitioner & { Attendance: T_Attendance[] };
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
        <RenderAttendance attendance={practitioner.Attendance} />
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

function RenderAttendance(props: { attendance: T_Attendance[] }) {
  const attendance = useMemo(() => props.attendance.at(0), [props.attendance]);

  if (!attendance)
    return (
      <Badge color="red" variant="light">
        Not Working Today
      </Badge>
    );

  if (!attendance.checkInTime)
    return (
      <Badge color="red" variant="light">
        Not Checked in
      </Badge>
    );
  if (!attendance.checkOutTime)
    return (
      <Badge color="red" variant="light">
        Not Checked Out
      </Badge>
    );
  return (
    <div className="flex max-w-[350px] flex-wrap gap-4">
      <Badge color="green" variant="light">
        Present Today from {moment(attendance.checkInTime).format("LT")} to{" "}
        {moment(attendance.checkOutTime).format("LT")}
      </Badge>
      {attendance.wasLate !== null && (
        <Badge color={attendance.wasLate ? "red" : "green"} variant="light">
          {attendance.wasLate ? "Late" : "On Time"}
        </Badge>
      )}
      {attendance.minHrAchieved !== null && (
        <Badge
          color={attendance.minHrAchieved ? "green" : "red"}
          variant="light"
        >
          {attendance.minHrAchieved ? "Hrs Met" : "Hrs Not Met"}
        </Badge>
      )}
      {attendance.wasOvertime !== null && (
        <Badge color="blue" variant="light">
          {attendance.wasOvertime ? "Overtime" : "Not Overtime"}
        </Badge>
      )}
      {attendance.duration !== null && (
        <Badge color="blue" variant="light">
          Total Hrs Worked:{" "}
          {moment.utc(attendance.duration * 1000).format("HH:mm:ss")} hrs
        </Badge>
      )}
    </div>
  );
}
