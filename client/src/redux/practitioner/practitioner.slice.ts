import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Practitioner } from "../../models/Practitioner";
import WorkingDay from "../../models/WorkingDay";
import Specialization from "../../models/Specialization";

export interface PractitionerState {
  practitioners: Practitioner[];
}

const initialState: PractitionerState = {
  practitioners: [],
};

const practitionerSlice = createSlice({
  name: "practitioner",
  initialState,
  reducers: {
    setPractitioners(state, action: PayloadAction<Practitioner[]>) {
      state.practitioners = action.payload;
    },
    removePractitionerById(state, action: PayloadAction<number>) {
      console.log("HERE");
      state.practitioners = state.practitioners.filter(
        (practitioner) => practitioner.id !== action.payload
      );
    },
  },
});

export const { setPractitioners, removePractitionerById } =
  practitionerSlice.actions;

export default practitionerSlice.reducer;
