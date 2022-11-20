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
  }),
});

export const {
  useSigninMutation,
  useSignupMutation,
  useSignoutMutation,
  useMyDataQuery,
} = authApi;
