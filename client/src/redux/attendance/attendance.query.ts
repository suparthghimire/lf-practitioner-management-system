import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../queryWrapper";
import { T_Attendance } from "../../models/Attendance";

/**
 * RTK Query API definition for attendance Endpoints
 */

export const attendanceApi = createApi({
  reducerPath: "attendance",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    todayAttendance: builder.query({
      query: ({ token }: { token: string }) => ({
        url: "/attendance/today",
        headers: {
          authorization: token,
        },
        credentials: "include",
      }),
    }),
    allAttendances: builder.query({
      query: ({ token }: { token: string }) => ({
        url: `/attendance`,
        headers: {
          authorization: token,
        },
        credentials: "include",
      }),
    }),

    checkIn: builder.mutation({
      query: ({
        token,
        checkInTime,
      }: {
        token: string;
        checkInTime: Date;
      }) => ({
        url: `/attendance/checkin`,
        method: "POST",
        headers: {
          authorization: token,
        },
        credentials: "include",
        body: {
          checkInTime,
        },
      }),
    }),
    checkOut: builder.mutation({
      query: ({
        token,
        checkOutTime,
        attendanceId,
      }: {
        token: string;
        checkOutTime: Date;
        attendanceId: number;
      }) => ({
        url: "/attendance/checkout",
        method: "PUT",
        headers: {
          authorization: token,
        },
        credentials: "include",
        body: {
          checkOutTime,
          attendanceId,
        },
      }),
    }),
  }),
});

export const {
  useTodayAttendanceQuery,
  useAllAttendancesQuery,
  useCheckInMutation,
  useCheckOutMutation,
} = attendanceApi;
