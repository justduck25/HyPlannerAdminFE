import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { feedbackAPI } from "../../services/api";

// --- Thunks (Xử lý API không đồng bộ) ---

/**
 * Thunk để lấy thống kê Feedback
 * Endpoint: GET /feedback/statistics
 */
export const fetchFeedbackStats = createAsyncThunk(
  "feedbacks/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      // Giả định feedbackAPI.getStats() gọi GET /feedback/statistics
      const response = await feedbackAPI.getStats();
      // Backend Controller trả về trực tiếp { totalFeedback, averageRating, ratingDistribution }
      return response.data;
    } catch (error) {
      // Error handling nhất quán với các slice khác
      return rejectWithValue(error.message || "Failed to fetch feedback stats");
    }
  }
);

/**
 * Thunk để lấy danh sách Feedback với phân trang và lọc
 * Endpoint: GET /feedback/all?page=...&limit=...&star=...&search=...
 */
export const fetchFeedbacks = createAsyncThunk(
  "feedbacks/fetchFeedbacks",
  async (params, { rejectWithValue, getState }) => {
    try {
      // Giả định feedbackAPI.getFeedbacks(params) gọi GET /feedback/all
      const response = await feedbackAPI.getFeedbacks(params);

      // Backend Controller trả về { count, feedbacks }
      const totalItems = response.data.count;
      // Lấy limit hiện tại từ state hoặc dùng mặc định 10
      const limit = getState().feedbacks.pagination.limit;

      // Trả về dữ liệu đã tính toán lại cấu trúc pagination
      return {
        feedbacks: response.data.feedbacks,
        pagination: {
          totalPages: Math.ceil(totalItems / limit),
          totalItems: totalItems,
        },
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch feedbacks");
    }
  }
);

/**
 * Thunk để xóa Feedback
 * Endpoint: DELETE /feedback/delete/:userId
 * Lưu ý: Thunk nhận userId để xóa theo logic backend hiện tại.
 */
export const deleteFeedback = createAsyncThunk(
  "feedbacks/deleteFeedback",
  async (userId, { rejectWithValue }) => {
    try {
      // Giả định feedbackAPI.deleteFeedback(userId) gọi DELETE /feedback/delete/:userId
      await feedbackAPI.deleteFeedback(userId);
      return userId; // Trả về userId của feedback đã xóa
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete feedback");
    }
  }
);

// --- State Khởi Tạo ---
const initialState = {
  // Stats
  stats: {
    totalFeedback: 0,
    averageRating: 0,
    ratingDistribution: [],
  },
  statsLoading: false,
  statsError: null,

  // Feedbacks list
  feedbacks: [],
  feedbacksLoading: false,
  feedbacksError: null,

  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  },

  // Filters
  filters: {
    star: "all",
    search: "",
  },
};

// --- Slice (Reducers) ---
const feedbacksSlice = createSlice({
  name: "feedbacks",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset về trang 1 khi lọc
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearErrors: (state) => {
      state.statsError = null;
      state.feedbacksError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ------------------------------------
      // Fetch Feedback Stats
      // ------------------------------------
      .addCase(fetchFeedbackStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchFeedbackStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload; // Payload là object stats
      })
      .addCase(fetchFeedbackStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
      })

      // ------------------------------------
      // Fetch Feedbacks List
      // ------------------------------------
      .addCase(fetchFeedbacks.pending, (state) => {
        state.feedbacksLoading = true;
        state.feedbacksError = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.feedbacksLoading = false;
        // Payload chứa feedbacks và pagination đã được tính toán trong thunk
        state.feedbacks = action.payload.feedbacks;

        // Cập nhật thông tin phân trang
        state.pagination = {
          ...state.pagination,
          totalPages: action.payload.pagination.totalPages,
          totalItems: action.payload.pagination.totalItems,
        };
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.feedbacksLoading = false;
        state.feedbacksError = action.payload;
      })

      // ------------------------------------
      // Delete Feedback
      // ------------------------------------
      .addCase(deleteFeedback.pending, (state) => {
        state.feedbacksLoading = true;
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.feedbacksLoading = false;
        const deletedUserId = action.payload; // Action.payload là userId

        // Xóa feedback khỏi danh sách theo userId
        state.feedbacks = state.feedbacks.filter(
          (feedback) => feedback.userId._id !== deletedUserId
        );

        // Cập nhật tổng số lượng
        state.pagination.totalItems = Math.max(
          0,
          state.pagination.totalItems - 1
        );
        state.pagination.totalPages = Math.ceil(
          state.pagination.totalItems / state.pagination.limit
        );
      })
      .addCase(deleteFeedback.rejected, (state, action) => {
        state.feedbacksLoading = false;
        state.feedbacksError = action.payload;
      });
  },
});

// --- Exports ---

// Actions
export const { setFilters, setCurrentPage, clearErrors } =
  feedbacksSlice.actions;

// Selectors
export const selectFeedbackStats = (state) => state.feedbacks.stats;
export const selectFeedbackStatsLoading = (state) =>
  state.feedbacks.statsLoading;
export const selectFeedbackStatsError = (state) => state.feedbacks.statsError;

export const selectFeedbacks = (state) => state.feedbacks.feedbacks;
export const selectFeedbacksLoading = (state) =>
  state.feedbacks.feedbacksLoading;
export const selectFeedbacksError = (state) => state.feedbacks.feedbacksError;

export const selectFeedbacksPagination = (state) => state.feedbacks.pagination;
export const selectFeedbacksFilters = (state) => state.feedbacks.filters;

export default feedbacksSlice.reducer;
