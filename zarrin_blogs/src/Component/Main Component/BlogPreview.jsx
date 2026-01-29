
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Heading from '../Common/Heading';
import Paragraph from '../Common/Paragraph';
import Image from '../Common/Image';
import Comments from '../Common/Comments';
import LikeBookmarkButtons from '../Common/LikeBookmarkButtons';
import RelatedBlogs from './RelatedBlogs';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { getApiUrl } from '../../utils/apiConfig';

const BlogPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readTime, setReadTime] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch(getApiUrl(`/api/blogs/${id}`), {
        credentials: 'include' // CRITICAL: include cookies for production CORS
      });
      const data = await res.json();
      setBlog(data);

      if (data.blog_content) {
        const words = data.blog_content.split(/\s+/).length;
        setReadTime(Math.ceil(words / 200));
      }

      setLoading(false);
      window.scrollTo(0, 0);
    };

    if (isAuthenticated) {
      const user = localStorage.getItem('user');
      if (user) setCurrentUser(JSON.parse(user));
    }

    fetchBlog();
  }, [id, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen">

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 py-14 animate-[fadeIn_0.4s_ease-out]">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-all duration-200 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        {/* Category */}
        <p className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3">
          {blog.category?.[0]?.name || 'Article'}
        </p>

        {/* Title */}
        <Heading
          type="h1"
          className="text-4xl font-semibold leading-snug mb-4 tracking-tight"
        >
          {blog.title}
        </Heading>

        {/* Description */}
        {blog.short_description && (
          <Paragraph className="text-lg text-slate-600 mb-6">
            {blog.short_description}
          </Paragraph>
        )}

        {/* Meta */}
        <div className="flex flex-wrap gap-6 text-sm text-slate-500 mb-10">
          <span className="flex items-center gap-2">
            <User size={14} />
            {blog.author?.name}
          </span>
          <span className="flex items-center gap-2">
            <Calendar size={14} />
            {new Date(blog.createdAt).toDateString()}
          </span>
          {readTime > 0 && (
            <span className="flex items-center gap-2">
              <Clock size={14} />
              {readTime} min read
            </span>
          )}
        </div>

        {/* Image */}
        {blog.images?.[0] && (
          <div className="mb-12 overflow-hidden rounded-xl shadow-sm">
            <Image
              src={blog.images[0]}
              alt={blog.title}
              className="w-full rounded-xl transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-14
          prose-headings:font-semibold
          prose-p:leading-relaxed
          prose-a:text-indigo-600
          prose-a:font-medium
          prose-img:rounded-lg">
          <div dangerouslySetInnerHTML={{ __html: blog.blog_content }} />
        </div>

        {/* Gallery */}
        {blog.images && blog.images.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {blog.images.slice(1).map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt={`Gallery ${idx + 1}`}
                className="rounded-lg transition-transform duration-500 hover:scale-[1.03]"
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="border-t border-slate-200 pt-8 mb-16">
          <LikeBookmarkButtons
            blogId={id}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* Comments */}
        <div className="mb-20">
          <Comments
            blogId={id}
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* Related */}
        <div className="pt-10 border-t border-slate-200">
          <RelatedBlogs blogId={id} />
        </div>

      </article>

      {/* animation keyframe */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default BlogPreview;
