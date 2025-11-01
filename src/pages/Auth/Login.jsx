import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure, clearError } from '../../store/slices/authSlice';
import { authAPI } from '../../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      dispatch(loginFailure('Vui lòng nhập đầy đủ thông tin'));
      return;
    }

    dispatch(loginStart());

    try {
      const response = await authAPI.login(formData);
      
      if (response.data.success) {
        dispatch(loginSuccess({
          user: response.data.data.user,
          token: response.data.data.token
        }));
      } else {
        dispatch(loginFailure(response.data.message || 'Đăng nhập thất bại'));
      }
    } catch (error) {
      dispatch(loginFailure(error.message || 'Có lỗi xảy ra khi đăng nhập'));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <i className="fas fa-heart"></i>
          </div>
          <h1 className="login-title">HyPlanner Admin</h1>
          <p className="login-subtitle">Đăng nhập vào trang quản trị</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              placeholder="Nhập tên đăng nhập (admin)"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Đang đăng nhập...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Đăng nhập
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
