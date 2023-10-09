import React, { useEffect, useMemo } from "react";
import {
  Badge,
  Flex,
  Text,
  Card,
  Button,
  ActionIcon,
  Overlay,
  Tooltip,
  Divider,
  Modal,
} from "@mantine/core";
import {
  IconClock,
  IconClock2,
  IconEye,
  IconLogin,
  IconLogout,
  IconPlayerPlay,
} from "@tabler/icons";
import moment from "moment";
import {
  attendanceApi,
  useCheckInMutation,
  useCheckOutMutation,
  useTodayAttendanceQuery,
} from "../../../redux/attendance/attendance.query";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setTodayAttendance } from "../../../redux/attendance/attendance.slice";
import MyAttendances from "./MyAttendances";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";

function AttendanceCard(props: { token: string; isWorking: boolean }) {
  const data = useTodayAttendanceQuery({ token: props.token });
  const [openAttendanceHistory, { open, close }] = useDisclosure(false);
  const { todayAttendance } = useAppSelector(
    (state) => state.attendanceReducer
  );

  const [checkIn, checkInState] = useCheckInMutation();
  const [checkOut, checkoutState] = useCheckOutMutation();

  const canCheckIn = useMemo(() => {
    if (todayAttendance === null) return false;
    if (todayAttendance.checkInTime !== null) return false;
    else if (todayAttendance.checkOutTime !== null) return false;
    else return true;
  }, [todayAttendance, data]);

  const canCheckOut = useMemo(() => {
    if (todayAttendance === null) return false;
    else if (todayAttendance.checkInTime === null) return false;
    else if (todayAttendance.checkOutTime !== null) return false;
    else return true;
  }, [todayAttendance, data]);

  const dispatch = useAppDispatch();

  const handleCheckIn = async () => {
    try {
      await checkIn({
        token: props.token,
        checkInTime: new Date(),
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleCheckOut = async () => {
    if (!todayAttendance) return;
    const attendanceId = todayAttendance.id;
    try {
      await checkOut({
        token: props.token,
        checkOutTime: new Date(),
        attendanceId: attendanceId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (data.data) dispatch(setTodayAttendance(data.data.data));
  }, [data.data]);

  useEffect(() => {
    data.refetch();
  }, [checkInState.isSuccess, checkoutState.isSuccess]);

  useEffect(() => {
    if (!checkInState.error) return;

    showNotification({
      title: "Error",
      message: (checkInState.error as any).data.message,
    });
  }, [checkInState.error]);

  return (
    <Card
      withBorder
      p="xl"
      radius="md"
      shadow="sm"
      style={{
        position: "relative",
        width: "401px",
        minHeight: "178px",
      }}
    >
      {data.isLoading ? (
        <>Loading</>
      ) : (
        <>
          <Flex gap={10} align="start" direction="column">
            <Flex gap={10} justify="space-between" w="100%">
              <Text weight={700} w="100%">
                Attendance
              </Text>
              {props.isWorking && (
                <Flex gap={10} align="center" justify="end" w="100%">
                  <IconClock />
                  <span>
                    {todayAttendance
                      ? todayAttendance.duration
                        ? //this is in secs
                          moment
                            .utc(todayAttendance.duration * 1000)
                            .format("HH:mm:ss")
                        : "Not Finished"
                      : "Not Started"}
                  </span>
                </Flex>
              )}
            </Flex>
            {props.isWorking && (
              <>
                <Flex justify="space-between" align="center" w="100%">
                  <Flex direction="column" gap={20}>
                    <div>
                      <Text weight={600}>Checked in At</Text>
                      {todayAttendance?.checkInTime === null ? (
                        <span>Not Checked In</span>
                      ) : (
                        <Text>
                          {moment(todayAttendance?.checkInTime).format(
                            "hh:mm A"
                          )}
                        </Text>
                      )}
                    </div>
                    <div>
                      <Text weight={600}>Checked Out At</Text>
                      {todayAttendance === null ||
                      (todayAttendance &&
                        todayAttendance.checkOutTime === null) ? (
                        <span>Not Checked Out</span>
                      ) : (
                        <Text>
                          {moment(todayAttendance.checkOutTime).format(
                            "hh:mm A"
                          )}
                        </Text>
                      )}
                    </div>
                  </Flex>
                  {todayAttendance && (
                    <Flex gap={10} direction="column" align="end">
                      {todayAttendance.wasLate !== null && (
                        <AttendanceInfoBadge
                          status={!todayAttendance.wasLate}
                          trueTxt="On Time"
                          falseTxt="Late"
                        />
                      )}
                      {todayAttendance.minHrAchieved !== null && (
                        <AttendanceInfoBadge
                          status={todayAttendance.minHrAchieved}
                          trueTxt="Hours Met"
                          falseTxt="Hours Not Met"
                        />
                      )}
                      {todayAttendance.wasOvertime !== null && (
                        <AttendanceInfoBadge
                          status={todayAttendance.wasOvertime}
                          trueTxt="Overtime"
                          falseTxt="Undertime"
                        />
                      )}
                    </Flex>
                  )}
                </Flex>
                <Divider />
                <Flex align="center" gap={20}>
                  <Flex gap={15}>
                    <Tooltip label="Check In Today">
                      <ActionIcon
                        size="xl"
                        radius={100}
                        variant="light"
                        color="green"
                        loading={checkInState.isLoading}
                        onClick={handleCheckIn}
                        disabled={!canCheckIn}
                      >
                        <IconLogin />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Check Out Today">
                      <ActionIcon
                        size="xl"
                        radius={100}
                        variant="light"
                        color="red"
                        loading={checkoutState.isLoading}
                        onClick={handleCheckOut}
                        disabled={!canCheckOut}
                      >
                        <IconLogout />
                      </ActionIcon>
                    </Tooltip>
                  </Flex>
                  <Text>|</Text>
                  <Flex gap={15}>
                    <Tooltip label="View Previous Attendances">
                      <ActionIcon
                        size="xl"
                        radius={100}
                        variant="light"
                        color="blue"
                        onClick={open}
                      >
                        <IconEye />
                      </ActionIcon>
                    </Tooltip>
                  </Flex>
                </Flex>
              </>
            )}
          </Flex>
          {!props.isWorking && (
            <Overlay
              color="#000"
              opacity={0.65}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text color="gray.0" size={20}>
                You are not Working Today
              </Text>
            </Overlay>
          )}
        </>
      )}
      <Modal
        opened={openAttendanceHistory}
        onClose={close}
        title="My Attendances"
        centered
        radius={8}
        size="xl"
        styles={() => ({
          title: {
            fontSize: "1.25rem",
            fontWeight: 700,
          },
        })}
      >
        <MyAttendances />
      </Modal>
    </Card>
  );
}

type T_AttendsanceInfoProps = {
  status: boolean;
  trueTxt: string;
  falseTxt: string;
};

function AttendanceInfoBadge(props: T_AttendsanceInfoProps) {
  return (
    <Badge color={props.status ? "green" : "red"} variant="light">
      {props.status ? props.trueTxt : props.falseTxt}
    </Badge>
  );
}

export default AttendanceCard;
