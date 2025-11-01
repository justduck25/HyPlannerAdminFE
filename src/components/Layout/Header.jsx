import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Header = ({ pageTitle, onMenuToggle }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="mobile-menu-toggle" onClick={onMenuToggle}>
          <i className="fas fa-bars"></i>
        </button>
        <h1 className="page-title">{pageTitle}</h1>
      </div>
      
      <div className="header-right">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Tìm kiếm..." />
        </div>
        
        <div className="notifications">
          <button className="notification-btn">
            <i className="fas fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>
        </div>
        
        <div className="user-profile" onClick={handleLogout}>
          <img 
            src={user?.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} 
            alt="User Avatar" 
            className="profile-avatar"
          />
          <div className="profile-info">
            <span className="profile-name">{user?.fullName || 'Admin'}</span>
            <span className="profile-role">Quản trị viên</span>
          </div>
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
