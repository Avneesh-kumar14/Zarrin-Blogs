import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * ✅ PAGINATION COMPONENT
 * Handles pagination UI and state management
 * 
 * Props:
 * - currentPage: Current active page (1-indexed)
 * - totalPages: Total number of pages
 * - onPageChange: Callback when page changes
 * - itemsPerPage: Items displayed per page
 * - totalItems: Total number of items
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
    <div className="flex flex-col gap-4 items-center justify-center py-8 px-4">
      {/* Results Info */}
      {totalItems > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span> to{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{endItem}</span> of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> results
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                <span className="px-3 py-2 text-gray-600 dark:text-gray-400">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page)}
                  disabled={isLoading}
                  className={`
                    px-3 py-2 rounded-lg transition-all font-medium
                    ${
                      page === currentPage
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  aria-current={page === currentPage ? 'page' : undefined}
                  title={`Go to page ${page}`}
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
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
          title="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Go to Page Input */}
      <form onSubmit={handleGoToPage} className="flex gap-2 items-center">
        <label htmlFor="goto-page" className="text-sm text-gray-600 dark:text-gray-400">
          Go to page:
        </label>
        <input
          id="goto-page"
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
        >
          Go
        </button>
      </form>

      {/* Page Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of{' '}
        <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
      </div>
    </div>
  );
};

export default Pagination;
