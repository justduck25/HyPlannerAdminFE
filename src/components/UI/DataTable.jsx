const DataTable = ({ columns, data, loading = false, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="table-container">
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row._id || row.id}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="empty-state">
          <p>Không có dữ liệu</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;
