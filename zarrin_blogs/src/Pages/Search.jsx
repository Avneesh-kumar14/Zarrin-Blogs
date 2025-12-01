import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter, ArrowRight, Users, X } from 'lucide-react';
import Heading from '../Component/Common/Heading';
import Paragraph from '../Component/Common/Paragraph';
import Button from '../Component/Common/Button';
import Alert from '../Component/Common/Alert';

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
        const res = await fetch('http://localhost:8200/api/categories');
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
      const res = await fetch(`http://localhost:8200/api/users/search?query=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const users = await res.json();
        setLiveUserSuggestions(Array.isArray(users) ? users : []);
      } else {
        // Fallback: fetch all users if search endpoint fails
        const allUsersRes = await fetch('http://localhost:8200/api/users');
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
        const allUsersRes = await fetch('http://localhost:8200/api/users');
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
  useEffect(() => {
    if (query.trim()) {
      performSearch();
    } else {
      setResults([]);
      setUserResults([]);
    }
  }, [query, searchType, category, sortBy]);

  const performSearch = async () => {
    setLoading(true);
    try {
      if (searchType === 'users') {
        // Search users by name ONLY (not by email)
        const res = await fetch(`http://localhost:8200/api/users/search?query=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setUserResults(Array.isArray(data) ? data : []);
        } else {
          // Fallback: fetch all users and filter by name ONLY
          const allUsersRes = await fetch('http://localhost:8200/api/users');
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

        const res = await fetch(`http://localhost:8200/api/search?${params}`);
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
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Heading type="h1" className="text-4xl md:text-5xl font-bold mb-4">
              Search Blogs
            </Heading>
            <Paragraph className="text-blue-50 text-lg">
              Find the perfect blog post you're looking for
            </Paragraph>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchType === 'users' ? 'Search users by name...' : 'Search blogs, topics, keywords...'}
                  value={query}
                  onChange={handleQueryChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
                />
                
                {/* Live User Suggestions Dropdown */}
                {showSuggestions && searchType === 'users' && liveUserSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                    {liveUserSuggestions.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => handleSuggestionClick(user)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                              <Users size={24} className="text-white" />
                            </div>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <Heading type="h4" className="text-sm font-semibold text-gray-900 truncate">
                            {user.name}
                          </Heading>
                          {user.bio && (
                            <Paragraph className="text-xs text-gray-500 truncate">
                              {user.bio}
                            </Paragraph>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex-shrink-0 text-right">
                          <Paragraph className="text-xs font-semibold text-gray-600">
                            {user.totalBlogs || 0} posts
                          </Paragraph>
                          <Paragraph className="text-xs text-gray-500">
                            {user.followers?.length || 0} followers
                          </Paragraph>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button
                type="submit"
                variant="primary"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                text="Search"
              />
            </div>
          </form>

          {/* Search Type Toggle */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setSearchType('blogs')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                searchType === 'blogs'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-blue-500/30 text-white hover:bg-blue-500/50'
              }`}
            >
              Search Blogs
            </button>
            <button
              onClick={() => setSearchType('users')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                searchType === 'users'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-blue-500/30 text-white hover:bg-blue-500/50'
              }`}
            >
              <Users size={18} />
              Search Users
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {alert && (
          <div className="mb-6">
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
              duration={5000}
            />
          </div>
        )}

        {/* Filters */}
        {searchType === 'blogs' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-blue-600" />
            <Heading type="h3" className="text-lg font-semibold">
              Filters
            </Heading>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
              <Paragraph className="mt-4 text-gray-600">
                Searching {searchType === 'users' ? 'users' : 'blogs'}...
              </Paragraph>
            </div>
          </div>
        ) : searchType === 'users' ? (
          // User Results
          userResults.length > 0 ? (
            <div>
              <Paragraph className="text-gray-600 mb-6 font-semibold">
                Found {userResults.length} user{userResults.length !== 1 ? 's' : ''}
              </Paragraph>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userResults.map((user) => (
                  <div
                    key={user._id}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300 transform hover:scale-105"
                  >
                    {/* Avatar Section */}
                    <div className="h-32 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 relative flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center">
                          <Users size={48} className="text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="text-center mb-2">
                        <Paragraph className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
                          Username
                        </Paragraph>
                        <Heading type="h3" className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {user.name}
                        </Heading>
                      </div>

                      {/* Bio */}
                      {user.bio && (
                        <Paragraph className="text-gray-600 text-sm text-center mb-4 line-clamp-2 italic">
                          "{user.bio}"
                        </Paragraph>
                      )}

                      {/* Stats */}
                      <div className="flex gap-4 mb-6 justify-center py-4 border-y border-gray-200">
                        <div className="text-center">
                          <Heading type="h4" className="text-lg font-bold text-blue-600">
                            {user.totalBlogs || 0}
                          </Heading>
                          <Paragraph className="text-gray-500 text-xs font-semibold">Articles</Paragraph>
                        </div>
                        <div className="border-l border-gray-300"></div>
                        <div className="text-center">
                          <Heading type="h4" className="text-lg font-bold text-purple-600">
                            {user.followers?.length || 0}
                          </Heading>
                          <Paragraph className="text-gray-500 text-xs font-semibold">Followers</Paragraph>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => navigate(`/profile/${user._id}`)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold text-sm shadow-md transform hover:scale-105 transition-all"
                      >
                        <ArrowRight size={16} />
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : query ? (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <Heading type="h3" className="text-xl font-semibold text-gray-700 mb-2">
                No users found
              </Heading>
              <Paragraph className="text-gray-600">
                Try searching for different names
              </Paragraph>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <Heading type="h3" className="text-xl font-semibold text-gray-700 mb-2">
                Start searching for users
              </Heading>
              <Paragraph className="text-gray-600">
                Enter a user name to discover creators
              </Paragraph>
            </div>
          )
        ) : results.length > 0 ? (
          // Blog Results
          <div>
            <Paragraph className="text-gray-600 mb-6 font-semibold">
              Found {results.length} blog{results.length !== 1 ? 's' : ''}
            </Paragraph>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => navigate(`/blog/${blog._id}/preview`)}
                >
                  {/* Image */}
                  {blog.images && blog.images[0] && (
                    <div className="h-48 overflow-hidden bg-gray-200">
                      <img
                        src={blog.images[0]}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
                    {/* Category Badge */}
                    {blog.category && blog.category[0] && (
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-3">
                        {blog.category[0].name || 'Uncategorized'}
                      </span>
                    )}

                    {/* Title */}
                    <Heading type="h4" className="text-lg font-bold mb-2 line-clamp-2">
                      {blog.title}
                    </Heading>

                    {/* Description */}
                    <Paragraph className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {blog.short_description}
                    </Paragraph>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-t border-gray-100">
                      <span>{blog.author?.name || 'Anonymous'}</span>
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Read More */}
                    <Button
                      variant="primary"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:shadow-md transition-all"
                      text="Read More"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <SearchIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <Heading type="h3" className="text-xl font-semibold text-gray-700 mb-2">
              No blogs found
            </Heading>
            <Paragraph className="text-gray-600">
              Try different keywords or adjust your filters
            </Paragraph>
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <Heading type="h3" className="text-xl font-semibold text-gray-700 mb-2">
              Start searching
            </Heading>
            <Paragraph className="text-gray-600">
              Enter keywords to find blogs
            </Paragraph>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
