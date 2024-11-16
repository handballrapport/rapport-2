import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/baseUrl";

export const competitionApi = createApi({
  reducerPath: "competitionApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Competition"],

  endpoints: (builder) => ({
    getCompetitions: builder.query({
      query: () => "/competitions",
      providesTags: ["Competition"],
    }),
    getCompetitionById: builder.query({
      query: (id) => `/competitions/${id}`,
      providesTags: (result, error, id) => [{ type: "Competition", id }],
    }),
    addCompetition: builder.mutation({
      query: (newCompetition) => ({
        url: "/competitions",
        method: "POST",
        body: newCompetition,
      }),
      invalidatesTags: ["Competition"],
    }),
    updateCompetition: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/competitions/${id}`,
        method: "PUT",
        body: formData,  // Send the formData directly
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Competition", id }],
    }),
    deleteCompetition: builder.mutation({
      query: (id) => ({
        url: `/competitions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Competition", id }],
    }),
  }),
});

export const {
  useGetCompetitionsQuery,
  useGetCompetitionByIdQuery,
  useAddCompetitionMutation,
  useUpdateCompetitionMutation,
  useDeleteCompetitionMutation,
} = competitionApi;
