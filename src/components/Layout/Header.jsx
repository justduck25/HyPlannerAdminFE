import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

const Header = ({ pageTitle, onMenuToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      // Close dropdown first
      setShowDropdown(false);
      setIsLoggingOut(true);
      
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Dispatch logout action
      dispatch(logout());
      
      // Navigate to login immediately
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        
        <div className="user-profile" onClick={toggleDropdown} ref={dropdownRef}>
          <img 
            src={user?.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} 
            alt="User Avatar" 
            className="profile-avatar"
          />
          <div className="profile-info">
            <span className="profile-name">{user?.fullName || 'Admin'}</span>
            <span className="profile-role">Quản trị viên</span>
          </div>
          <i className={`fas fa-chevron-${showDropdown ? 'up' : 'down'}`}></i>
          
          {/* Profile Dropdown */}
          {showDropdown && (
            <div className="profile-dropdown">
              <div className="dropdown-item">
                <i className="fas fa-user"></i>
                <span>Thông tin cá nhân</span>
              </div>
              <div className="dropdown-item">
                <i className="fas fa-cog"></i>
                <span>Cài đặt</span>
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item logout-item" onClick={handleLogout}>
                <i className={`fas ${isLoggingOut ? 'fa-spinner fa-spin' : 'fa-sign-out-alt'}`}></i>
                <span>{isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
