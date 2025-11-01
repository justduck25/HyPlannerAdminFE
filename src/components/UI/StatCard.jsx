const StatCard = ({ icon, iconClass, title, value, loading = false }) => {
  // Ensure value is a valid number or fallback to 0
  const displayValue = loading ? '...' : (
    typeof value === 'number' && !isNaN(value) ? value.toLocaleString() : '0'
  );

  return (
    <div className="stat-card">
      <div className={`stat-icon ${iconClass}`}>
        <i className={icon}></i>
      </div>
      <div className="stat-content">
        <h3>{displayValue}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
