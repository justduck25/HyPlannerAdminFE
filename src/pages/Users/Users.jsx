import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUsersStart, 
  fetchUsersSuccess, 
  fetchUsersFailure,
  setFilters,
  setCurrentPage
} from '../../store/slices/usersSlice';
import { usersAPI } from '../../services/api';
import { getAccountTypeDisplayName } from '../../utils/accountTypeMapping';
import DataTable from '../../components/UI/DataTable';
import Pagination from '../../components/UI/Pagination';

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading, error, pagination, filters } = useSelector((state) => state.users);

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, filters]);

  const fetchUsers = async () => {
    dispatch(fetchUsersStart());
    
    try {
      // Build query parameters
      const params = {
        page: pagination.currentPage,
        limit: 10,
      };

      // Add filters if they exist
      if (filters.search) {
        params.search = filters.search;
      }
      
      if (filters.package && filters.package !== 'all') {
        params.accountType = filters.package;
      }
      
      if (filters.status && filters.status !== 'all') {
        params.isVerified = filters.status === 'verified' ? 'true' : 'false';
      }

      // Call actual API
      const response = await usersAPI.getUsers(params);
      
      if (response.data.success) {
        const { users, pagination: paginationData } = response.data.data;
        
        // Add default avatar for users without avatars
        const usersWithPictures = users.map(user => ({
          ...user,
          picture: user.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
        }));

        dispatch(fetchUsersSuccess({
          users: usersWithPictures,
          pagination: {
            currentPage: paginationData.current,
            totalPages: paginationData.pages,
            totalUsers: paginationData.total,
            limit: paginationData.limit
          }
        }));
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      dispatch(fetchUsersFailure(error.message || 'Có lỗi xảy ra khi tải danh sách người dùng'));
    }
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const action = currentStatus ? 'vô hiệu hóa' : 'kích hoạt';
    if (!window.confirm(`Bạn có chắc chắn muốn ${action} người dùng này?`)) {
      return;
    }

    try {
      const response = await usersAPI.toggleUserStatus(userId);
      if (response.data.success) {
        // Refresh data to get updated status
        fetchUsers();
      }
    } catch (error) {
      console.error('Toggle user status error:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi thay đổi trạng thái người dùng');
    }
  };

  const columns = [
    {
      key: 'user',
      title: 'Người dùng',
      render: (_, user) => (
        <div className="user-info">
          <img src={user.picture} alt="User" className="user-avatar" />
          <div>
            <div className="user-name">{user.fullName}</div>
            <div className="user-role">Người dùng</div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      title: 'Email',
    },
    {
      key: 'accountType',
      title: 'Gói',
      render: (accountType) => {
        const displayName = getAccountTypeDisplayName(accountType);
        const isVip = accountType === 'VIP' || accountType === 'SUPER';
        return (
          <span className={`badge ${isVip ? 'badge-vip' : 'badge-free'}`}>
            {displayName}
          </span>
        );
      }
    },
    {
      key: 'createdAt',
      title: 'Ngày đăng ký',
      render: (date) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      key: 'isVerified',
      title: 'Trạng thái',
      render: (isVerified) => (
        <span className={`status ${isVerified ? 'status-active' : 'status-inactive'}`}>
          {isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Thao tác',
      render: (_, user) => (
        <div className="action-buttons">
          <button className="btn-action btn-edit" title="Chỉnh sửa">
            <i className="fas fa-edit"></i>
          </button>
          <button 
            className={`btn-action ${user.isVerified ? 'btn-disable' : 'btn-enable'}`}
            title={user.isVerified ? 'Hủy xác thực' : 'Xác thực'}
            onClick={() => handleToggleUserStatus(user._id, user.isVerified)}
          >
            <i className={`fas ${user.isVerified ? 'fa-ban' : 'fa-check'}`}></i>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="users-page">
      <div className="page-header">
        <h2>Quản lý người dùng</h2>
      </div>
      
      <div className="filters">
        <div className="filter-group">
          <select 
            className="filter-select"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="verified">Đã xác thực</option>
            <option value="unverified">Chưa xác thực</option>
          </select>
          
          <select 
            className="filter-select"
            value={filters.package}
            onChange={(e) => handleFilterChange('package', e.target.value)}
          >
            <option value="all">Tất cả gói</option>
            <option value="FREE">Cơ bản</option>
            <option value="VIP">VIP</option>
            <option value="SUPER">Super</option>
          </select>
          
          <input 
            type="text" 
            className="filter-input" 
            placeholder="Tìm kiếm theo tên, email..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
      )}
      
      <DataTable
        columns={columns}
        data={users}
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

export default Users;
