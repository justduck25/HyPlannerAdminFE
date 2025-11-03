import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import usersReducer from "./slices/usersSlice";
import dashboardReducer from "./slices/dashboardSlice";
import weddingsReducer from "./slices/weddingsSlice";
import feedbacksReducer from "./slices/feedbacksSlice"; // <--- BƯỚC 1: IMPORT REDUCER MỚI

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    dashboard: dashboardReducer,
    weddings: weddingsReducer,
    feedbacks: feedbacksReducer, // <--- BƯỚC 2: THÊM KEY 'feedbacks' VÀO STORE
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
});

export default store;
