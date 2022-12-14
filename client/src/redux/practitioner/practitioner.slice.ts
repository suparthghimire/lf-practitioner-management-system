import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Practitioner } from "../../models/Practitioner";

/**
 * Manages the state of the Practitioner
 */

export interface PractitionerState {
  practitioners: Practitioner[];
  selectedPractitioner: Practitioner | null;
}

const initialState: PractitionerState = {
  practitioners: [],
  selectedPractitioner: null,
};

const practitionerSlice = createSlice({
  name: "practitioner",
  initialState,
  reducers: {
    setPractitioners(state, action: PayloadAction<Practitioner[]>) {
      state.practitioners = action.payload;
    },
    removePractitionerById(state, action: PayloadAction<number>) {
      state.practitioners = state.practitioners.filter(
        (practitioner) => practitioner.id !== action.payload
      );
    },
  },
});

export const { setPractitioners, removePractitionerById } =
  practitionerSlice.actions;

export default practitionerSlice.reducer;
