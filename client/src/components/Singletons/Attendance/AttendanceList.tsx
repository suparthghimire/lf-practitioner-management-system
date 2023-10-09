import React from "react";
import { T_Attendance } from "../../../models/Attendance";
import { ScrollArea, Table, Text } from "@mantine/core";
import moment from "moment";
type T_Props = {
  attendances: T_Attendance[];
};
export default function AttendanceList(props: T_Props) {
  if (props.attendances.length <= 0) return <Text>No Attendance Found</Text>;
  return (
    <ScrollArea
      style={{
        maxHeight: "300px",
      }}
    >
      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Checked In At</th>
            <th>Checked Out At</th>
            <th>Duration</th>
            <th>Late</th>
            <th>Min Hour Met</th>
            <th>Overtime</th>
          </tr>
        </thead>

        <tbody>
          {props.attendances.map((attendance) => (
            <tr key={attendance.id}>
              <td>{moment(attendance.date).format("do MMM YYYY, ddd")}</td>
              <td>
                {attendance.checkInTime
                  ? moment(attendance.checkInTime).format("hh:mm A")
                  : "Not Checked In"}
              </td>
              <td>
                {attendance.checkOutTime
                  ? moment(attendance.checkOutTime).format("hh:mm A")
                  : "Not Checked Out"}
              </td>
              <td>
                {attendance.duration
                  ? moment.utc(attendance.duration * 1000).format("HH:mm:ss")
                  : "Not Checked Out"}
              </td>
              <td>{attendance.wasLate ? "Yes" : "No"}</td>
              <td>{attendance.minHrAchieved ? "Yes" : "No"}</td>
              <td>{attendance.wasOvertime ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </ScrollArea>
  );
}
