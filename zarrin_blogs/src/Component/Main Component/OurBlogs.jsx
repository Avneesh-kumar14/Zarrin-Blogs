
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Headings from '../Common/Heading';
import Paragraph from '../Common/Paragraph';
import Cards from '../Common/Cards';

const OurBlogs = () => {
  const navigate = useNavigate();
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
    <div className="px-4 md:px-16 py-12">
      <div className="bg-tertiary justify-center">
        <div className="py-4">
          <Headings type="h6" className="text-center opacity-65">
            OUR BLOGS
          </Headings>
          <Headings type="h2" className="text-center py-4">
            Find our all blogs from here
          </Headings>
          <div className="flex justify-center">
            <Paragraph variant="small" className="text-center py-4 opacity-65 max-w-xl">
              our blogs are written from very research research and well known writers writers so that we can provide you the best blogs and articles articles for you to read them all along
            </Paragraph>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
            {loading ? (
              <Paragraph>Loading blogs...</Paragraph>
            ) : error ? (
              <Paragraph className="text-red-500">{error}</Paragraph>
            ) : blogs.length === 0 ? (
              <Paragraph>No blogs found.</Paragraph>
            ) : (
              blogs.map((blog) => (
                <Cards
                  key={blog._id}
                  imageSrc={blog.images && blog.images[0]}
                  imageAlt={blog.title}
                  headingSmall={blog.category && blog.category[0]?.name}
                  headingLarge={blog.title}
                  paragraph={blog.short_description}
                  buttonText="Read More.."
                  buttonVariant="read"
                  // Add onClick or navigation as needed
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurBlogs;
