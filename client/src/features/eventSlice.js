import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/baseUrl"; // Adjust the path to your base URL

export const eventApi = createApi({
  reducerPath: "eventApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ["Event"],

  endpoints: (builder) => ({
    getAllEvents: builder.query({
      query: () => "/events",
      providesTags: ["Event"],
    }),
    getEventById: builder.query({
      query: (id) => `/events/${id}`,
      providesTags: (result, error, id) => [{ type: "Event", id }],
    }),
    addEvent: builder.mutation({
      query: (newEvent) => ({
        url: "/events",
        method: "POST",
        body: newEvent,
      }),
      invalidatesTags: ["Event"],
      onQueryStarted: async (newEvent, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          console.error("Failed to add event:", error);
        }
      },
    }),
    updateEvent: builder.mutation({
      query: ({ id, updatedEvent }) => ({
        url: `/events/${id}`,
        method: "PUT",
        body: updatedEvent,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Event", id }],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Event", id }],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useGetEventByIdQuery,
  useAddEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;
