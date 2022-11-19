import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Specialization from "../../models/Specialization";

export interface SpecializationSlice {
  Specializations: Specialization[];
}

const initialState: SpecializationSlice = {
  Specializations: [],
};

const SpecializationSlice = createSlice({
  name: "specialization",
  initialState,
  reducers: {
    setSpecializations(state, action: PayloadAction<Specialization[]>) {
      state.Specializations = action.payload;
    },
  },
});

export const { setSpecializations } = SpecializationSlice.actions;

export default SpecializationSlice.reducer;
