import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, Eye, Heart, TrendingUp, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Heading from '../Component/Common/Heading';
import Paragraph from '../Component/Common/Paragraph';
import Alert from '../Component/Common/Alert';

const AdminDashboard = ({ isAuthenticated, currentUser }) => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  // API_URL is constant and doesn't change - safe to use in callbacks
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const API_URL = process.env.REACT_APP_API_BASE_URL ? `${process.env.REACT_APP_API_BASE_URL}/api` : 'https://zarrin-blogs-backend.onrender.com/api';

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const dashRes = await fetch(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!dashRes.ok) throw new Error('Unauthorized');
      const dashData = await dashRes.json();
      setDashboard(dashData);

      // Fetch analytics
      const analyticsRes = await fetch(`${API_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData);

      // Fetch users
      const usersRes = await fetch(`${API_URL}/admin/users?page=1&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersData = await usersRes.json();
      setUsers(usersData.users);

      // Fetch blogs
      const blogsRes = await fetch(`${API_URL}/admin/blogs?page=1&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const blogsData = await blogsRes.json();
      setBlogs(blogsData.blogs);
    } catch (err) {
      console.error('Error:', err);
      setAlert({ type: 'error', message: 'Failed to load dashboard' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated || userData.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchDashboard();
  }, [isAuthenticated, userData.role, navigate, fetchDashboard]);

  const handleDeleteUser = async (userId) => {
    setAlert({
      type: 'warning',
      message: 'Delete this user? All their blogs will also be deleted. This cannot be undone.',
      isConfirmation: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!res.ok) throw new Error('Failed to delete user');
          setAlert({ type: 'success', message: 'User deleted successfully!' });
          fetchDashboard();
        } catch (err) {
          setAlert({ type: 'error', message: err.message });
        }
      }
    });
  };

  const handleDeleteBlog = async (blogId) => {
    setAlert({
      type: 'warning',
      message: 'Delete this blog? This action cannot be undone.',
      isConfirmation: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_URL}/admin/blogs/${blogId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!res.ok) throw new Error('Failed to delete blog');
          setAlert({ type: 'success', message: 'Blog deleted successfully!' });
          fetchDashboard();
        } catch (err) {
          setAlert({ type: 'error', message: err.message });
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-cyan-50 to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Paragraph className="text-gray-600">Loading Admin Dashboard...</Paragraph>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-teal-50">
        <Alert message="Failed to load dashboard" type="error" />
      </div>
    );
  }

  const COLORS = ['#06B6D4', '#14B8A6', '#0891B2', '#0E7490', '#06B6D4'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 dark:from-cyan-700 dark:via-teal-700 dark:to-cyan-800 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('/')} className="hover:bg-white/20 p-2 rounded">
              <ArrowLeft size={28} />
            </button>
            <TrendingUp size={32} />
            <Heading type="h1" className="text-3xl md:text-4xl">
              Admin Dashboard
            </Heading>
          </div>
          <Paragraph className="text-blue-100 text-lg">
            Manage your blog platform and track analytics
          </Paragraph>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
            duration={alert.isConfirmation ? 0 : 5000}
            isConfirmation={alert.isConfirmation}
            onConfirm={alert.onConfirm}
            onCancel={() => setAlert(null)}
          />
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex gap-2 border-b">
          {['overview', 'users', 'blogs', 'analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold capitalize transition ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {dashboard.stats.totalUsers}
                    </p>
                  </div>
                  <Users size={40} className="text-blue-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Blogs</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {dashboard.stats.totalBlogs}
                    </p>
                  </div>
                  <FileText size={40} className="text-green-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Views</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {(dashboard.stats.totalViews || 0).toLocaleString()}
                    </p>
                  </div>
                  <Eye size={40} className="text-cyan-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Likes</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {(dashboard.stats.totalLikes || 0).toLocaleString()}
                    </p>
                  </div>
                  <Heart size={40} className="text-red-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">New Users (7d)</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {dashboard.stats.newUsersThisWeek}
                    </p>
                  </div>
                  <TrendingUp size={40} className="text-orange-500" />
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Top Blogs */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Top Blogs by Views</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboard.topBlogs || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" width={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Blog Status */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Blog Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboard.blogsByStatus || []}
                      dataKey="count"
                      nameKey="_id"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Authors */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 dark:text-white">Top Authors</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b dark:border-gray-700">
                    <tr>
                      <th className="text-left p-3 dark:text-gray-300">Author</th>
                      <th className="text-left p-3 dark:text-gray-300">Email</th>
                      <th className="text-center p-3 dark:text-gray-300">Blogs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.topAuthors?.map(author => (
                      <tr key={author._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700">
                        <td className="p-3 dark:text-gray-300">{author.author?.name}</td>
                        <td className="p-3 dark:text-gray-300">{author.author?.email}</td>
                        <td className="text-center p-3 font-semibold dark:text-gray-300">{author.blogCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Manage Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b dark:border-gray-700">
                  <tr>
                    <th className="text-left p-3 dark:text-gray-300">Name</th>
                    <th className="text-left p-3 dark:text-gray-300">Email</th>
                    <th className="text-center p-3 dark:text-gray-300">Role</th>
                    <th className="text-center p-3 dark:text-gray-300">Blogs</th>
                    <th className="text-center p-3 dark:text-gray-300">Followers</th>
                    <th className="text-center p-3 dark:text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700">
                      <td className="p-3 dark:text-gray-300">{user.name}</td>
                      <td className="p-3 dark:text-gray-300">{user.email}</td>
                      <td className="text-center p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="text-center p-3 dark:text-gray-300">{user.blogs}</td>
                      <td className="text-center p-3 dark:text-gray-300">{user.followers}</td>
                      <td className="text-center p-3">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Manage Blogs</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b dark:border-gray-700">
                  <tr>
                    <th className="text-left p-3 dark:text-gray-300">Title</th>
                    <th className="text-left p-3 dark:text-gray-300">Author</th>
                    <th className="text-center p-3 dark:text-gray-300">Status</th>
                    <th className="text-center p-3 dark:text-gray-300">Views</th>
                    <th className="text-center p-3 dark:text-gray-300">Created</th>
                    <th className="text-center p-3 dark:text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map(blog => (
                    <tr key={blog._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700">
                      <td className="p-3 dark:text-gray-300 truncate">{blog.title}</td>
                      <td className="p-3 dark:text-gray-300">{blog.author?.name}</td>
                      <td className="text-center p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          blog.status === 'published' ? 'bg-green-100 text-green-800' :
                          blog.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="text-center p-3 dark:text-gray-300">{blog.views || 0}</td>
                      <td className="text-center p-3 dark:text-gray-300">{new Date(blog.createdAt).toLocaleDateString()}</td>
                      <td className="text-center p-3">
                        <button
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Blog Trend */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Blog Creation Trend (7 days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.blogTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* User Trend */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 dark:text-white">User Growth (7 days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.userTrend || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-8">
              <h3 className="text-xl font-bold mb-4 dark:text-white">Top Categories</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b dark:border-gray-700">
                    <tr>
                      <th className="text-left p-3 dark:text-gray-300">Category</th>
                      <th className="text-center p-3 dark:text-gray-300">Blogs</th>
                      <th className="text-center p-3 dark:text-gray-300">Total Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topCategories?.map(cat => (
                      <tr key={cat._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700">
                        <td className="p-3 dark:text-gray-300">{cat.category?.[0]?.name}</td>
                        <td className="text-center p-3 dark:text-gray-300">{cat.blogCount}</td>
                        <td className="text-center p-3 dark:text-gray-300">{cat.totalViews}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
