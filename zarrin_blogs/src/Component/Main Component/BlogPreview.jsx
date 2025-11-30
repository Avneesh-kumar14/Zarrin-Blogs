import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Heading from '../Common/Heading';
import Paragraph from '../Common/Paragraph';
import Image from '../Common/Image';
import Button from '../Common/Button';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

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
        // Scroll to top
        window.scrollTo(0, 0);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="animate-pulse space-y-8 w-full max-w-3xl px-4">
          <div className="h-96 bg-gray-200 rounded-xl"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-lg max-w-md">
          <Heading type="h4" className="text-red-700 mb-2">⚠️ Error</Heading>
          <Paragraph className="text-red-600 mb-4">{error}</Paragraph>
          <button
            onClick={() => navigate(-1)}
            className="text-red-600 font-semibold hover:text-red-700 transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <Heading type="h3" className="text-gray-700 mb-4">📝 Blog Not Found</Heading>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Header Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors font-semibold group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category and Date Badge */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold uppercase tracking-wider">
            {blog.category && blog.category[0]?.name ? blog.category[0].name : 'Article'}
          </span>
          <div className="flex items-center text-gray-600 text-sm space-x-2">
            <Calendar size={16} />
            <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <Heading 
            type="h1" 
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight"
          >
            {blog.title}
          </Heading>
          {blog.short_description && (
            <Paragraph className="text-xl text-gray-700 leading-relaxed opacity-90 font-medium">
              {blog.short_description}
            </Paragraph>
          )}
        </div>

        {/* Author Info - Enhanced */}
        {blog.author && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-lg p-6 mb-8 flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {blog.author.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <Paragraph className="font-bold text-gray-900 flex items-center space-x-2">
                <User size={16} />
                <span>{blog.author.name}</span>
              </Paragraph>
              <Paragraph className="text-sm text-gray-600">{blog.author.email}</Paragraph>
            </div>
          </div>
        )}

        {/* Featured Image - Beautiful */}
        {blog.images && blog.images[0] && (
          <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
            <Image 
              src={blog.images[0]} 
              className="w-full h-96 sm:h-[500px] object-cover hover:scale-105 transition-transform duration-500" 
              alt={blog.title}
            />
          </div>
        )}

        {/* Blog Content - Styled */}
        <div className="mb-12">
          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:hover:text-blue-700 prose-strong:text-gray-900 prose-strong:font-bold prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: blog.blog_content }}
          />
        </div>

        {/* Additional Images Gallery */}
        {blog.images && blog.images.length > 1 && (
          <div className="mb-12">
            <Heading type="h3" className="text-2xl font-bold text-gray-900 mb-6">
              📸 Gallery
            </Heading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {blog.images.slice(1).map((img, idx) => (
                <div key={idx} className="group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                  <Image 
                    src={img} 
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
                    alt={`Blog image ${idx + 2}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t-2 border-gray-200 my-12"></div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl border border-gray-200">
          <div>
            <Heading type="h4" className="text-gray-900 mb-2">Ready for more insights?</Heading>
            <Paragraph className="text-gray-600">Explore more articles from our collection.</Paragraph>
          </div>
          <button
            onClick={() => navigate('/blog')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-1 whitespace-nowrap"
          >
            Explore More
          </button>
        </div>
      </article>
    </div>
  );
};

export default BlogPreview;
