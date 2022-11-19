import { useEffect, useState } from "react";
import { Practitioner } from "../../models/Practitioner";
import moment from "moment";
import { Badge, Switch, Tooltip, ActionIcon, Flex, Modal } from "@mantine/core";
import { IconEdit, IconEye, IconFileDatabase, IconTrash } from "@tabler/icons";
import HELPERS from "../../utils/helpers";
import SinglePractitionerModalCard from "./SinglePractitionerModalCard";
import { useAppSelector } from "../../redux/hooks";
import { User } from "../../models/User";

export default function PractitionerTableRow({
  practitioner,
  sn,
}: {
  practitioner: Practitioner;
  sn: number;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const { user, accessToken } = useAppSelector((state) => state.authReducer);

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
            // onChange={(event) =>
            //   setIsIcuSpecialist(event.currentTarget.checked)
            // }
            label=""
          />
        </Flex>
      </td>
      <td>
        <Flex gap="sm">
          {practitioner.WorkingDays.map((day) => {
            return (
              <Tooltip label={day.day}>
                <Badge
                  key={`working-day-practitioner-${day}`}
                  variant="light"
                  color="blue"
                >
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
              onClick={() => setModalOpen(true)}
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
              color="red"
              variant="light"
            >
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </td>
      <Modal
        opened={modalOpen}
        centered
        title={practitioner.fullname}
        onClose={() => setModalOpen(false)}
      >
        <SinglePractitionerModalCard practitioner={practitioner} />
      </Modal>
    </tr>
  );
}
