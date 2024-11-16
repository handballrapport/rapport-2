import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/baseUrl";

export const teamApi = createApi({
  reducerPath: "teamApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Team"],

  endpoints: (builder) => ({
    getTeams: builder.query({
      query: () => "/teams",
      providesTags: ["Team"],
    }),
    getTeamById: builder.query({
      query: (id) => `/teams/${id}`,
      providesTags: (result, error, id) => [{ type: "Team", id }],
    }),
    addTeam: builder.mutation({
      query: (newTeam) => ({
        url: "/teams",
        method: "POST",
        body: newTeam,
      }),
      invalidatesTags: ["Team"],
    }),
    updateTeam: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/teams/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Team", id }],
    }),
    deleteTeam: builder.mutation({
      query: (id) => {
        return {
          url: `/teams/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, id) => [{ type: "Team", id }],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useGetTeamByIdQuery,
  useAddTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} = teamApi;
