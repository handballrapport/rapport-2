import { configureStore } from "@reduxjs/toolkit";
import { competitionApi } from "../features/competitionSlice";
import { eventApi } from "../features/eventSlice";
import { gameApi } from "../features/gameSlice";
import { playerApi } from "../features/playerSlice";
import { teamApi } from "../features/teamSlice";

export const store = configureStore({
  reducer: {
    [competitionApi.reducerPath]: competitionApi.reducer,
    [teamApi.reducerPath]: teamApi.reducer,
    [playerApi.reducerPath]: playerApi.reducer,
    [gameApi.reducerPath]: gameApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer, // Add eventApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      competitionApi.middleware,
      teamApi.middleware,
      playerApi.middleware,
      gameApi.middleware,
      eventApi.middleware
    ),
});

export default store;
