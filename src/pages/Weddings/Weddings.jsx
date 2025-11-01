import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '../../components/UI/DataTable';
import Pagination from '../../components/UI/Pagination';
import {
  fetchWeddingStats,
  fetchWeddings,
  deleteWedding,
  setFilters,
  setCurrentPage,
  selectWeddingStats,
  selectWeddingStatsLoading,
  selectWeddings,
  selectWeddingsLoading,
  selectWeddingsPagination,
  selectWeddingsFilters,
  selectWeddingsError,
} from '../../store/slices/weddingsSlice';

const Weddings = () => {
  const dispatch = useDispatch();
  
  // Redux selectors
  const stats = useSelector(selectWeddingStats);
  const statsLoading = useSelector(selectWeddingStatsLoading);
  const weddings = useSelector(selectWeddings);
  const loading = useSelector(selectWeddingsLoading);
  const pagination = useSelector(selectWeddingsPagination);
  const filters = useSelector(selectWeddingsFilters);
  const error = useSelector(selectWeddingsError);

  // Local state for filters
  const [localFilters, setLocalFilters] = useState({
    status: 'all',
    month: 'all',
    search: '',
  });

  useEffect(() => {
    console.log('Weddings component mounted, loading data...');
    // Fetch stats on component mount
    dispatch(fetchWeddingStats());
  }, [dispatch]);

  useEffect(() => {
    // Fetch weddings when page or filters change
    const params = {
      page: pagination.currentPage,
      limit: pagination.limit,
      ...filters,
    };
    
    // Remove 'all' values
    Object.keys(params).forEach(key => {
      if (params[key] === 'all' || params[key] === '') {
        delete params[key];
      }
    });

    console.log('Fetching weddings with params:', params);
    dispatch(fetchWeddings(params));
  }, [dispatch, pagination.currentPage, filters]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...localFilters, [filterType]: value };
    setLocalFilters(newFilters);
    dispatch(setFilters(newFilters));
  };

  // Handle delete wedding
  const handleDeleteWedding = async (weddingId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện cưới này?')) {
      try {
        await dispatch(deleteWedding(weddingId)).unwrap();
        // Refresh current page data
        const params = {
          page: pagination.currentPage,
          limit: pagination.limit,
          ...filters,
        };
        dispatch(fetchWeddings(params));
      } catch (error) {
        console.error('Failed to delete wedding:', error);
        alert('Không thể xóa sự kiện cưới. Vui lòng thử lại.');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      planning: { label: 'Đang lên kế hoạch', class: 'badge-planning' },
      upcoming: { label: 'Sắp diễn ra', class: 'badge-upcoming' },
      completed: { label: 'Đã hoàn thành', class: 'badge-completed' }
    };
    
    const statusInfo = statusMap[status] || { label: status, class: 'badge-default' };
    
    return (
      <span className={`badge ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  const columns = [
    {
      key: 'couple',
      title: 'Cặp đôi',
      render: (_, wedding) => (
        <div>
          <div className="user-name">{wedding.groomName} & {wedding.brideName}</div>
          <div className="user-role">Ngày cưới: {new Date(wedding.weddingDate).toLocaleDateString('vi-VN')}</div>
        </div>
      )
    },
    {
      key: 'venue',
      title: 'Địa điểm',
    },
    {
      key: 'budget',
      title: 'Ngân sách',
      render: (budget) => formatCurrency(budget)
    },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (status) => getStatusBadge(status)
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      key: 'actions',
      title: 'Thao tác',
      render: (_, wedding) => (
        <div className="action-buttons">
          <button className="btn-action btn-edit" title="Xem chi tiết">
            <i className="fas fa-eye"></i>
          </button>
          <button className="btn-action btn-edit" title="Chỉnh sửa">
            <i className="fas fa-edit"></i>
          </button>
          <button 
            className="btn-action btn-delete" 
            title="Xóa"
            onClick={() => handleDeleteWedding(wedding._id)}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  return (
    <div className="weddings-page">
      <div className="page-header">
        <h2>Quản lý sự kiện cưới</h2>
        <div className="header-actions">
          <button className="btn btn-primary">
            <i className="fas fa-plus"></i>
            Thêm sự kiện
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon wedding">
            <i className="fas fa-ring"></i>
          </div>
          <div className="stat-content">
            <h3>{statsLoading ? '...' : stats.totalEvents}</h3>
            <p>Tổng sự kiện</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon upcoming">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="stat-content">
            <h3>{statsLoading ? '...' : stats.eventsThisMonth}</h3>
            <p>Sự kiện tháng này</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon completed">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{statsLoading ? '...' : stats.completedEvents}</h3>
            <p>Đã hoàn thành</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon revenue">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <h3>{statsLoading ? '...' : formatCurrency(stats.totalBudget)}</h3>
            <p>Tổng ngân sách</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <select 
            className="filter-select"
            value={localFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="planning">Đang lên kế hoạch</option>
            <option value="upcoming">Sắp diễn ra</option>
            <option value="completed">Đã hoàn thành</option>
          </select>
          
          <select 
            className="filter-select"
            value={localFilters.month}
            onChange={(e) => handleFilterChange('month', e.target.value)}
          >
            <option value="all">Tất cả tháng</option>
            <option value="this">Tháng này</option>
            <option value="next">Tháng tới</option>
            <option value="1">Tháng 1</option>
            <option value="2">Tháng 2</option>
            <option value="3">Tháng 3</option>
            <option value="4">Tháng 4</option>
            <option value="5">Tháng 5</option>
            <option value="6">Tháng 6</option>
            <option value="7">Tháng 7</option>
            <option value="8">Tháng 8</option>
            <option value="9">Tháng 9</option>
            <option value="10">Tháng 10</option>
            <option value="11">Tháng 11</option>
            <option value="12">Tháng 12</option>
          </select>
          
          <input 
            type="text" 
            className="filter-input" 
            placeholder="Tìm kiếm theo tên cặp đôi, địa điểm..."
            value={localFilters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ Lỗi: {error}</p>
          <button 
            className="btn btn-secondary"
            onClick={() => {
              dispatch(fetchWeddingStats());
              dispatch(fetchWeddings({ page: pagination.currentPage, limit: pagination.limit }));
            }}
          >
            Thử lại
          </button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={weddings}
        loading={loading}
      />

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Weddings;
