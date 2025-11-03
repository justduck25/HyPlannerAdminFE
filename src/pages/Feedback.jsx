import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../components/UI/DataTable";
import Pagination from "../components/UI/Pagination";
import {
  fetchFeedbackStats,
  fetchFeedbacks,
  deleteFeedback,
  selectFeedbackStats,
  selectFeedbackStatsLoading,
  selectFeedbacks,
  selectFeedbacksLoading,
  selectFeedbacksError,
} from "../store/slices/feedbacksSlice";

const ITEMS_PER_PAGE = 10;

const Feedbacks = () => {
  const dispatch = useDispatch();

  const stats = useSelector(selectFeedbackStats);
  const statsLoading = useSelector(selectFeedbackStatsLoading);
  const allFeedbacks = useSelector(selectFeedbacks);
  const loading = useSelector(selectFeedbacksLoading);
  const error = useSelector(selectFeedbacksError);

  const [localFilters, setLocalFilters] = useState({
    star: "all",
    search: "",
  });

  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "descending",
  });

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    console.log("Feedbacks component mounted, loading stats...");
    dispatch(fetchFeedbackStats());
  }, [dispatch]);

  useEffect(() => {
    console.log("Fetching ALL feedbacks for client-side operations...");
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  const processedFeedbacks = useMemo(() => {
    let filteredData = [...allFeedbacks];
    const normalizedSearch = localFilters.search.toLowerCase().trim();

    if (localFilters.star !== "all" || normalizedSearch !== "") {
      filteredData = filteredData.filter((fb) => {
        const starMatch =
          localFilters.star === "all" ||
          fb.star === parseInt(localFilters.star);

        if (!starMatch) return false;

        if (normalizedSearch === "") return true;

        const fullName = (fb.userId?.fullName || "").toLowerCase();
        const username = (fb.userId?.username || "").toLowerCase();
        const email = (fb.userId?.email || "").toLowerCase();
        const content = (fb.content || "").toLowerCase();

        return (
          fullName.includes(normalizedSearch) ||
          username.includes(normalizedSearch) ||
          email.includes(normalizedSearch) ||
          content.includes(normalizedSearch)
        );
      });
    }

    filteredData.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "user") {
        aValue = (a.userId?.fullName || a.userId?.username || "").toLowerCase();
        bValue = (b.userId?.fullName || b.userId?.username || "").toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = filteredData.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );

    return { paginatedData, totalPages };
  }, [allFeedbacks, localFilters, sortConfig, currentPage]);

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...localFilters, [filterType]: value };
    setLocalFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    const [key, direction] = e.target.value.split("_");
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteFeedback = async (feedback) => {
    const userIdToDelete = feedback.userId._id;

    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      try {
        await dispatch(deleteFeedback(userIdToDelete)).unwrap();
      } catch (error) {
        console.error("Failed to delete feedback:", error);
        alert("Không thể xóa đánh giá. Vui lòng thử lại.");
      }
    }
  };

  const renderStars = (star) => {
    const fullStar = "★";
    const emptyStar = "☆";
    return fullStar.repeat(star) + emptyStar.repeat(5 - star);
  };

  const columns = [
    {
      key: "user",
      title: "Người dùng",
      render: (_, feedback) => (
        <div>
          <div className="user-name">
            {feedback.userId?.fullName ||
              feedback.userId?.username ||
              "Người dùng ẩn danh"}
          </div>
          <div className="user-email text-muted">
            {feedback.userId?.email || "N/A"}
          </div>
        </div>
      ),
    },
    {
      key: "star",
      title: "Số sao",
      render: (star) => renderStars(star),
    },
    {
      key: "content",
      title: "Nội dung",
      render: (content) => (
        <div
          style={{
            maxWidth: "300px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {content}
        </div>
      ),
    },
    {
      key: "createdAt",
      title: "Ngày tạo",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      key: "actions",
      title: "Thao tác",
      render: (_, feedback) => (
        <div className="action-buttons">
          <button
            className="btn-action btn-delete"
            title="Xóa"
            onClick={() => handleDeleteFeedback(feedback)}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  const getStarCount = (star) => {
    const dist = stats.ratingDistribution || [];
    const item = dist.find((d) => d._id === star);
    return item ? item.count : 0;
  };

  return (
    <div className="feedbacks-page">
      <div className="page-header">
        <h2>Quản lý Đánh giá (Feedback)</h2>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <i className="fas fa-comments"></i>
          </div>
          <div className="stat-content">
            <h3>{statsLoading ? "..." : stats.totalFeedback || 0}</h3>
            <p>Tổng số đánh giá</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon avg-star">
            <i className="fas fa-star-half-alt"></i>
          </div>
          <div className="stat-content">
            <h3>
              {statsLoading ? "..." : (stats.averageRating || 0).toFixed(2)} /
              5.0
            </h3>
            <p>Điểm trung bình</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon five-star">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-content">
            <h3>{statsLoading ? "..." : getStarCount(5)}</h3>
            <p>5 Sao</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon low-star">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-content">
            <h3>{statsLoading ? "..." : getStarCount(1) + getStarCount(2)}</h3>
            <p>1 & 2 Sao (Cần xem xét)</p>
          </div>
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <select
            className="filter-select"
            value={localFilters.star}
            onChange={(e) => handleFilterChange("star", e.target.value)}
          >
            <option value="all">Tất cả sao</option>
            <option value="5">{renderStars(5)} (5 Sao)</option>
            <option value="4">{renderStars(4)} (4 Sao)</option>
            <option value="3">{renderStars(3)} (3 Sao)</option>
            <option value="2">{renderStars(2)} (2 Sao)</option>
            <option value="1">{renderStars(1)} (1 Sao)</option>
          </select>

          <select
            className="filter-select"
            value={`${sortConfig.key}_${sortConfig.direction}`}
            onChange={handleSortChange}
          >
            <option value="createdAt_descending">Mới nhất</option>
            <option value="createdAt_ascending">Cũ nhất</option>
            <option value="star_descending">Sao: Cao đến Thấp</option>
            <option value="star_ascending">Sao: Thấp đến Cao</option>
            <option value="user_ascending">Người dùng (A-Z)</option>
            <option value="user_descending">Người dùng (Z-A)</option>
          </select>

          <input
            type="text"
            className="filter-input"
            placeholder="Tìm kiếm theo nội dung, tên người dùng, email..."
            value={localFilters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ Lỗi: {error}</p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              dispatch(fetchFeedbackStats());
              dispatch(fetchFeedbacks());
            }}
          >
            Thử lại
          </button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={processedFeedbacks.paginatedData}
        loading={loading && allFeedbacks.length === 0}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={processedFeedbacks.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Feedbacks;
