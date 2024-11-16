import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/baseUrl";

export const playerApi = createApi({
  reducerPath: "playerApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Player"],

  endpoints: (builder) => ({
    getPlayers: builder.query({
      query: () => "/players",
      providesTags: ["Player"],
    }),
    getPlayerById: builder.query({
      query: (id) => `/players/${id}`,
      providesTags: (result, error, id) => [{ type: "Player", id }],
    }),
    addPlayer: builder.mutation({
      query: (newPlayer) => ({
        url: "/players",
        method: "POST",
        body: newPlayer,
      }),
      invalidatesTags: ["Player"],
    }),
    updatePlayer: builder.mutation({
      query: ({ id, formData }) => {
        return {
          url: `/players/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Player", id }],
    }),
    deletePlayer: builder.mutation({
      query: (id) => {
        return {
          url: `/players/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: (result, error, id) => [{ type: "Player", id }],
    }),
    updatePlayerStatistics: builder.mutation({
      query: ({ id, action, fields }) => ({
        url: `/players/${id}/statistics`,
        method: "PUT",
        body: { action, fields },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Player", id }],
    }),

  }),
});

export const {
  useGetPlayersQuery,
  useGetPlayerByIdQuery,
  useAddPlayerMutation,
  useUpdatePlayerMutation,
  useDeletePlayerMutation,
  useUpdatePlayerStatisticsMutation, 
} = playerApi;
