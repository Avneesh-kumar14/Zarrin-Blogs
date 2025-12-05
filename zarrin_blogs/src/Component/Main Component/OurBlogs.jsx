import React, { useEffect, useState } from 'react';
import Headings from '../Common/Heading';
import Paragraph from '../Common/Paragraph';
import Cards from '../Common/Cards';
import Pagination from '../Pagination';

const OurBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10); // Items per page

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // ✅ Fetch with pagination parameters
        const res = await fetch(
          `http://localhost:8200/api/blogs?page=${currentPage}&limit=${itemsPerPage}`
        );
        if (!res.ok) throw new Error('Failed to fetch blogs');
        
        const data = await res.json();
        
        // ✅ Update pagination state
        if (data.pagination) {
          setBlogs(data.data || []);
          setTotalPages(data.pagination.totalPages);
          setTotalItems(data.pagination.totalItems);
        } else {
          // Fallback for API without pagination response
          setBlogs(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        setError(err.message);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, [currentPage, itemsPerPage]);

  // ✅ Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of blogs section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="px-4 md:px-16 py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        

        {/* Blogs Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse space-y-4">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg w-80"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
            <Paragraph className="text-red-700 font-semibold">
              ❌ Error loading blogs
            </Paragraph>
            <Paragraph className="text-red-600 text-sm mt-2">{error}</Paragraph>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <Paragraph className="text-gray-600 dark:text-gray-300 text-lg">
              📝 No blogs published yet. Check back soon!
            </Paragraph>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blogs.map((blog) => (
                <Cards
                  key={blog._id}
                  id={blog._id}
                  imageSrc={blog.images && blog.images[0]}
                  imageAlt={blog.title}
                  headingSmall={blog.category && blog.category[0]?.name}
                  headingLarge={blog.title}
                  paragraph={blog.short_description}
                  buttonText="Read More"
                  buttonVariant="read"
                  createdAt={blog.createdAt}
                />
              ))}
            </div>
            
            {/* ✅ Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              isLoading={loading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default OurBlogs;
