import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { Practitioner } from "../../../models/Practitioner";

/**
 * Manages the state of the user's authentication
 */

export interface AuthState {
  accessToken: string | null;
  practitioner: Practitioner | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  practitioner: null,
  isAuthenticated: false,
};

const practitionerAuthSlice = createSlice({
  name: "practitionerAuth",
  initialState,
  reducers: {
    resetPractitioner(state) {
      console.log("resetting practitioner");
      // resets user to initial state
      state.accessToken = null;
      state.practitioner = null;
      state.isAuthenticated = false;
    },
    setPractitioner(
      state,
      action: PayloadAction<Practitioner & { accessToken: string }>
    ) {
      // sets user to logged in state
      state.practitioner = action.payload;
      state.isAuthenticated = true;
    },
    setAccessToken(state, action: PayloadAction<{ accessToken: string }>) {
      // sets tokens after logging in
      state.accessToken = action.payload.accessToken;
    },
  },
});

export const selectPractitionerAuth = (state: RootState) =>
  state.practitionerAuth;
export const { resetPractitioner, setPractitioner, setAccessToken } =
  practitionerAuthSlice.actions;
export default practitionerAuthSlice.reducer;
