import { useEffect } from "react";
import { useAllAttendancesQuery } from "../../../redux/attendance/attendance.query";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setAttendances } from "../../../redux/attendance/attendance.slice";
import { Table } from "@mantine/core";
import moment from "moment";
import AttendanceList from "./AttendanceList";

export default function MyAttendances() {
  const { practitioner, accessToken } = useAppSelector(
    (state) => state.practitionerAuthReducer
  );
  const { attendances } = useAppSelector((state) => state.attendanceReducer);
  const data = useAllAttendancesQuery({
    token: accessToken ?? "",
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data.data) dispatch(setAttendances(data.data.data));
  }, [data.data]);

  if (data.isLoading) return <>Loading</>;

  return <AttendanceList attendances={attendances} />;
}
