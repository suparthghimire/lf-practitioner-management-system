import { useEffect, useState } from "react";
import { Practitioner } from "../../models/Practitioner";
import moment from "moment";
import { Badge, Switch, Group, Tooltip, ActionIcon, Flex } from "@mantine/core";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons";
import HELPERS from "../../utils/helpers";

export default function PractitionerTableRow({
  practitioner,
  sn,
}: {
  practitioner: Practitioner;
  sn: number;
}) {
  const [isIcuSpecialist, setIsIcuSpecialist] = useState(false);
  useEffect(() => {
    if (practitioner.icuSpecialist === true) {
      setIsIcuSpecialist(true);
    }
  }, []);

  console.log(practitioner, isIcuSpecialist);

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
        <Flex gap="sm">
          <Tooltip
            label={`View ${HELPERS.TrailingDot(practitioner.fullname, 10)}`}
          >
            <ActionIcon color="blue" variant="light">
              <IconEye />
            </ActionIcon>
          </Tooltip>
          <Tooltip
            label={`Edit ${HELPERS.TrailingDot(practitioner.fullname, 10)}`}
          >
            <ActionIcon color="orange" variant="light">
              <IconEdit />
            </ActionIcon>
          </Tooltip>
          <Tooltip
            label={`Delete ${HELPERS.TrailingDot(practitioner.fullname, 10)}`}
          >
            <ActionIcon color="red" variant="light">
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </td>
    </tr>
  );
}
