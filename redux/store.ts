// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import appListReducer from "./app-list-slice"; // Import the default export from step 3

export const store = configureStore({
  reducer: {
    appList: appListReducer,
    // Add other slices here later (e.g., navigation state, user auth)
  },
});

// TypeScript type helper for accessing the RootState
export type RootState = ReturnType<typeof store.getState>;

// Helper to infer action types
export type AppDispatch = typeof store.dispatch;
