import { useState, useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Handle authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      setIsTransitioning(true);
      // Small delay to prevent white screen flash
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    if (isTransitioning) {
      // Show loading state during transition
      return (
        <div className="loading-container">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Đang chuyển hướng...</span>
          </div>
        </div>
      );
    }
    return <Navigate to="/login" replace />;
  }

  // Get page title based on current route
  const getPageTitle = (pathname) => {
    const routes = {
      "/dashboard": "Tổng quan",
      "/users": "Quản lý người dùng",
      "/weddings": "Sự kiện cưới",
      "/payments": "Thanh toán",
      "/analytics": "Thống kê",
      "/feedbacks": "Phản hồi",
      "/settings": "Cài đặt",
    };
    return routes[pathname] || "Dashboard";
  };

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  // Handle window resize with debounce
  useEffect(() => {
    let timeoutId;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);

        // Auto close sidebar on mobile when resizing
        if (mobile && sidebarOpen) {
          setSidebarOpen(false);
        }
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [sidebarOpen]);

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      <div className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
        <Header
          pageTitle={getPageTitle(location.pathname)}
          onMenuToggle={handleMenuToggle}
        />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
