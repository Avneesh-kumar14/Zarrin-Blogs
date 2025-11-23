import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Heading from '../Common/Heading';
import Paragraph from '../Common/Paragraph';
import Image from '../Common/Image';
import Button from '../Common/Button';

const BlogPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:8200/api/blogs/${id}`);
        if (!res.ok) throw new Error('Failed to fetch blog');
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center"><Paragraph>Loading blog...</Paragraph></div>;
  if (error) return <div className="p-8 text-center"><Paragraph className="text-red-500">Error: {error}</Paragraph></div>;
  if (!blog) return <div className="p-8 text-center"><Paragraph>Blog not found</Paragraph></div>;

  return (
    <div className="m-16">
      {/* Back Button */}
      <div className="mb-6">
        <Button 
          onClick={() => navigate(-1)}
          variant="secondary"
          className="px-4 py-2"
        >
          ← Back
        </Button>
      </div>

      {/* Blog Header */}
      <div className="flex gap-4 mx-4 mb-4">
        <span className="text-xs font-bold">
          {blog.category && blog.category[0]?.name ? blog.category[0].name : 'BLOG'}
        </span>
        <span className="text-xs font-medium opacity-65">
          {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Blog Title */}
      <div className="mx-4 py-8 text-dark">
        <Heading type="h2" className="font-bold text-3xl mb-4">{blog.title}</Heading>
        {blog.short_description && (
          <Paragraph className="text-lg opacity-75 mb-6">{blog.short_description}</Paragraph>
        )}
      </div>

      {/* Author Info */}
      {blog.author && (
        <div className="mx-4 py-4 border-b border-gray-200">
          <Paragraph className="text-sm opacity-70">
            <strong>By {blog.author.name}</strong> • {blog.author.email}
          </Paragraph>
        </div>
      )}

      {/* Featured Image */}
      {blog.images && blog.images[0] && (
        <div className="flex justify-center my-8">
          <Image 
            src={blog.images[0]} 
            className="h-96 w-full object-cover rounded-lg max-w-4xl" 
            alt={blog.title}
          />
        </div>
      )}

      {/* Blog Content */}
      <div className="mx-auto px-4 md:px-16 py-8 max-w-4xl">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.blog_content }}
        />
      </div>

      {/* Additional Images Gallery */}
      {blog.images && blog.images.length > 1 && (
        <div className="mx-auto px-4 md:px-16 py-8 max-w-4xl">
          <Heading type="h4" className="font-semibold mb-4">More Images</Heading>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {blog.images.slice(1).map((img, idx) => (
              <Image 
                key={idx}
                src={img} 
                className="h-40 w-full object-cover rounded-lg" 
                alt={`Blog image ${idx + 2}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Back Button at Bottom */}
      <div className="flex justify-center py-8">
        <Button 
          onClick={() => navigate(-1)}
          variant="secondary"
          className="px-6 py-3"
        >
          Back to Blogs
        </Button>
      </div>
    </div>
  );
};

export default BlogPreview;
