import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { weddingAPI } from '../../services/api';

// Async thunks
export const fetchWeddingStats = createAsyncThunk(
  'weddings/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await weddingAPI.getStats();
      return response.data.data; // Backend trả về { success: true, data: {...} }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch wedding stats');
    }
  }
);

export const fetchWeddings = createAsyncThunk(
  'weddings/fetchWeddings',
  async (params, { rejectWithValue }) => {
    try {
      const response = await weddingAPI.getEvents(params);
      return response.data.data; // Backend trả về { success: true, data: {...} }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch weddings');
    }
  }
);

export const fetchWeddingDetail = createAsyncThunk(
  'weddings/fetchWeddingDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await weddingAPI.getEvent(id);
      return response.data.data; // Backend trả về { success: true, data: {...} }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch wedding detail');
    }
  }
);

export const deleteWedding = createAsyncThunk(
  'weddings/deleteWedding',
  async (id, { rejectWithValue }) => {
    try {
      await weddingAPI.deleteEvent(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete wedding');
    }
  }
);

const initialState = {
  // Stats
  stats: {
    totalEvents: 0,
    eventsThisMonth: 0,
    completedEvents: 0,
    totalBudget: 0,
  },
  statsLoading: false,
  statsError: null,

  // Weddings list
  weddings: [],
  weddingsLoading: false,
  weddingsError: null,

  // Pagination
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  },

  // Filters
  filters: {
    status: 'all',
    month: 'all',
    search: '',
  },

  // Selected wedding detail
  selectedWedding: null,
  selectedWeddingLoading: false,
  selectedWeddingError: null,
};

const weddingsSlice = createSlice({
  name: 'weddings',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1; // Reset to first page when filtering
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearSelectedWedding: (state) => {
      state.selectedWedding = null;
      state.selectedWeddingError = null;
    },
    clearErrors: (state) => {
      state.statsError = null;
      state.weddingsError = null;
      state.selectedWeddingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wedding stats
      .addCase(fetchWeddingStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchWeddingStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
        console.log('Wedding stats loaded:', action.payload);
      })
      .addCase(fetchWeddingStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload;
        console.error('Wedding stats error:', action.payload);
      })

      // Fetch weddings
      .addCase(fetchWeddings.pending, (state) => {
        state.weddingsLoading = true;
        state.weddingsError = null;
      })
      .addCase(fetchWeddings.fulfilled, (state, action) => {
        state.weddingsLoading = false;
        state.weddings = action.payload.weddings;
        state.pagination = {
          ...state.pagination,
          totalPages: action.payload.pagination.totalPages,
          totalItems: action.payload.pagination.totalItems,
        };
        console.log('Weddings loaded:', action.payload);
      })
      .addCase(fetchWeddings.rejected, (state, action) => {
        state.weddingsLoading = false;
        state.weddingsError = action.payload;
        console.error('Weddings fetch error:', action.payload);
      })

      // Fetch wedding detail
      .addCase(fetchWeddingDetail.pending, (state) => {
        state.selectedWeddingLoading = true;
        state.selectedWeddingError = null;
      })
      .addCase(fetchWeddingDetail.fulfilled, (state, action) => {
        state.selectedWeddingLoading = false;
        state.selectedWedding = action.payload;
      })
      .addCase(fetchWeddingDetail.rejected, (state, action) => {
        state.selectedWeddingLoading = false;
        state.selectedWeddingError = action.payload;
      })

      // Delete wedding
      .addCase(deleteWedding.pending, (state) => {
        state.weddingsLoading = true;
      })
      .addCase(deleteWedding.fulfilled, (state, action) => {
        state.weddingsLoading = false;
        // Remove deleted wedding from list
        state.weddings = state.weddings.filter(wedding => wedding._id !== action.payload);
        // Update total count
        state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1);
      })
      .addCase(deleteWedding.rejected, (state, action) => {
        state.weddingsLoading = false;
        state.weddingsError = action.payload;
      });
  },
});

export const { setFilters, setCurrentPage, clearSelectedWedding, clearErrors } = weddingsSlice.actions;

// Selectors
export const selectWeddingStats = (state) => state.weddings.stats;
export const selectWeddingStatsLoading = (state) => state.weddings.statsLoading;
export const selectWeddingStatsError = (state) => state.weddings.statsError;

export const selectWeddings = (state) => state.weddings.weddings;
export const selectWeddingsLoading = (state) => state.weddings.weddingsLoading;
export const selectWeddingsError = (state) => state.weddings.weddingsError;

export const selectWeddingsPagination = (state) => state.weddings.pagination;
export const selectWeddingsFilters = (state) => state.weddings.filters;

export const selectSelectedWedding = (state) => state.weddings.selectedWedding;
export const selectSelectedWeddingLoading = (state) => state.weddings.selectedWeddingLoading;
export const selectSelectedWeddingError = (state) => state.weddings.selectedWeddingError;

export default weddingsSlice.reducer;
