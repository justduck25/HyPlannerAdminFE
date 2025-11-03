import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token to header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem("adminToken");
        window.location.href = "/login";
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Network error
      return Promise.reject({
        success: false,
        message: "Network error - No response from server",
      });
    } else {
      // Request configuration error
      return Promise.reject({
        success: false,
        message: "Request configuration error",
      });
    }
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => apiClient.post("/auth/login", credentials),
  logout: () => apiClient.post("/auth/logout"),
  verify: () => apiClient.get("/auth/verify"),
};

// Users API
export const usersAPI = {
  getUsers: (params) => apiClient.get("/users", { params }),
  getUser: (id) => apiClient.get(`/users/${id}`),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
  toggleUserStatus: (id) => apiClient.patch(`/users/${id}/toggle-status`),
  getUserStats: () => apiClient.get("/users/stats/overview"),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => apiClient.get("/dashboard/stats"),
  getUserGrowth: (period = "month", months = 6) => {
    const days = period === "day" ? months * 30 : 30; // Convert to days for backend
    return apiClient.get(`/dashboard/user-growth?days=${days}`);
  },
  getUserGrowthByMonth: (months = 12) =>
    apiClient.get(`/dashboard/user-growth-monthly?months=${months}`),
  getOverview: () => apiClient.get("/dashboard/overview"),
  getAccountDistribution: () =>
    apiClient.get("/dashboard/account-distribution"),
  getSystemHealth: () => apiClient.get("/dashboard/system-health"),
  getRecentActivities: (limit = 10) =>
    apiClient.get(`/admin/recent-activities?limit=${limit}`),
};

// Note: Wedding Events and Payments APIs are not implemented in the current backend
// These will be added when the corresponding backend routes are implemented

// Wedding Events API
export const weddingAPI = {
  // Lấy thống kê weddings
  getStats: () => apiClient.get("/weddings/stats"),

  // Lấy danh sách weddings với pagination và filter
  getEvents: (params) => apiClient.get("/weddings", { params }),

  // Lấy chi tiết một wedding
  getEvent: (id) => apiClient.get(`/weddings/${id}`),

  // Xóa wedding
  deleteEvent: (id) => apiClient.delete(`/weddings/${id}`),
};

export const feedbackAPI = {
  // GET http://localhost:8082/feedback/statistics
  getStats: () => apiClient.get("/feedback/statistics"),

  // GET http://localhost:8082/feedback/all?page=...&limit=...&star=...&search=...
  getFeedbacks: (params) => apiClient.get("/feedback/all", { params }),

  // DELETE http://localhost:8082/feedback/delete/:id
  // Lưu ý: Endpoint backend của bạn dùng userId để xóa, nhưng trong ngữ cảnh Admin,
  // ta nên xóa bằng _id của feedback. Nếu bạn dùng ID người dùng, sẽ bị xóa tất cả.
  // Tuy nhiên, dựa trên controller của bạn, nó đang dùng userId từ param:
  // DELETE http://localhost:8082/feedback/delete/:id (với id là userId)
  // Ta sẽ tuân theo backend hiện tại:
  deleteFeedback: (userId) => apiClient.delete(`/feedback/delete/${userId}`),
};

// Payments API (placeholder)
export const paymentsAPI = {
  getPayments: (params) =>
    Promise.resolve({ data: { payments: [], pagination: { total: 0 } } }),
  getPayment: (id) => Promise.resolve({ data: { payment: null } }),
  getPaymentStats: () => Promise.resolve({ data: { stats: {} } }),
};

export default apiClient;
