import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../queryWrapper";

export const userApi = createApi({
  reducerPath: "user",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: (token: string) => ({
        url: `/user/dashboard`,
        headers: {
          authorization: token,
        },
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetDashboardDataQuery } = userApi;
