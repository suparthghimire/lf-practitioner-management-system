import { useAppDispatch } from "./../hooks";
import { useDispatch } from "react-redux";
import { UserLogin, DisplayUser, User } from "./../../models/User";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import CONFIG from "../../utils/app_config";
import { getState, AuthState } from "./auth.slice";
export const authApi = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({ baseUrl: CONFIG.SERVER_URL }),
  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (body: UserLogin) => ({
        url: "/signin",
        method: "POST",
        credentials: "include",
        body,
      }),
    }),
    signup: builder.mutation({
      query: (body: User) => ({
        url: "/signup",
        method: "POST",
        credentials: "include",
        body,
      }),
    }),
    signout: builder.mutation({
      query: () => ({
        url: "/signout",
        credentials: "include",
        method: "DELETE",
      }),
    }),
    myData: builder.query({
      query: (token: string) => ({
        url: "/",
        credentials: "include",
        headers: {
          authorization: token,
        },
      }),
    }),
  }),
});

export const {
  useSigninMutation,
  useSignupMutation,
  useSignoutMutation,
  useMyDataQuery,
} = authApi;
