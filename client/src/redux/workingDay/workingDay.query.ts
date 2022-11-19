import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../queryWrapper";

export const workingDayApi = createApi({
  reducerPath: "workingDay",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getSpecializations: builder.query({
      query: (token: string) => ({
        url: `/specialization`,
        headers: {
          authorization: token,
        },
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetSpecializationsQuery } = workingDayApi;
