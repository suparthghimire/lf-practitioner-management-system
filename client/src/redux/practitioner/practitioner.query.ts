import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../queryWrapper";

export const practitionerApi = createApi({
  reducerPath: "practitioner",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getPractitioners: builder.query({
      query: ({
        token,
        page = 1,
        limit = 10,
      }: {
        token: string;
        page: number;
        limit: number;
      }) => ({
        url: `/practitioner?page=${page}&limit=${limit}`,
        headers: {
          authorization: token,
        },
        credentials: "include",
      }),
    }),
    deletePractitioner: builder.mutation({
      query: ({ token, id }: { token: string; id: string }) => ({
        url: `/practitioner/${id}`,
        method: "DELETE",
        headers: {
          authorization: token,
        },
      }),
    }),
  }),
});

export const { useGetPractitionersQuery, useDeletePractitionerMutation } =
  practitionerApi;
