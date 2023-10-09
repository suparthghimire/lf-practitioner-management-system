import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { T_Attendance } from "../../models/Attendance";

/**
 * Manages the state of the Attendance
 */

export interface AttendanceState {
  attendances: T_Attendance[];
  todayAttendance: T_Attendance | null;
}

const initialState: AttendanceState = {
  attendances: [],
  todayAttendance: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    setAttendances(state, action: PayloadAction<T_Attendance[]>) {
      state.attendances = action.payload;
    },
    setTodayAttendance(state, action: PayloadAction<T_Attendance>) {
      state.todayAttendance = action.payload;
    },
  },
});

export const { setAttendances, setTodayAttendance } = attendanceSlice.actions;

export default attendanceSlice.reducer;
