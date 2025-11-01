const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination">
      <button 
        className="pagination-btn" 
        onClick={handlePrevious}
        disabled={currentPage <= 1}
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      
      <span className="pagination-info">
        Trang {currentPage} / {totalPages}
      </span>
      
      <button 
        className="pagination-btn" 
        onClick={handleNext}
        disabled={currentPage >= totalPages}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default Pagination;
