import React, { useEffect, useState } from "react";
import { Edit, Grid, User } from "lucide-react"; 
import Headings from "../Common/Heading";
import Paragraph from "../Common/Paragraph";
import Button from "../Common/Button";
import { useNavigate, useLocation } from 'react-router-dom';
import CategoryManagement from './CategoryManagement';
import BlogManagement from './BlogManagement';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname.split('/').pop());
  const [stats, setStats] = useState({
    blogs: 0,
    categories: 0,
    users: 0
  });

  // Check authentication on mount and path change
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        console.log('No auth data found, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return false;
      }
      
      try {
        // Verify user data is valid JSON
        JSON.parse(user);
        return true;
      } catch (e) {
        console.error('Invalid user data in localStorage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return false;
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  // Update currentPath when location changes
  useEffect(() => {
    setCurrentPath(location.pathname.split('/').pop() || 'analytics');
  }, [location.pathname]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get both token and user data
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          console.error('Missing auth data, redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        // Verify user data is valid JSON
        try {
          JSON.parse(userData);
        } catch (e) {
          console.error('Invalid user data in localStorage');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        console.log('Fetching stats with token:', token.substring(0, 20) + '...');
        const res = await fetch("/api/stats", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        // Handle different response statuses
        if (res.status === 401 || res.status === 403) {
          const errorData = await res.json();
          console.error('Auth error:', errorData);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch stats');
        }

        const data = await res.json();
        console.log('Stats data received:', data);
        
        if (data && data.stats) {
          setStats(data.stats);
        } else {
          console.error('Invalid data format received:', data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        if (error.message.includes('Token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
    };

    // Fetch initially
    fetchStats();

    // Set up interval to fetch every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    // Clean up interval
    return () => clearInterval(interval);
  }, [navigate]);

  const renderContent = () => {
    switch(currentPath) {
      case 'categories':
        return <CategoryManagement />;
      case 'myblogs':
        return <BlogManagement showAll={false} />;
      case 'dashboard':
      case 'analytics':
      default:
        return (
          <div className="p-4 sm:p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <Headings type="h2" className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-pink-600 to-amber-600 dark:from-indigo-400 dark:via-pink-400 dark:to-amber-400 bg-clip-text text-transparent mb-2">Dashboard Overview</Headings>
                <Paragraph className="text-slate-600 dark:text-slate-400">Welcome back! Here's a summary of your activity</Paragraph>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Posts Card */}
                <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <Paragraph className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">Total Posts</Paragraph>
                      <Headings type="h3" className="text-5xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text mb-3">{stats.blogs}</Headings>
                      <Paragraph className="text-slate-500 dark:text-slate-500 text-xs">Published articles</Paragraph>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Edit size={28} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Categories Card */}
                <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-600 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <Paragraph className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">Categories</Paragraph>
                      <Headings type="h3" className="text-5xl font-bold text-transparent bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text mb-3">{stats.categories}</Headings>
                      <Paragraph className="text-slate-500 dark:text-slate-500 text-xs">Organized topics</Paragraph>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Grid size={28} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Users Card */}
                <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <Paragraph className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-2">Active Users</Paragraph>
                      <Headings type="h3" className="text-5xl font-bold text-transparent bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text mb-3">{stats.users}</Headings>
                      <Paragraph className="text-slate-500 dark:text-slate-500 text-xs">Community members</Paragraph>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <User size={28} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visitor Growth Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <Headings type="h4" className="text-xl font-bold text-gray-900 dark:text-white">Visitor Growth</Headings>
                    <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                      <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">This Month</span>
                    </div>
                  </div>
                  <div className="h-32 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-xl flex items-center justify-center mb-4 border border-indigo-200 dark:border-indigo-700">
                    <Paragraph className="text-slate-500 dark:text-slate-400">📊 Analytics coming soon</Paragraph>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors">Monthly</button>
                    <button className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Yearly</button>
                  </div>
                </div>

                {/* Latest Posts Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
                  <Headings type="h4" className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Stats</Headings>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl border border-pink-200 dark:border-pink-700">
                      <Paragraph className="font-medium text-gray-900 dark:text-white">Average Read Time</Paragraph>
                      <span className="text-lg font-bold text-pink-600 dark:text-pink-400">5-7 min</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700">
                      <Paragraph className="font-medium text-gray-900 dark:text-white">Engagement Rate</Paragraph>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">82%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                      <Paragraph className="font-medium text-gray-900 dark:text-white">Total Views</Paragraph>
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">12.5K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1">
      {renderContent()}
    </div>
  );
}