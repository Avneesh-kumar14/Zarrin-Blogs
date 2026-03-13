import React, { useEffect, useState } from 'react';
import Paragraph from '../Common/Paragraph';
import Cards from '../Common/Cards';
import Pagination from '../Pagination';
import CardSkeleton from '../Common/CardSkeleton';
import { getApiUrl } from '../../utils/apiConfig';

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
          getApiUrl(`/api/blogs?page=${currentPage}&limit=${itemsPerPage}`),
          {
            credentials: 'include' // CRITICAL: include cookies for production CORS
          }
        );
        if (!res.ok) throw new Error('Failed to fetch blogs');
        
        const data = await res.json();
        console.log('📥 OurBlogs API Response received:', {
          status: res.status,
          hasData: !!data.data,
          blogCount: data.data?.length || 0,
          paginationInfo: data.pagination
        });

        // ✅ Update pagination state
        if (data.pagination) {
          const fetchedBlogs = data.data || [];
          console.log('🔍 Analyzing fetched blogs:');
          fetchedBlogs.forEach((blog, idx) => {
            console.log(`   Blog ${idx + 1}: "${blog.title}"`, {
              hasImages: !!blog.images,
              isArray: Array.isArray(blog.images),
              imageCount: blog.images?.length || 0,
              firstImage: blog.images?.[0] ? blog.images[0].substring(0, 60) + '...' : 'NONE',
              allImages: blog.images
            });
          });
          setBlogs(fetchedBlogs);
          setTotalPages(data.pagination.totalPages);
          setTotalItems(data.pagination.totalItems);
        } else {
          // Fallback for API without pagination response
          const blogArray = Array.isArray(data) ? data : [];
          console.log('⚠️ Response without pagination structure:', blogArray);
          setBlogs(blogArray);
        }
      } catch (err) {
        console.error('❌ Error fetching blogs:', err);
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
    <div className="px-4 md:px-16 py-16 bg-surface-primary dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto">
        

        {/* Blogs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <CardSkeleton count={Math.min(6, itemsPerPage)} />
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
