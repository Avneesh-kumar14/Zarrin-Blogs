import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Heading from '../Common/Heading';
import Paragraph from '../Common/Paragraph';
import Image from '../Common/Image';
import Comments from '../Common/Comments';
import LikeBookmarkButtons from '../Common/LikeBookmarkButtons';
import { ArrowLeft, Calendar, User, Share2, Eye, BookOpen, Clock } from 'lucide-react';

const BlogPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [readTime, setReadTime] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:8200/api/blogs/${id}`);
        if (!res.ok) throw new Error('Failed to fetch blog');
        const data = await res.json();
        setBlog(data);
        
        // Calculate read time
        if (data.blog_content) {
          const wordCount = data.blog_content.split(/\s+/).length;
          const time = Math.ceil(wordCount / 200); // 200 words per minute
          setReadTime(time);
        }
        
        window.scrollTo(0, 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch current user if authenticated
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    }

    if (id) {
      fetchBlog();
    } else {
      setLoading(false);
    }
  }, [id, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-pulse space-y-8 w-full max-w-4xl px-4">
          <div className="h-96 bg-gradient-to-r from-blue-200 to-purple-200 rounded-2xl"></div>
          <div className="h-10 bg-blue-200 rounded w-3/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 p-8 rounded-2xl max-w-md shadow-xl">
          <div className="text-5xl mb-4">❌</div>
          <Heading type="h4" className="text-red-700 mb-2 text-2xl font-bold">Oops! Error Loading</Heading>
          <Paragraph className="text-red-600 mb-6">{error}</Paragraph>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <Heading type="h3" className="text-gray-700 mb-4 text-3xl font-bold">Blog Not Found</Heading>
          <Paragraph className="text-gray-600 mb-6">This blog has been removed or doesn't exist.</Paragraph>
          <button
            onClick={() => navigate('/blog')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Sticky Header Navigation */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold group hover:bg-blue-50 px-4 py-2 rounded-lg"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-300 group" title="Share">
              <Share2 size={20} className="text-gray-600 group-hover:text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Category Badge & Date */}
        <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-in">
          <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            {blog.category && blog.category[0]?.name ? blog.category[0].name : '📰 Article'}
          </span>
          <div className="flex items-center text-gray-600 text-sm space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <Calendar size={16} className="text-blue-600" />
            <span className="font-medium">{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          {readTime > 0 && (
            <div className="flex items-center text-gray-600 text-sm space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <Clock size={16} className="text-purple-600" />
              <span className="font-medium">{readTime} min read</span>
            </div>
          )}
        </div>

        {/* Hero Title Section */}
        <div className="mb-10 animate-fade-in-up">
          <Heading 
            type="h1" 
            className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight"
          >
            {blog.title}
          </Heading>
          {blog.short_description && (
            <Paragraph className="text-2xl text-gray-700 leading-relaxed opacity-90 font-semibold">
              {blog.short_description}
            </Paragraph>
          )}
        </div>

        {/* Author Card - Enhanced */}
        {blog.author && (
          <div className="mb-10 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-100 rounded-2xl flex items-center space-x-6 shadow-lg hover:shadow-xl transition-shadow animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
              {blog.author.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <Paragraph className="font-bold text-gray-900 flex items-center space-x-2 text-lg">
                <User size={18} className="text-blue-600" />
                <span>{blog.author.name}</span>
              </Paragraph>
              <Paragraph className="text-gray-600 text-sm mt-1">{blog.author.email}</Paragraph>
              <Paragraph className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                <Eye size={14} />
                <span>Professional Writer</span>
              </Paragraph>
            </div>
          </div>
        )}

        {/* Featured Image - Stunning */}
        {blog.images && blog.images[0] && (
          <div className="mb-14 rounded-2xl overflow-hidden shadow-2xl group animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="relative overflow-hidden h-96 sm:h-[600px] bg-gray-200">
              <Image 
                src={blog.images[0]} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={blog.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        )}

        {/* Blog Content - Professional Typography */}
        <div className="mb-14 bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-gray-100 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <div 
            className="prose prose-lg max-w-none 
              prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
              prose-h2:text-3xl prose-h3:text-2xl
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-5
              prose-a:text-blue-600 prose-a:hover:text-blue-700 prose-a:font-semibold
              prose-strong:text-gray-900 prose-strong:font-bold
              prose-code:bg-gradient-to-r prose-code:from-blue-50 prose-code:to-purple-50 prose-code:text-blue-700 prose-code:px-3 prose-code:py-1 prose-code:rounded-lg prose-code:font-mono
              prose-pre:bg-gradient-to-br prose-pre:from-gray-900 prose-pre:to-gray-800 prose-pre:text-white
              prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:rounded-r-lg
              prose-img:rounded-xl prose-img:shadow-lg prose-img:hover:shadow-2xl prose-img:transition-shadow"
            dangerouslySetInnerHTML={{ __html: blog.blog_content }}
          />
        </div>

        {/* Gallery Section */}
        {blog.images && blog.images.length > 1 && (
          <div className="mb-14 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <Heading type="h2" className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
              <span className="text-4xl">🖼️</span>
              <span>Gallery</span>
            </Heading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blog.images.slice(1).map((img, idx) => (
                <div 
                  key={idx} 
                  className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-64 bg-gray-200"
                >
                  <Image 
                    src={img} 
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500" 
                    alt={`Blog image ${idx + 2}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider with gradient */}
        <div className="mb-14 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-full"></div>

        {/* Like and Bookmark Buttons */}
        <div className="mb-12 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <LikeBookmarkButtons 
            blogId={id}
            isAuthenticated={isAuthenticated}
            onLikeChange={(count) => {}}
          />
        </div>

        {/* Comments Section */}
        <div className="mb-12 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
          <Comments 
            blogId={id}
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* Divider with gradient */}
        <div className="mb-14 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-full"></div>
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 md:p-12 rounded-2xl text-white shadow-2xl hover:shadow-2xl transition-all duration-300 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <Heading type="h3" className="text-2xl md:text-3xl font-bold mb-3 text-white">📚 Ready for more stories?</Heading>
              <Paragraph className="text-blue-50 text-lg">Explore our collection of inspiring articles and insights.</Paragraph>
            </div>
            <button
              onClick={() => navigate('/blog')}
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg whitespace-nowrap flex items-center space-x-2"
            >
              <BookOpen size={20} />
              <span>Browse Blogs</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPreview;
