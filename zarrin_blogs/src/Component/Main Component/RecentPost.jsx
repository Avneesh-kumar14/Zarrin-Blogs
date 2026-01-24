import React, { useState, useEffect } from 'react'
import Image from '../Common/Image'
import Headings from '../Common/Heading'
import Button from '../Common/Button'
import Paragraph from '../Common/Paragraph'
import Cards from '../Common/Cards'

const RecentPost = () => {
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Construct API URL properly
  let API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://zarrin-blogs-backend.onrender.com';
  const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/blogs?status=published&sort=createdAt&order=desc&limit=4`);
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
        
        if (blogs.length > 0) {
          setFeaturedBlog(blogs[0]);
          setRecentBlogs(blogs.slice(1, 4));
        }
      }
    } catch (err) {
      console.error('Error fetching recent blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='px-4  md:px-16 py-12 bg-white dark:bg-gray-800 transition-colors'>
      
<div className='px-4 md:px-8 py-12 sm:flex-row'>

  <div className='flex flex-col sm:flex-row justify-between items-start  gap-4'>
    <Headings type='h3'
      className='text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white'>
      Our Recent Post
    </Headings>
    <Button text="View All"variant="primary"className="px-6 py-2 rounded-md"/>
  </div>

</div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-orange-200 dark:border-orange-900 border-t-orange-600"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-3">Loading blogs...</p>
        </div>
      ) : (
        <>
      <div className='flex flex-col lg:flex-row gap-8 my-12'>
        
        
        <div className='w-full lg:w-1/2'>
          <Image 
            src={featuredBlog?.images?.[0] || './Assets/man.png'} 
            className="w-full h-auto max-w-full" 
          />
        </div>

       
        <div className='w-full lg:w-1/2'>
          <div className='flex gap-4 flex-wrap'>
            <span className='text-xs font-bold text-gray-900 dark:text-gray-300'>
              {featuredBlog?.category?.[0]?.name || 'DEVELOPMENT'}
            </span>
            <span className='text-xs font-medium opacity-65 text-gray-700 dark:text-gray-400'>
              {featuredBlog?.createdAt ? new Date(featuredBlog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '1 August 2025'}
            </span>
          </div>

          <div className='py-4'>
            <Headings type='h4' className='custom-heading-xl py-4 text-gray-900 dark:text-white'>
              {featuredBlog?.title || "How to make a Game look more attractive with New VR & AI Technology"}
            </Headings>
          </div>

          <Paragraph variant='small' className='font-normal py-2 opacity-65 text-gray-700 dark:text-gray-400'>
            {featuredBlog?.short_description || "Google has been investing in AI for many years and bringing its benefits to individuals, businesses and communities. Whether it's publishing state-of-the-art research, building helpful products or developing tools and resources that enable others, we're committed to making AI accessible to everyone."}
          </Paragraph>

          <div className='py-8'>
            <Button variant='outline' text='Read More' className='rounded-lg text-primary' />
          </div>
        </div>
      </div>

     
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8">
        {recentBlogs.map((blog, index) => (
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
          />
        ))}
      </div>
        </>
      )}

    </div>
  )
}

export default RecentPost
