import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { path: "/dashboard", icon: "fas fa-chart-pie", label: "Tổng quan" },
    { path: "/users", icon: "fas fa-users", label: "Người dùng" },
    { path: "/weddings", icon: "fas fa-ring", label: "Sự kiện cưới" },
    { path: "/payments", icon: "fas fa-credit-card", label: "Thanh toán" },
    { path: "/analytics", icon: "fas fa-chart-line", label: "Thống kê" },
    { path: "/feedbacks", icon: "fas fa-chart-line", label: "Phản hồi" },
    { path: "/settings", icon: "fas fa-cog", label: "Cài đặt" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`mobile-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-heart"></i>
            <span>HyPlanner Admin</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  onClick={onClose}
                >
                  <i className={item.icon}></i>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
