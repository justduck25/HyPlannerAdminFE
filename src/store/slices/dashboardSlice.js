import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  overview: {
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    verificationRate: 0,
  },
  newUsers: {
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
  },
  accountTypes: {
    FREE: 0,
    VIP: 0,
    SUPER: 0,
  },
  recentUsers: [],
  userGrowthData: [],
  userGrowthByMonth: [],
  accountDistribution: [],
  systemHealth: null,
  chartMonths: 6, // 6 or 12 months
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchDashboardStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDashboardSuccess: (state, action) => {
      state.loading = false;
      state.overview = action.payload.overview || state.overview;
      state.newUsers = action.payload.newUsers || state.newUsers;
      state.accountTypes = action.payload.accountTypes || state.accountTypes;
      state.recentUsers = action.payload.recentUsers || state.recentUsers;
      state.error = null;
    },
    fetchUserGrowthSuccess: (state, action) => {
      state.userGrowthData = action.payload.chartData || [];
    },
    fetchUserGrowthByMonthSuccess: (state, action) => {
      state.userGrowthByMonth = action.payload.chartData || [];
    },
    setChartMonths: (state, action) => {
      state.chartMonths = action.payload;
    },
    fetchAccountDistributionSuccess: (state, action) => {
      state.accountDistribution = action.payload.distribution || [];
    },
    fetchSystemHealthSuccess: (state, action) => {
      state.systemHealth = action.payload;
    },
    fetchDashboardFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchDashboardStart,
  fetchDashboardSuccess,
  fetchUserGrowthSuccess,
  fetchUserGrowthByMonthSuccess,
  setChartMonths,
  fetchAccountDistributionSuccess,
  fetchSystemHealthSuccess,
  fetchDashboardFailure,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
