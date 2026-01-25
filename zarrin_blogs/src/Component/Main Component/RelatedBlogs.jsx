import React, { useState, useEffect, useCallback } from 'react';
import { Link, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Heading from '../Common/Heading';
import Paragraph from '../Common/Paragraph';

const RelatedBlogs = ({ blogId }) => {
  const navigate = useNavigate();
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRelatedBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8200/api/related/blog/${blogId}`);
      if (!res.ok) throw new Error('Failed to fetch related blogs');
      const data = await res.json();
      setRelated(data);
    } catch (err) {
      console.error('Error fetching related blogs:', err);
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    fetchRelatedBlogs();
  }, [blogId, fetchRelatedBlogs]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (!related || related.length === 0) return null;

  return (
    <div className="mt-20 pt-12 border-t-2 border-gray-200">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg">
            <Link size={24} className="text-white" />
          </div>
          <Heading type="h3" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Related Blogs
          </Heading>
        </div>
        <Paragraph className="text-gray-600">Similar articles you might like</Paragraph>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {related.map((blog) => (
          <div
            key={blog._id}
            onClick={() => navigate(`/blog/${blog._id}/preview`)}
            className="group bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300 transform hover:scale-105"
          >
            {/* Image */}
            {blog.images && blog.images.length > 0 && (
              <div className="h-36 overflow-hidden rounded-lg mb-4 bg-gray-200 relative">
                <img
                  src={blog.images[0]}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-120 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            )}

            {/* Content */}
            <Heading type="h4" className="text-base font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {blog.title}
            </Heading>

            <Paragraph className="text-xs text-gray-600 mb-4 line-clamp-2">
              By <span className="font-semibold">{blog.author?.name || 'Anonymous'}</span>
            </Paragraph>

            {/* Read More Link */}
            <div className="flex items-center gap-1 text-blue-600 text-sm font-bold group-hover:gap-2 transition-all opacity-0 group-hover:opacity-100">
              Read More
              <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedBlogs;
