import { DisplayUser } from "./../../models/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

/**
 * Manages the state of the user's authentication
 */

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: DisplayUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetUser(state) {
      // resets user to initial state
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
    setUser(
      state,
      action: PayloadAction<
        DisplayUser & { accessToken: string; refreshToken: string }
      >
    ) {
      // sets user to logged in state
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) {
      // sets tokens after logging in
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const { resetUser, setUser, setTokens } = authSlice.actions;
export default authSlice.reducer;
