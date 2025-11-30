import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter, ArrowRight } from 'lucide-react';
import Heading from '../Component/Common/Heading';
import Paragraph from '../Component/Common/Paragraph';
import Button from '../Component/Common/Button';
import Alert from '../Component/Common/Alert';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [results, setResults] = useState([]);
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

  // Search when params change
  useEffect(() => {
    if (query.trim()) {
      performSearch();
    } else {
      setResults([]);
    }
  }, [query, category, sortBy]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (category !== 'all') params.append('category', category);
      params.append('sortBy', sortBy);

      const res = await fetch(`http://localhost:8200/api/search?${params}`);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.blogs || []);
      
      // Update URL params
      setSearchParams({
        ...(query && { q: query }),
        ...(category !== 'all' && { category }),
        sort: sortBy
      });
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
                  type="text"
                  placeholder="Search blogs, topics, keywords..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                text="Search"
              />
            </div>
          </form>
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

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
              <Paragraph className="mt-4 text-gray-600">Searching blogs...</Paragraph>
            </div>
          </div>
        ) : results.length > 0 ? (
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
