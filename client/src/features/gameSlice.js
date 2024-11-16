import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/baseUrl";

export const gameApi = createApi({
  reducerPath: "gameApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Game"],

  endpoints: (builder) => ({
    getGames: builder.query({
      query: () => "/games",
      providesTags: (result) =>
        result
          ? [...result.map(({ _id }) => ({ type: "Game", id: _id })), "Game"]
          : ["Game"],
    }),
    getGameById: builder.query({
      query: (id) => `/games/${id}`,
      providesTags: (result, error, id) => [{ type: "Game", id }],
    }),
    addGame: builder.mutation({
      query: (newGame) => ({
        url: "/games",
        method: "POST",
        body: newGame,
      }),
      invalidatesTags: ["Game"],
    }),
    updateGame: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/games/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Game", id }],
    }),
    deleteGame: builder.mutation({
      query: (id) => ({
        url: `/games/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Game", id }],
    }),
  }),
});

export const {
  useGetGamesQuery,
  useGetGameByIdQuery,
  useAddGameMutation,
  useUpdateGameMutation,
  useDeleteGameMutation,
} = gameApi;
