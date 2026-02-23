import React, { useState, useEffect } from 'react';
import Cards from '../Common/Cards';
import Button from '../Common/Button';
import Heading from '../Common/Heading';
import Image from '../Common/Image'; 
import Paragraph from '../Common/Paragraph';

const BlogSection = () => {
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Construct API URL properly
  let API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://zarrin-blogs-backend.onrender.com';
  const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

  useEffect(() => {
    fetchPopularBlogs();
  }, []);

  const fetchPopularBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/blogs?status=published&sort=views&order=desc&limit=3`);
      if (res.ok) {
        const data = await res.json();
        
        // Handle multiple response formats
        let blogs = [];
        if (data.data && Array.isArray(data.data)) {
          blogs = data.data;
        } else if (data.blogs && Array.isArray(data.blogs)) {
          blogs = data.blogs;
        } else if (Array.isArray(data)) {
          blogs = data;
        }
        
        setPopularBlogs(blogs);
      }
    } catch (err) {
      console.error('Error fetching popular blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='m-16'>
      <div className='flex gap-4 mx-24 '>
        <span className='text-xs font-bold'>POPULAR POSTS</span>
        <span className='text-xs font-medium opacity-65'>Trending this week</span>
      </div>
      
      <div className='mx-24 py-8 text-dark'>
        <Heading type='h4' className='custom-heading-xl font-bold'>
          Most Popular Blog Posts
        </Heading>  
        <Heading type='h4' className='custom-heading-xl font-bold'>
          From Our Community
        </Heading>
      </div>

      <div className='m-4'>
        <div className="flex justify-between px-6 py-2">
          <Heading type='h4' className='font-bold'>
            Popular Posts
          </Heading>
          <Button
            text="View All"
            variant="primary"
            className="mb-10 hover:bg-secondaryGray"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-warning-bg dark:border-warning-dark border-t-warning"></div>
            <p className="text-text-secondary mt-3">Loading blogs...</p>
          </div>
        ) : popularBlogs.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 px-6'>
            {popularBlogs.map((blog) => (
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
          <div className="text-center py-12 px-6">
            <Paragraph className="text-text-secondary">
              No blogs available yet. Check back soon!
            </Paragraph>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogSection;





