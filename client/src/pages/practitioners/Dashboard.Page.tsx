import { useMemo } from "react";
import UserPageLayout from "../../components/Layouts/UserPageLayout";
import { useAppSelector } from "../../redux/hooks";
import { Badge, Flex, Text, Card, Box } from "@mantine/core";

import moment from "moment";
import AttendanceCard from "../../components/Singletons/Attendance/AttendanceCard";

const PractitionerDashboard = () => {
  const { practitioner, accessToken } = useAppSelector(
    (state) => state.practitionerAuthReducer
  );

  const isWorkingToday = useMemo(() => {
    const todayWeekDay = moment().format("dddd");
    console.log("todayWeekDay", todayWeekDay);
    const isWorkingToday =
      practitioner?.WorkingDays?.some(
        (day: any) => day.day.toLowerCase() === todayWeekDay.toLowerCase()
      ) ?? false;
    return isWorkingToday;
  }, [practitioner]);

  if (!practitioner || !accessToken) return <>Not Authorized</>;
  return (
    <UserPageLayout
      title={"Welcome Back " + practitioner.fullname ?? "Practitioner"}
    >
      <Box mb={10}>
        <AttendanceCard token={accessToken} isWorking={isWorkingToday} />
      </Box>
      <Flex gap={10} wrap="wrap" align="center">
        <Card withBorder p="xl" radius="md" shadow="sm">
          <Flex gap={10} align="center">
            <Text weight={700}>Working Days:</Text>
            {practitioner.WorkingDays.map((day: any) => (
              <Badge key={day.day}>{day.day}</Badge>
            ))}
          </Flex>
        </Card>
        <Card withBorder p="xl" radius="md" shadow="sm">
          <Flex gap={10} align="center">
            <Text weight={700}>Specializations:</Text>
            {practitioner.Specializations?.map((spc: any) => (
              <Badge key={spc.id}>{spc.name}</Badge>
            ))}
          </Flex>
        </Card>
      </Flex>
    </UserPageLayout>
  );
};

export default PractitionerDashboard;
