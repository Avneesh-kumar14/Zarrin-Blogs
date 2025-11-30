
import React, { useEffect, useState } from 'react';
import Headings from '../Common/Heading';
import Paragraph from '../Common/Paragraph';
import Cards from '../Common/Cards';

const OurBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('http://localhost:8200/api/blogs');
        if (!res.ok) throw new Error('Failed to fetch blogs');
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="px-4 md:px-16 py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Headings 
            type="h6" 
            className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-2"
          >
            Explore Our Collection
          </Headings>
          <Headings 
            type="h2" 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Discover Amazing Stories
          </Headings>
          <Paragraph 
            className="text-gray-600 max-w-2xl mx-auto leading-relaxed opacity-80"
          >
            Read thoughtfully researched articles and insights from our talented writers. 
            Explore diverse topics and gain valuable knowledge.
          </Paragraph>
        </div>

        {/* Blogs Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse space-y-4">
              <div className="h-64 bg-gray-200 rounded-lg w-80"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <Paragraph className="text-red-700 font-semibold">
              ❌ Error loading blogs
            </Paragraph>
            <Paragraph className="text-red-600 text-sm mt-2">{error}</Paragraph>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <Paragraph className="text-gray-600 text-lg">
              📝 No blogs published yet. Check back soon!
            </Paragraph>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default OurBlogs;
