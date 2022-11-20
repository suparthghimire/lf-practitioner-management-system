import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import WorkingDay from "../../models/WorkingDay";

/**
 * Manages the state of the WorkingDay
 */

export interface WorkingDaySlice {
  workingDays: WorkingDay[];
}

const initialState: WorkingDaySlice = {
  workingDays: [],
};

const WorkingDaySlice = createSlice({
  name: "workingDay",
  initialState,
  reducers: {
    setWorkingDays(state, action: PayloadAction<WorkingDay[]>) {
      state.workingDays = action.payload;
    },
  },
});

export const { setWorkingDays } = WorkingDaySlice.actions;

export default WorkingDaySlice.reducer;
