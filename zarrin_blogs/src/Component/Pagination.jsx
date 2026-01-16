import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * PAGINATION COMPONENT
 * Professional pagination with minimal design.
 * 
 * Props:
 * - currentPage: Current active page (1-indexed)
 * - totalPages: Total number of pages
 * - onPageChange: Callback when page changes
 * - itemsPerPage: Items displayed per page
 * - totalItems: Total number of items
 * - isLoading: Loading state
 */
const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange = () => {},
  itemsPerPage = 10,
  totalItems = 0,
  isLoading = false 
}) => {
  const [inputPage, setInputPage] = useState(currentPage);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      setInputPage(page);
    }
  };

  const handleGoToPage = (e) => {
    e.preventDefault();
    const page = parseInt(inputPage);
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page);
    } else {
      setInputPage(currentPage);
    }
  };

  if (totalPages <= 1) {
    return null; // Don't show pagination if only 1 page
  }

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col gap-6 items-center justify-center py-8 px-4">
      {/* Results Info - Professional typography */}
      {totalItems > 0 && (
        <div className="text-body-sm text-text-secondary">
          Showing <span className="font-medium text-text-primary">{startItem}</span> to{' '}
          <span className="font-medium text-text-primary">{endItem}</span> of{' '}
          <span className="font-medium text-text-primary">{totalItems}</span> results
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="p-2 rounded-sm border border-border-light hover:bg-bg-muted
                     hover:border-border-muted disabled:opacity-50 disabled:cursor-not-allowed 
                     transition-all duration-200 bg-bg-surface text-text-primary
                     focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          aria-label="Previous page"
          title="Previous page"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1 items-center">
          {pageNumbers.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-text-muted">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page)}
                  disabled={isLoading}
                  className={`min-w-10 h-10 rounded-sm font-medium transition-all duration-200
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary
                    ${currentPage === page
                    ? 'bg-accent-primary text-white shadow-sm'
                    : 'bg-bg-surface border border-border-light text-text-primary hover:bg-bg-muted'
                  }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                  aria-label={`Go to page ${page}`}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="p-2 rounded-sm border border-border-light hover:bg-bg-muted
                     hover:border-border-muted disabled:opacity-50 disabled:cursor-not-allowed 
                     transition-all duration-200 bg-bg-surface text-text-primary
                     focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
          aria-label="Next page"
          title="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Go to Page Input */}
      <form onSubmit={handleGoToPage} className="flex items-center gap-2">
        <label htmlFor="go-to-page" className="text-body-sm text-text-secondary">
          Go to page:
        </label>
        <input
          id="go-to-page"
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          disabled={isLoading}
          className="input-base w-16 text-center"
          aria-label="Page number"
        />
        <span className="text-body-sm text-text-muted">of {totalPages}</span>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-secondary-sm"
        >
          Go
        </button>
      </form>
    </div>
  );
};

export default Pagination;
