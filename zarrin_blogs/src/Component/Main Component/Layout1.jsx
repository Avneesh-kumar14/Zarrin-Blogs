import React, { useState, useEffect } from 'react';
import Cards from '../Common/Cards';
import Button from '../Common/Button';
import Heading from '../Common/Heading';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Construct API URL properly
  let API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8200';
  const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/blogs?status=published&sort=likes&order=desc&limit=6`);
      if (res.ok) {
        const data = await res.json();
        
        // Handle multiple response formats
        let blogsArray = [];
        if (data.data && Array.isArray(data.data)) {
          blogsArray = data.data;
        } else if (data.blogs && Array.isArray(data.blogs)) {
          blogsArray = data.blogs;
        } else if (Array.isArray(data)) {
          blogsArray = data;
        }
        
        setBlogs(blogsArray);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-4 md:px-16 py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-colors'>
      <div className="flex justify-between px-6 py-2">
        <Heading type='h4' className='font-bold text-gray-900 dark:text-white'>
          Popular Post
        </Heading>

        <Button
          text="View All"
          variant="primary"
          className="mb-10 hover:bg-secondaryGray"
        />
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-orange-200 dark:border-orange-900 border-t-orange-600"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-3">Loading blogs...</p>
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8 ">
          {blogs.map((blog) => (
            <Cards 
              key={blog._id}
              id={blog._id}
              imageSrc={blog.images?.[0]}
              imageAlt={blog.title}
              headingSmall={blog.category?.[0]?.name}
              headingLarge={blog.title}
              paragraph={blog.short_description}
              buttonText="Read More.."
              buttonVariant="read"
              createdAt={blog.createdAt}
              likes={blog.likes?.length || 0}
              comments={blog.comments?.length || 0}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No blogs available yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogSection;
