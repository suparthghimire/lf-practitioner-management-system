import { DisplayUser } from "./../../models/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: DisplayUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetUser(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    setUser(
      state,
      action: PayloadAction<
        DisplayUser & { accessToken: string; refreshToken: string }
      >
    ) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    setTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) {
      console.log("Setting tokens", action);
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const { resetUser, setUser, setTokens, setLoading } = authSlice.actions;
export default authSlice.reducer;
