/**
 * DEBUG TASK – Zarrin MERN Blog Project
 *
 * The following issues exist in the project:
 * 1. Latest articles are not showing on the home page
 * 2. Trending blogs (most liked / most commented) return empty data
 * 3. /dashboard/myblogs shows "Invalid user data. Please login again"
 * 4. Profile page does not show correct post count, followers, or following
 * 5. Follow/unfollow API fails with "Failed to update follow status"
 *
 * Please:
 * - Verify frontend API calls (URLs, params, headers, auth token)
 * - Verify backend routes, controllers, and middleware
 * - Check MongoDB queries, population, aggregation, and sorting logic
 * - Ensure authenticated routes correctly read req.user
 * - Ensure models (User, Blog, Follow, Like) match query logic
 * - Fix mismatches between frontend expectations and backend responses
 *
 * Stack: MERN (React, Node, Express, MongoDB, JWT Auth)
 * Project: Zarrin Blog Platform
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Zap, BookOpen, Sparkles, TrendingUp, Users, Award, Quote, CheckCircle, Play, Star } from 'lucide-react'

// Follow Button Component
const FollowButton = ({ writerId, writerName }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');

  const toggleFollow = async (e) => {
    e.stopPropagation(); // Prevent card click
    if (!token) {
      alert('Please login to follow writers');
      return;
    }

    try {
      setIsLoading(true);
      const apiBase = process.env.REACT_APP_API_BASE_URL || 'https://zarrin-blogs-backend.onrender.com';
      const apiUrl = apiBase.includes('/api') ? apiBase : `${apiBase}/api`;
      const url = isFollowing ? `${apiUrl}/users/${writerId}/unfollow` : `${apiUrl}/users/${writerId}/follow`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
      } else {
        console.error('Failed to toggle follow');
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFollow}
      disabled={isLoading}
      className={`w-full px-4 py-2 font-semibold rounded-lg transition-all ${
        isFollowing
          ? 'bg-neutral-200 dark:bg-neutral-700 text-text-primary dark:text-text-primary hover:bg-neutral-300 dark:hover:bg-neutral-600'
          : 'bg-primary hover:bg-primary-dark text-on-primary'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [featuredBlog, setFeaturedBlog] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [topWriters, setTopWriters] = useState([]);

  // Construct API URL properly
  let API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://zarrin-blogs-backend.onrender.com';
  const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

  /**
   * Home Page Debug:
   * Latest articles should be fetched by:
   * - Sorting blogs by createdAt DESC
   * - Limiting results (e.g., 6 or 10)
   * - Excluding drafts and unpublished blogs
   *
   * Verify:
   * - Correct API endpoint is called
   * - Backend query uses sort({ createdAt: -1 })
   * - Frontend correctly maps response data
   * - Data is not filtered out accidentally on frontend
   */
  const fetchAllData = useCallback(async () => {
    try {
      // Fetch blogs - get published blogs sorted by createdAt (most recent first)
      const blogsRes = await fetch(`${API_URL}/blogs?status=published&sort=createdAt&order=desc`);
      if (blogsRes.ok) {
        const data = await blogsRes.json();
        
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
          console.log('✅ Blogs fetched:', blogs.length);
          setFeaturedBlog(blogs[0]);  // First blog as featured
          
          // For trending, sort by likes count
          const trendingBlogs = blogs
            .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
            .slice(0, 3);
          setTrendingBlogs(trendingBlogs);
        }
      }

      // Fetch users to show as writers
      const usersRes = await fetch(`${API_URL}/users`);
      if (usersRes.ok) {
        const users = await usersRes.json();
        if (Array.isArray(users) && users.length > 0) {
          // Top writers by followers/blogs
          const sortedWriters = users
            .filter(u => u.totalBlogs > 0)
            .sort((a, b) => (b.followers?.length || 0) - (a.followers?.length || 0))
            .slice(0, 3)
            .map(user => ({
              _id: user._id,
              name: user.name,
              username: `@${user.name?.toLowerCase().replace(/\s+/g, '')}`,
              followers: `${user.followers?.length || 0}`,
              articles: user.totalBlogs || 0,
              specialty: user.bio || 'Content Creator',
              verified: Math.random() > 0.3, // Random verified badge
              avatar: user.avatar
            }));
          setTopWriters(sortedWriters);
        }
      }
    } catch (err) {
      console.error('❌ Error fetching home data:', err);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Category data for section
  const categories = [
    { name: "Technology", icon: "💻", count: "2.3K articles", bgClass: "bg-primary" },
    { name: "Design", icon: "🎨", count: "1.8K articles", bgClass: "bg-secondary" },
    { name: "Business", icon: "📈", count: "1.5K articles", bgClass: "bg-accent" },
    { name: "Lifestyle", icon: "✨", count: "1.2K articles", bgClass: "bg-success" }
  ];

  // Platform stats
  const platformStats = [
    { icon: BookOpen, value: "50K+", label: "Articles Published", bgClass: "bg-primary", textClass: "text-primary" },
    { icon: Users, value: "1M+", label: "Active Readers", bgClass: "bg-secondary", textClass: "text-secondary" },
    { icon: TrendingUp, value: "10K+", label: "Writers", bgClass: "bg-accent", textClass: "text-accent" },
    { icon: Award, value: "4.9/5", label: "User Rating", bgClass: "bg-success", textClass: "text-success" }
  ];

  // Features
  const features = [
    { icon: Sparkles, title: "AI-Powered Editor", description: "Write better with intelligent suggestions and formatting" },
    { icon: TrendingUp, title: "Advanced Analytics", description: "Track your growth with detailed insights and metrics" },
    { icon: Users, title: "Engaged Community", description: "Connect with readers and writers who share your interests" },
    { icon: Award, title: "Monetization", description: "Earn from your content with our partner program" }
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "BlogSphere has transformed how I share my knowledge. The platform is intuitive, beautiful, and the community is incredibly supportive.",
      author: "Jessica Williams",
      role: "Senior Developer at TechCorp",
      rating: 5
    },
    {
      quote: "I've tried many platforms, but BlogSphere stands out with its clean design and powerful features. It's perfect for professional writers.",
      author: "Michael Brown",
      role: "UX Designer & Author",
      rating: 5
    },
    {
      quote: "The analytics dashboard helps me understand my audience better. I've grown my following by 300% in just 3 months!",
      author: "Emily Parker",
      role: "Content Strategist",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-slate-950">
      {/* Hero Section with Solid Background */}
      <section className="relative overflow-hidden bg-primary pt-20 pb-20">
        {/* Solid Color Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-light/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-on-primary/10 backdrop-blur-md rounded-full border border-on-primary/20 hover:bg-on-primary/20 transition-all w-fit mx-auto lg:mx-0">
                <Sparkles size={16} className="text-on-primary" />
                <span className="text-sm font-semibold text-on-primary">#1 Platform for Modern Writers</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold text-on-primary leading-tight">
                  Share Your{' '}
                  <span className="block mt-2 text-on-primary">
                    Ideas with the World
                  </span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-xl text-on-primary/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Join 50,000+ writers sharing stories, building audiences, and earning from their content on the most beautiful blogging platform.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <a
                  href="/blog/create"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface-primary hover:bg-surface-secondary text-primary font-bold rounded-lg transition-all hover:shadow-2xl hover:shadow-primary/25 group"
                >
                  Start Writing Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-on-primary hover:bg-on-primary/10 text-on-primary font-bold rounded-lg transition-all backdrop-blur-sm group"
                >
                  <Play className="w-5 h-5" />
                  Explore Articles
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm pt-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-on-primary/90">Free forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-on-primary/90">No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-on-primary/90">Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Right Content - Featured Article Card */}
            {featuredBlog && (
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl"></div>
                <div className="relative group overflow-hidden border-0 shadow-2xl rounded-3xl cursor-pointer bg-surface-primary dark:bg-surface-dark hover:shadow-3xl transition-all interactive-card">
                  {/* Image */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={featuredBlog.images && featuredBlog.images[0] ? featuredBlog.images[0] : (featuredBlog.image || '/Assets/beach.png')}
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>

                    {/* Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-on-primary text-xs font-bold rounded-full">
                      {featuredBlog.category?.[0]?.name || 'Featured'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-text-primary dark:text-text-inverse line-clamp-2">
                      {featuredBlog.title}
                    </h3>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-text-secondary dark:text-text-secondary">
                      <span>{new Date(featuredBlog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span>{featuredBlog.readingTime || '5'} min read</span>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-2 border-t border-border-light dark:border-border-dark">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-on-primary font-bold text-sm">
                        {featuredBlog.author?.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary dark:text-text-inverse text-sm">{featuredBlog.author?.name || 'Author'}</p>
                        <p className="text-xs text-text-secondary">Featured Article</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-16 border-y border-border-light dark:border-border-dark bg-surface-primary/50 dark:bg-surface-dark/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {platformStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${stat.bgClass} mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-on-primary" />
                  </div>
                  <div className={`text-4xl font-bold ${stat.textClass} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-text-secondary dark:text-text-secondary">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Articles */}
      <section className="py-20 bg-surface-primary dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-bold text-text-primary dark:text-text-inverse">Trending Now</h2>
              </div>
              <p className="text-lg text-text-secondary dark:text-text-secondary">Most popular articles this week</p>
            </div>
            <a href="/blog" className="hidden md:flex gap-2 items-center px-6 py-3 border border-border-light dark:border-border-dark hover:bg-surface-primary dark:hover:bg-surface-dark rounded-lg transition-all text-text-primary dark:text-text-inverse font-semibold">
              View All
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {trendingBlogs.length > 0 ? (
              trendingBlogs.map((blog, index) => {
                const colors = [
                  "from-primary to-primary-dark",
                  "from-secondary to-secondary-dark",
                  "from-accent to-primary"
                ];
                return (
                  <a key={blog._id} href={`/blog/${blog._id}/preview`} className={`group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all interactive-card cursor-pointer rounded-2xl bg-surface-primary dark:bg-surface-dark`}>
                    <div className={`h-1 bg-${colors[index % 3]}`}></div>
                    
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.images && blog.images[0] ? blog.images[0] : (blog.image || '/Assets/beach.png')}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/60"></div>
                      <div className={`absolute top-4 left-4 px-3 py-1 bg-${colors[index % 3]} text-on-primary text-xs font-bold rounded-full`}>
                        {blog.category?.[0]?.name || 'Featured'}
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors text-text-primary dark:text-text-inverse">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-text-secondary dark:text-text-secondary line-clamp-2">
                        {blog.description || 'Discover an insightful story...'}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-border-light dark:border-border-dark">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-on-primary text-xs font-bold">
                            {blog.author?.name?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-primary dark:text-text-inverse">{blog.author?.name || 'Author'}</p>
                            <p className="text-xs text-text-secondary">{blog.readingTime || '5'} min</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-text-secondary dark:text-text-secondary">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <span>Trending</span>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })
            ) : (
              <div className="col-span-3 p-12 text-center text-text-secondary">
                No trending articles yet
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-surface-light dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-primary dark:text-text-inverse mb-4">Explore by Category</h2>
            <p className="text-lg text-text-secondary dark:text-text-secondary max-w-2xl mx-auto">
              Discover amazing content across different topics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <a key={category.name} href="/blog" className={`group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all interactive-card cursor-pointer rounded-2xl relative h-40`}>
                <div className="relative h-full overflow-hidden">
                  <div className={`absolute inset-0 ${category.bgClass} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <div className="text-5xl mb-3">{category.icon}</div>
                    <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm text-white/90">{category.count}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface-primary dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary dark:text-text-inverse mb-4">
              Everything You Need to{' '}
              <span className="block mt-2 text-primary">
                Succeed as a Writer
              </span>
            </h2>
            <p className="text-lg text-text-secondary dark:text-text-secondary max-w-2xl mx-auto">
              Professional tools and features designed to help you create, grow, and monetize your content
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = [
                "bg-primary",
                "bg-secondary",
                "bg-accent",
                "bg-warning"
              ];
              return (
                <div key={index} className="border-0 shadow-lg hover:shadow-xl transition-all interactive-card p-6 rounded-2xl bg-surface-primary dark:bg-surface-dark group">
                  <div className={`w-14 h-14 rounded-2xl ${colorClasses[index]} flex items-center justify-center text-on-primary mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-text-primary dark:text-text-inverse">{feature.title}</h3>
                  <p className="text-text-secondary dark:text-text-secondary">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Writers */}
      <section className="py-20 bg-surface-light dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-8 h-8 text-primary" />
                <h2 className="text-4xl font-bold text-text-primary dark:text-text-inverse">Featured Writers</h2>
              </div>
              <p className="text-lg text-text-secondary dark:text-text-secondary">Join our community of talented creators</p>
            </div>
            <a href="/following" className="hidden md:flex gap-2 items-center px-6 py-3 border border-border-light dark:border-border-dark hover:bg-surface-primary dark:hover:bg-surface-dark rounded-lg transition-all text-text-primary dark:text-text-inverse font-semibold">
              View All Writers
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {topWriters.length > 0 ? (
              topWriters.map((writer, index) => (
                <div key={writer._id} className="border-0 shadow-lg hover:shadow-xl transition-all interactive-card overflow-hidden rounded-2xl bg-surface-primary dark:bg-surface-dark cursor-pointer group" onClick={() => navigate(`/profile/${writer._id}`)}>
                  <div className="h-24 bg-primary"></div>
                  <div className="p-6 -mt-12 relative">
                    <div className="relative inline-block mb-4">
                      <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-on-primary text-2xl font-bold border-4 border-surface-primary dark:border-surface-dark shadow-xl">
                        {writer.avatar ? (
                          <img src={writer.avatar} alt={writer.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          writer.name?.charAt(0)
                        )}
                      </div>
                      {writer.verified && (
                        <div className="absolute bottom-0 right-0 w-7 h-7 bg-info rounded-full flex items-center justify-center border-4 border-surface-primary dark:border-surface-dark">
                          <CheckCircle className="w-4 h-4 text-on-info fill-on-info" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-1 text-text-primary dark:text-text-inverse">{writer.name}</h3>
                    <p className="text-sm text-text-secondary dark:text-text-secondary mb-3">{writer.username}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-on-primary text-xs font-semibold rounded-full mb-4">
                      {writer.specialty}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                      <div className="bg-surface-light dark:bg-surface-secondary rounded-lg p-3">
                        <p className="text-xl font-bold text-text-primary dark:text-text-inverse">{writer.followers}</p>
                        <p className="text-xs text-text-secondary dark:text-text-secondary">Followers</p>
                      </div>
                      <div className="bg-surface-light dark:bg-surface-secondary rounded-lg p-3">
                        <p className="text-xl font-bold text-text-primary dark:text-text-inverse">{writer.articles}</p>
                        <p className="text-xs text-text-secondary dark:text-text-secondary">Articles</p>
                      </div>
                    </div>

                    <FollowButton writerId={writer._id} writerName={writer.name} />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 p-12 text-center text-text-secondary">
                No writers found yet
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-20 bg-surface-light dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm text-primary font-semibold">Loved by Writers</span>
            </div>
            <h2 className="text-4xl font-bold text-text-primary dark:text-text-inverse mb-4">What Our Community Says</h2>
            <p className="text-lg text-text-secondary dark:text-text-secondary max-w-2xl mx-auto">
              Join thousands of happy writers who've found their home on Zarrin
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="border-0 shadow-lg hover:shadow-xl transition-all p-6 rounded-2xl bg-surface-primary dark:bg-surface-dark">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-warning fill-warning" />
                  ))}
                </div>

                <Quote className="w-10 h-10 text-primary/20 mb-4" />

                <p className="text-text-primary dark:text-text-inverse mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-on-primary font-bold">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary dark:text-text-inverse">{testimonial.author}</p>
                    <p className="text-sm text-text-secondary dark:text-text-secondary">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Solid Background */}
      <section className="py-20 relative overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-on-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-on-primary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-on-primary/10 rounded-full border border-on-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-on-primary" />
            <span className="text-sm font-semibold text-on-primary">Start Your Journey Today</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-on-primary mb-6">
            Ready to Share{' '}
            <span className="block mt-2">Your Story?</span>
          </h2>

          <p className="text-xl text-on-primary/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join our community of passionate writers and start building your audience today.{' '}
            It's free, easy, and takes less than a minute.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/blog/create"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface-primary hover:bg-surface-secondary text-primary font-bold rounded-lg transition-all hover:shadow-2xl hover:shadow-on-primary/25 group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/blog"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-on-primary hover:bg-on-primary/10 text-on-primary font-bold rounded-lg transition-all"
            >
              Explore Articles
            </a>
          </div>

          <p className="text-sm text-on-primary/80 mt-6">
            No credit card required • Free forever • 50,000+ active writers
          </p>
        </div>
      </section>

      <style>{`
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
