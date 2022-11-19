import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Practitioner } from "../../models/Practitioner";

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
  },
});

export const { setPractitioners } = practitionerSlice.actions;

export default practitionerSlice.reducer;
