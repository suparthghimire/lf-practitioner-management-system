import { Practitioner } from "./../../models/Practitioner";
import { createApi } from "@reduxjs/toolkit/query/react";
import { serialize } from "object-to-formdata";

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
    toggleIcuSpecialist: builder.mutation({
      query: ({
        token,
        practitionerId,
        status,
      }: {
        token: string;
        practitionerId: number;
        status: boolean;
      }) => ({
        url: `/practitioner/${practitionerId}`,
        method: "PUT",
        headers: {
          authorization: token,
        },
        credentials: "include",
        body: {
          icuSpecialist: status,
        },
      }),
    }),
    updatePractitioner: builder.mutation({
      query: ({
        token,
        practitionerId,
        practitioner,
      }: {
        token: string;
        practitionerId: string;
        practitioner: Practitioner;
      }) => ({
        url: `/practitioner/${practitionerId}`,
        method: "PUT",
        headers: {
          authorization: token,
        },
        credentials: "include",
        body: serialize(practitioner),
      }),
    }),
    deletePractitioner: builder.mutation({
      query: ({ token, id }: { token: string; id: number }) => ({
        url: `/practitioner/${id}`,
        method: "DELETE",
        headers: {
          authorization: token,
        },
      }),
    }),
  }),
});

export const {
  useGetPractitionersQuery,

  useToggleIcuSpecialistMutation,
  useUpdatePractitionerMutation,
  useDeletePractitionerMutation,
} = practitionerApi;
