import React, { useState, useEffect } from 'react'
import { ArrowRight, Clock, User, Zap, BookOpen, Sparkles, Pen, Star, Share2, Shield } from 'lucide-react'
import TrendingBlogs from '../Component/Main Component/TrendingBlogs'

const Home = () => {
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('http://localhost:8200/api/blogs?status=published');
      if (res.ok) {
        const data = await res.json();
        const blogs = data.blogs || data;
        if (Array.isArray(blogs) && blogs.length > 0) {
          setFeaturedBlog(blogs[0]);
          setRecentBlogs(blogs.slice(1, 7));
        }
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Section with Featured Blog */}
      {featuredBlog && (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-20">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Featured Content */}
              <div className="space-y-8 animate-fade-in">
                {/* Badge with Social Proof */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all">
                    <Zap size={16} className="text-yellow-400" />
                    <span className="text-sm font-semibold text-white">Featured Story</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                    <Star size={14} className="text-blue-300" />
                    <span className="text-xs font-semibold text-white">Trusted by 50K+ Writers Worldwide</span>
                  </div>
                </div>

                {/* Category & Meta */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-lg">
                      {featuredBlog.category || 'FEATURED'}
                    </span>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Clock size={14} />
                      {new Date(featuredBlog.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight line-clamp-3">
                    {featuredBlog.title}
                  </h1>

                  {/* Description */}
                  <p className="text-gray-300 text-lg leading-relaxed line-clamp-3">
                    {featuredBlog.description || 'Discover insights and stories from our community of writers and thinkers.'}
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-300">10K+</div>
                      <div className="text-xs text-gray-400">Articles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-300">100K+</div>
                      <div className="text-xs text-gray-400">Readers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-300">500+</div>
                      <div className="text-xs text-gray-400">Authors</div>
                    </div>
                  </div>
                </div>

                {/* Meta Info & CTA */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{featuredBlog.author?.name || 'Author'}</p>
                      <p className="text-gray-400 text-sm">{featuredBlog.readingTime || '5 min'} read</p>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <a 
                      href={`/blog/${featuredBlog._id}/preview`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all hover:scale-105 transform duration-200"
                    >
                      Read Story
                      <ArrowRight size={18} />
                    </a>
                    <a 
                      href="/blog"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all border border-white/20 backdrop-blur-sm"
                    >
                      Browse All
                    </a>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500"></div>
                <img 
                  src={featuredBlog.image || '/Assets/man.png'} 
                  alt={featuredBlog.title}
                  className="relative w-full h-96 object-cover rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-500 transform group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Zarrin Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
              <Sparkles size={16} className="text-yellow-400" />
              <span className="text-sm font-semibold text-white">Why Writers Choose Zarrin</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to Share Your Voice
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Zarrin gives you the platform, the audience, and the tools to share your ideas with the world
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="group relative bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border border-blue-400/20 rounded-2xl p-8 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Pen size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Write Freely</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  No limits, no restrictions. Unlimited content length, rich formatting, and complete creative freedom.
                </p>
                <div className="mt-4 pt-4 border-t border-blue-400/20">
                  <span className="text-xs font-semibold text-blue-300">✓ Unlimited posts</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm border border-purple-400/20 rounded-2xl p-8 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Share2 size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Reach Readers</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Connect with engaged readers hungry for quality content. Grow your followers organically.
                </p>
                <div className="mt-4 pt-4 border-t border-purple-400/20">
                  <span className="text-xs font-semibold text-purple-300">✓ 100K+ community</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-gradient-to-br from-pink-500/10 to-pink-600/10 backdrop-blur-sm border border-pink-400/20 rounded-2xl p-8 hover:border-pink-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-pink-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Star size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Build Authority</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Establish yourself as a trusted voice. Build credibility and influence in your niche.
                </p>
                <div className="mt-4 pt-4 border-t border-pink-400/20">
                  <span className="text-xs font-semibold text-pink-300">✓ Author profiles</span>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group relative bg-gradient-to-br from-teal-500/10 to-teal-600/10 backdrop-blur-sm border border-teal-400/20 rounded-2xl p-8 hover:border-teal-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-teal-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Stay Private</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Your content, your rules. Full control over privacy, visibility, and sharing permissions.
                </p>
                <div className="mt-4 pt-4 border-t border-teal-400/20">
                  <span className="text-xs font-semibold text-teal-300">✓ Privacy controls</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrendingBlogs />
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-800 mb-6">
              <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Curated Selection</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Discover Featured Stories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Hand-picked articles that inspire, educate, and entertain. Explore stories worth reading.
            </p>
          </div>

          {/* Blog Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : recentBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentBlogs.map((blog, index) => (
                <article 
                  key={blog._id}
                  className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3"
                >
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full">
                      {blog.category || 'Featured'}
                    </span>
                  </div>

                  {/* Image */}
                  <div className="relative overflow-hidden h-56 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-slate-700 dark:to-slate-600">
                    <img 
                      src={blog.image || '/Assets/beach.png'} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-8 space-y-4 flex flex-col h-full">
                    {/* Date & Reading Time */}
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <Clock size={14} />
                      <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span>{blog.readingTime || '5 min'} read</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                      {blog.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3 flex-grow">
                      {blog.description || 'Discover an insightful story worth reading...'}
                    </p>

                    {/* Author Info & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700 mt-auto">
                      <div className="flex items-center gap-3">
                        {blog.author && (
                          <>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                              {blog.author.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{blog.author.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">Author</p>
                            </div>
                          </>
                        )}
                      </div>
                      <a 
                        href={`/blog/${blog._id}/preview`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
                      >
                        Read
                        <ArrowRight size={16} />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No blog posts available yet.</p>
            </div>
          )}

          {/* View All Button */}
          {recentBlogs.length > 0 && (
            <div className="flex justify-center mt-12">
              <a 
                href="/blog"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all hover:scale-105 transform duration-200 shadow-lg hover:shadow-xl"
              >
                Explore All Stories
                <ArrowRight size={18} />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Share your first story with the Zarrin community today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 text-white font-bold text-2xl shadow-lg">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Create Your Account
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Join our community in seconds. No credit card required. Start writing immediately.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6 text-white font-bold text-2xl shadow-lg">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Write Your First Blog
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Use our intuitive editor with rich formatting. Add images, videos, and more.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-red-600 rounded-full flex items-center justify-center mb-6 text-white font-bold text-2xl shadow-lg">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Publish & Share
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Share with the world and grow your readership. Build your following today.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <a 
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all hover:scale-105 transform duration-200 shadow-lg"
            >
              Start Your Journey Now
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by Our Community
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Hear what writers are saying about their Zarrin experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                "Zarrin helped me find my voice. Now I have thousands of readers. The platform is intuitive and the community is amazing!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Sarah Chen</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">2.3K followers</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                "As a freelancer, having a platform to showcase my expertise has been invaluable. Zarrin makes it so easy!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Marcus Davis</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">1.8K followers</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                "The community support on Zarrin is incredible. Everyone is genuinely interested in helping each other grow."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                  E
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Emily Rodriguez</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">3.1K followers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Get the latest stories and insights delivered to your inbox
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/30 backdrop-blur-sm rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all hover:scale-105 transform duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Home
