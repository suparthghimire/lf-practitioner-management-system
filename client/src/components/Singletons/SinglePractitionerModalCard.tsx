import { Practitioner } from "../../models/Practitioner";
import {
  Group,
  Text,
  Badge,
  Avatar,
  createStyles,
  Box,
  Flex,
} from "@mantine/core";

import { IconPhoneCall, IconAt } from "@tabler/icons";

const useStyles = createStyles((theme) => ({
  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[5],
  },

  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

export default function SinglePractitionerModalCard({
  practitioner,
}: {
  practitioner: Practitioner;
}) {
  const { classes } = useStyles();
  return (
    <div>
      <Group noWrap>
        <Avatar src={practitioner.image} size={94} radius="md" />
        <div>
          <Text
            size="xs"
            sx={{ textTransform: "uppercase" }}
            weight={700}
            color="dimmed"
          >
            Works {practitioner.WorkingDays.length} day
            {practitioner.WorkingDays.length > 1 && "s"}
          </Text>

          <Text size="lg" weight={500} className={classes.name}>
            {practitioner.fullname}
          </Text>

          <Group noWrap spacing={10} mt={3}>
            <IconAt stroke={1.5} size={16} className={classes.icon} />
            <Text size="xs" color="dimmed">
              {practitioner.email}
            </Text>
          </Group>

          <Group noWrap spacing={10} mt={5}>
            <IconPhoneCall stroke={1.5} size={16} className={classes.icon} />
            <Text size="xs" color="dimmed">
              {practitioner.contact}
            </Text>
          </Group>
        </div>
      </Group>
      <Box mt="xl">
        <Text
          size="xs"
          sx={{ textTransform: "uppercase" }}
          weight={700}
          color="dimmed"
        >
          Working Days
        </Text>
        <Flex gap="sm" wrap="wrap">
          {practitioner.WorkingDays.map((day) => {
            const dataFromAPI = day as unknown as {
              id: number;
              day: string;
            };
            return (
              <Badge
                key={`working-day-practitioner-${dataFromAPI.day}`}
                variant="light"
                color="blue"
              >
                {dataFromAPI.day}
              </Badge>
            );
          })}
        </Flex>
      </Box>
      <Box mt="xl">
        {practitioner.Specializations &&
        practitioner.Specializations.length > 0 ? (
          <>
            <Text
              size="xs"
              sx={{ textTransform: "uppercase" }}
              weight={700}
              color="dimmed"
            >
              Specialization
            </Text>
            <Flex gap="sm" wrap="wrap">
              {practitioner.Specializations.map((spec) => {
                const dataFromAPI = spec as unknown as {
                  id: number;
                  name: string;
                };
                return (
                  <Badge
                    key={`working-day-practitioner-${dataFromAPI.name}`}
                    variant="light"
                    color="blue"
                  >
                    {dataFromAPI.name}
                  </Badge>
                );
              })}
            </Flex>
          </>
        ) : (
          <Text size="sm" italic color="dimmed">
            No specializations Specified for{" "}
            {practitioner.fullname.split(" ")[0]}
          </Text>
        )}
      </Box>
    </div>
  );
}
