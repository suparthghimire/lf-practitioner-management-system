import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PractitionersWorkingToday } from "../../models/Dashboard";

/**
 * Manages the state of the User Dashboard
 */

export interface UserSlice {
  practitionersWorkingToday: PractitionersWorkingToday;
}

const initialState: UserSlice = {
  practitionersWorkingToday: {
    totalPractitioners: 0,
    totalWorkingToday: 0,
    totalWorkingTodayPercentage: 0,
  },
};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setDashboard(
      state,
      action: PayloadAction<{
        practitionersWorkingToday: PractitionersWorkingToday;
      }>
    ) {
      state.practitionersWorkingToday =
        action.payload.practitionersWorkingToday;
    },
  },
});

export const { setDashboard } = userSlice.actions;

export default userSlice.reducer;
