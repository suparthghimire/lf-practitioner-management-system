import { Practitioner } from "./../../models/Practitioner";
import { createApi } from "@reduxjs/toolkit/query/react";
import { serialize } from "object-to-formdata";

import baseQueryWithReauth from "../queryWrapper";

/**
 * RTK Query API definition for Practitioner Endpoints
 */

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
    getSinglePractitioner: builder.query({
      query: ({ token, id }: { token: string; id: string }) => ({
        url: `/practitioner/${id}`,
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
    createPractitioner: builder.mutation({
      query: ({
        token,
        practitioner,
      }: {
        token: string;
        practitioner: Practitioner;
      }) => ({
        url: `/practitioner`,
        method: "POST",
        headers: {
          authorization: token,
        },
        credentials: "include",
        // Serialize converts POJO to FormData
        // indices true gives indesing to data in form of array in form data
        // e.g. {name: "John", age: 20} => {name[0]: "John", age[1]: 20}
        body: serialize(practitioner, {
          indices: true,
        }),
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
        // Serialize converts POJO to FormData
        // indices true gives indesing to data in form of array in form data
        // e.g. {name: "John", age: 20} => {name[0]: "John", age[1]: 20}
        body: serialize(practitioner, {
          indices: true,
        }),
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
  useCreatePractitionerMutation,
  useToggleIcuSpecialistMutation,
  useUpdatePractitionerMutation,
  useDeletePractitionerMutation,
  useGetSinglePractitionerQuery,
} = practitionerApi;
