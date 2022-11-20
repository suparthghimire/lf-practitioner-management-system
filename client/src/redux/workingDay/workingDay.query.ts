import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../queryWrapper";

export const workingDayApi = createApi({
  reducerPath: "workingDay",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getWorkingDays: builder.query({
      query: (token: string) => ({
        url: `/day`,
        headers: {
          authorization: token,
        },
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetWorkingDaysQuery } = workingDayApi;
