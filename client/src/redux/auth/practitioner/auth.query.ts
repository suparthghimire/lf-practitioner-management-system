import { UserLogin, User } from "./../../../models/User";
import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQuery } from "../../queryWrapper";

/**
 * RTK Query API definition for Practitioner Authentication Endpoints
 */

export const practitionerAuthApi = createApi({
  reducerPath: "practitionerAuth",
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    practitionerSignin: builder.mutation({
      query: (body: UserLogin) => ({
        url: "/practitioner/signin",
        method: "POST",
        credentials: "include",
        body,
      }),
    }),
  }),
});

export const { usePractitionerSigninMutation } = practitionerAuthApi;
