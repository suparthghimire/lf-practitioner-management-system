import { UserLogin, User } from "./../../models/User";
import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../queryWrapper";

/**
 * RTK Query API definition for Authentication Endpoints
 */

export const authApi = createApi({
  reducerPath: "auth",
  baseQuery: baseQueryWithReauth,
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
      query: () => {
        return {
          url: "/signout",
          credentials: "include",
          method: "DELETE",
        };
      },
    }),
    myData: builder.query({
      query: (token: string) => {
        return {
          url: "/",
          credentials: "include",
          headers: {
            authorization: token,
          },
        };
      },
    }),
    generate2fa: builder.mutation({
      query: (data: UserLogin & { token: string }) => {
        return {
          url: "/user/2fa/generate",
          credentials: "include",
          method: "POST",
          body: {
            email: data.email,
            password: data.password,
          },
          headers: {
            authorization: data.token,
          },
        };
      },
    }),
    remove2fa: builder.mutation({
      query: (
        data: UserLogin & {
          token: string;
        }
      ) => {
        return {
          url: "/user/2fa/remove",
          credentials: "include",
          method: "DELETE",
          body: {
            email: data.email,
            password: data.password,
          },
          headers: {
            authorization: data.token,
          },
        };
      },
    }),
  }),
});

export const {
  useSigninMutation,
  useSignupMutation,
  useSignoutMutation,
  useGenerate2faMutation,
  useMyDataQuery,
} = authApi;
