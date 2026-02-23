import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter, Users } from 'lucide-react';
import Heading from '../Component/Common/Heading';
import Paragraph from '../Component/Common/Paragraph';
import Alert from '../Component/Common/Alert';
import { getApiUrl } from '../utils/apiConfig';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchType, setSearchType] = useState(searchParams.get('type') || 'blogs');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [results, setResults] = useState([]);
  const [userResults, setUserResults] = useState([]);
  const [liveUserSuggestions, setLiveUserSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [alert, setAlert] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(getApiUrl('/api/categories'), {
          credentials: 'include' // CRITICAL: include cookies for production CORS
        });
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Handle input change - show live suggestions if searching users
  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (searchType === 'users' && value.trim().length > 0) {
      // Fetch live user suggestions
      fetchLiveUserSuggestions(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setLiveUserSuggestions([]);
    }
  };

  // Fetch live user suggestions
  const fetchLiveUserSuggestions = async (searchQuery) => {
    try {
      // Try to use the API search endpoint first
      const res = await fetch(getApiUrl(`/api/users/search?query=${encodeURIComponent(searchQuery)}`), {
        credentials: 'include' // CRITICAL: include cookies for production CORS
      });
      if (res.ok) {
        const users = await res.json();
        setLiveUserSuggestions(Array.isArray(users) ? users : []);
      } else {
        // Fallback: fetch all users if search endpoint fails
        const allUsersRes = await fetch(getApiUrl('/api/users'), {
          credentials: 'include' // CRITICAL: include cookies for production CORS
        });
        if (allUsersRes.ok) {
          const allUsers = await allUsersRes.json();
          const filtered = allUsers
            .filter(user => user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .slice(0, 5);
          setLiveUserSuggestions(filtered);
        }
      }
    } catch (err) {
      console.error('Error fetching user suggestions:', err);
      // Final fallback: try to fetch all users
      try {
        const allUsersRes = await fetch(getApiUrl('/api/users'), {
          credentials: 'include' // CRITICAL: include cookies for production CORS
        });
        if (allUsersRes.ok) {
          const allUsers = await allUsersRes.json();
          const filtered = allUsers
            .filter(user => user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .slice(0, 5);
          setLiveUserSuggestions(filtered);
        }
      } catch (fallbackErr) {
        console.error('Error in fallback:', fallbackErr);
      }
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (user) => {
    navigate(`/profile/${user._id}`);
    setShowSuggestions(false);
    setQuery('');
  };

  // Search when params change
  const performSearch = useCallback(async () => {
    setLoading(true);
    try {
      if (searchType === 'users') {
        // Search users by name ONLY (not by email)
        const res = await fetch(getApiUrl(`/api/users/search?query=${encodeURIComponent(query)}`), {
          credentials: 'include' // CRITICAL: include cookies for production CORS
        });
        if (res.ok) {
          const data = await res.json();
          setUserResults(Array.isArray(data) ? data : []);
        } else {
          // Fallback: fetch all users and filter by name ONLY
          const allUsersRes = await fetch(getApiUrl('/api/users'), {
            credentials: 'include' // CRITICAL: include cookies for production CORS
          });
          if (allUsersRes.ok) {
            const allUsers = await allUsersRes.json();
            // Filter ONLY by name, NOT by email
            const filtered = allUsers.filter(user => 
              user.name && user.name.toLowerCase().includes(query.toLowerCase())
            );
            setUserResults(filtered);
          }
        }
        setResults([]);
      } else {
        // Search blogs
        const params = new URLSearchParams();
        if (query) params.append('query', query);
        if (category !== 'all') params.append('category', category);
        params.append('sortBy', sortBy);

        const res = await fetch(getApiUrl(`/api/search?${params}`), {
          credentials: 'include' // CRITICAL: include cookies for production CORS
        });
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data.blogs || []);
        setUserResults([]);
        
        // Update URL params
        setSearchParams({
          ...(query && { q: query }),
          type: searchType,
          ...(category !== 'all' && { category }),
          sort: sortBy
        });
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Search failed: ' + err.message });
    } finally {
      setLoading(false);
    }
  }, [query, searchType, category, sortBy, setSearchParams]);

  useEffect(() => {
    if (query.trim()) {
      performSearch();
    } else {
      setResults([]);
      setUserResults([]);
    }
  }, [query, searchType, category, sortBy, performSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch();
    }
  };

  return (
    <div className="min-h-screen bg-surface-primary dark:bg-surface-dark">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-primary dark:bg-primary-dark text-white py-20 sm:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
              <SearchIcon size={14} className="text-primary-light" />
              <span className="text-xs font-semibold">Discover Content</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Find Your Next <span className="text-primary font-bold">Great Read</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Search through thousands of amazing blogs and discover talented creators
            </p>
          </div>

          {/* Search Type Toggle */}
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => setSearchType('blogs')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                searchType === 'blogs'
                  ? 'bg-surface-primary text-text-primary shadow-2xl'
                  : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              Blogs
            </button>
            <button
              onClick={() => setSearchType('users')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2 ${
                searchType === 'users'
                  ? 'bg-surface-primary text-text-primary shadow-2xl'
                  : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              <Users size={18} />
              Users
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                  <SearchIcon className="absolute left-4 top-4 text-text-muted pointer-events-none" size={20} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchType === 'users' ? 'Search creators by name...' : 'Search blogs, topics, keywords...'}
                  value={query}
                  onChange={handleQueryChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-surface-primary/95 dark:bg-surface-dark/95 text-text-primary placeholder-text-muted shadow-2xl backdrop-blur-sm"
                />
                
                {/* Live User Suggestions Dropdown */}
                {showSuggestions && searchType === 'users' && liveUserSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-surface-primary dark:bg-surface-dark rounded-xl shadow-2xl border border-border-default z-50 max-h-96 overflow-y-auto backdrop-blur-sm">
                    {liveUserSuggestions.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => handleSuggestionClick(user)}
                        className="flex items-center gap-3 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer border-b border-border-default last:border-b-0 transition-colors group"
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                              <Users size={20} className="text-white" />
                            </div>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <Heading type="h4" className="text-sm font-bold text-text-primary truncate group-hover:text-primary">
                            {user.name}
                          </Heading>
                          {user.bio && (
                            <Paragraph className="text-xs text-text-muted truncate">
                              {user.bio}
                            </Paragraph>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex-shrink-0 text-right space-y-1">
                          <Paragraph className="text-xs font-bold text-primary">
                            {user.totalBlogs || 0}
                          </Paragraph>
                          <Paragraph className="text-xs text-text-muted">
                            posts
                          </Paragraph>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-on-primary font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {alert && (
          <div className="mb-8">
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
              duration={5000}
            />
          </div>
        )}

        {/* Filters for Blogs */}
        {searchType === 'blogs' && (
          <div className="bg-surface-primary dark:bg-surface-dark rounded-2xl shadow-lg p-8 mb-12 border border-border-default">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <Filter size={20} className="text-primary" />
              </div>
              <Heading type="h3" className="text-xl font-bold text-text-primary">
                Refine Your Search
              </Heading>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-3 uppercase tracking-wide">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-primary dark:bg-surface-dark text-text-primary font-semibold"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-3 uppercase tracking-wide">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-primary dark:bg-surface-dark text-text-primary font-semibold"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="trending">Trending</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-border-default border-t-primary mb-4"></div>
            <Paragraph className="text-text-secondary text-lg">
              Searching {searchType === 'users' ? 'creators' : 'blogs'}...
            </Paragraph>
          </div>
        ) : searchType === 'users' ? (
          // User Results
          userResults.length > 0 ? (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Paragraph className="text-sm font-bold text-blue-700 dark:text-blue-400">
                    {userResults.length} creator{userResults.length !== 1 ? 's' : ''} found
                  </Paragraph>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userResults.map((user) => (
                  <div
                    key={user._id}
                    className="group bg-surface-primary dark:bg-surface-dark rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-border-default transform hover:scale-105 hover:-translate-y-2"
                  >
                    {/* Avatar Section with Gradient Background */}
                    <div className="relative h-40 bg-accent dark:bg-accent-dark overflow-hidden flex items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40">
                          <Users size={56} className="text-white" />
                        </div>
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6 text-center space-y-4">
                      <div>
                        <Heading type="h3" className="text-2xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                          {user.name}
                        </Heading>
                        {user.bio && (
                          <Paragraph className="text-text-secondary text-sm line-clamp-2 italic">
                            "{user.bio}"
                          </Paragraph>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex gap-4 justify-center py-4 border-y border-border-default">
                        <div>
                          <p className="text-2xl font-bold text-primary">
                            {user.totalBlogs || 0}
                          </p>
                          <Paragraph className="text-xs text-text-muted font-semibold">Articles</Paragraph>
                        </div>
                        <div className="border-l border-border-default"></div>
                        <div>
                          <p className="text-2xl font-bold text-secondary">
                            {user.followers?.length || 0}
                          </p>
                          <Paragraph className="text-xs text-text-muted font-semibold">Followers</Paragraph>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => navigate(`/profile/${user._id}`)}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-on-primary rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                      >
                        <Users size={16} />
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : query ? (
          <div className="bg-surface-secondary dark:bg-surface-dark rounded-2xl border-2 border-dashed border-border-default p-16 text-center">
            <Users size={64} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-6" />
            <Heading type="h3" className="text-2xl font-bold text-text-primary mb-3">
              No creators found
            </Heading>
            <Paragraph className="text-text-secondary text-lg">
                Try searching with different keywords
              </Paragraph>
            </div>
          ) : (
            <div className="bg-surface-secondary dark:bg-surface-dark rounded-2xl border-2 border-dashed border-border-default p-16 text-center">
              <Users size={64} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-6" />
              <Heading type="h3" className="text-2xl font-bold text-text-primary mb-3">
                Start discovering creators
              </Heading>
              <Paragraph className="text-text-secondary text-lg">
                Search for creators by their name to follow amazing work
              </Paragraph>
            </div>
          )
        ) : results.length > 0 ? (
          // Blog Results
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-full">
                <Paragraph className="text-sm font-bold text-primary">
                  {results.length} blog{results.length !== 1 ? 's' : ''} found
                </Paragraph>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((blog) => (
                <div
                  key={blog._id}
                  className="group bg-surface-primary dark:bg-surface-dark rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-border-default transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
                  onClick={() => navigate(`/blog/${blog._id}/preview`)}
                >
                  {/* Image */}
                  {blog.images && blog.images[0] && (
                    <div className="h-52 overflow-hidden bg-neutral-200 dark:bg-neutral-700 relative">
                      <img
                        src={blog.images[0]}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Category Badge */}
                    {blog.category && blog.category[0] && (
                      <span className="inline-block px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary text-xs font-bold rounded-lg">
                        {blog.category[0].name || 'Story'}
                      </span>
                    )}

                    {/* Title */}
                    <Heading type="h4" className="text-lg font-bold text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </Heading>

                    {/* Description */}
                    <Paragraph className="text-text-secondary text-sm line-clamp-2 leading-relaxed">
                      {blog.short_description}
                    </Paragraph>

                    {/* Meta Info */}
                    <div className="pt-4 border-t border-border-default">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary font-semibold">
                          {blog.author?.name || 'Anonymous'}
                        </span>
                        <span className="text-text-muted">
                          {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="bg-surface-secondary dark:bg-surface-dark rounded-2xl border-2 border-dashed border-border-default p-16 text-center">
            <SearchIcon size={64} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-6" />
            <Heading type="h3" className="text-2xl font-bold text-text-primary mb-3">
              No blogs found
            </Heading>
            <Paragraph className="text-text-secondary text-lg">
              Try adjusting your filters or searching different keywords
            </Paragraph>
          </div>
        ) : (
          <div className="bg-surface-secondary dark:bg-surface-dark rounded-2xl border-2 border-dashed border-border-default p-16 text-center">
            <SearchIcon size={64} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-6" />
            <Heading type="h3" className="text-2xl font-bold text-text-primary mb-3">
              Start your discovery
            </Heading>
            <Paragraph className="text-text-secondary text-lg">
              Use the search bar above to find amazing blogs and creators
            </Paragraph>
          </div>
        )}
      </div>

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
      `}</style>
    </div>
  );
};

export default Search;
