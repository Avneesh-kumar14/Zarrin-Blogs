import React, { useEffect, useState } from "react";
import { Edit, Grid, User } from "lucide-react"; 
import Headings from "../Common/Heading";
import Paragraph from "../Common/Paragraph";
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
        const API_URL = process.env.REACT_APP_API_BASE_URL ? `${process.env.REACT_APP_API_BASE_URL}/api` : 'http://localhost:8200/api';
        const res = await fetch(`${API_URL}/stats`, {
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
          <div className="p-4 sm:p-8 bg-surface-primary dark:bg-surface-dark min-h-screen">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <Headings type="h2" className="text-3xl sm:text-4xl font-bold text-primary mb-2">Dashboard Overview</Headings>
                <Paragraph className="text-text-secondary">Welcome back! Here's a summary of your activity</Paragraph>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Posts Card */}
                <div className="group relative bg-surface-primary dark:bg-surface-dark rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border-default hover:border-primary-hover dark:hover:border-primary overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <Paragraph className="text-text-secondary text-sm font-medium mb-2">Total Posts</Paragraph>
                      <Headings type="h3" className="text-5xl font-bold text-primary mb-3">{stats.blogs}</Headings>
                      <Paragraph className="text-text-muted text-xs">Published articles</Paragraph>
                    </div>
                    <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Edit size={28} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Categories Card */}
                <div className="group relative bg-surface-primary dark:bg-surface-dark rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border-default hover:border-secondary-hover dark:hover:border-secondary overflow-hidden">
                  <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <Paragraph className="text-text-secondary text-sm font-medium mb-2">Categories</Paragraph>
                      <Headings type="h3" className="text-5xl font-bold text-secondary mb-3">{stats.categories}</Headings>
                      <Paragraph className="text-text-muted text-xs">Organized topics</Paragraph>
                    </div>
                    <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Grid size={28} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Users Card */}
                <div className="group relative bg-surface-primary dark:bg-surface-dark rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border-default hover:border-accent-hover dark:hover:border-accent overflow-hidden">
                  <div className="absolute inset-0 bg-warning/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <Paragraph className="text-text-secondary text-sm font-medium mb-2">Active Users</Paragraph>
                      <Headings type="h3" className="text-5xl font-bold text-warning mb-3">{stats.users}</Headings>
                      <Paragraph className="text-text-muted text-xs">Community members</Paragraph>
                    </div>
                    <div className="w-14 h-14 bg-warning rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
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
                    <Headings type="h4" className="text-xl font-bold text-text-primary">Visitor Growth</Headings>
                    <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                      <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">This Month</span>
                    </div>
                  </div>
                  <div className="h-32 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center mb-4 border border-primary/20 dark:border-primary/40">
                    <Paragraph className="text-text-muted">📊 Analytics coming soon</Paragraph>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors">Monthly</button>
                    <button className="flex-1 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 text-text-secondary rounded-lg font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors">Yearly</button>
                  </div>
                </div>

                {/* Latest Posts Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
                  <Headings type="h4" className="text-xl font-bold text-text-primary mb-6">Quick Stats</Headings>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-error-bg dark:bg-error-bg rounded-xl border border-error/30 dark:border-error/40">
                      <Paragraph className="font-medium text-text-primary">Average Read Time</Paragraph>
                      <span className="text-lg font-bold text-pink-600 dark:text-pink-400">5-7 min</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-success-bg dark:bg-success-bg rounded-xl border border-success/30 dark:border-success/40">
                      <Paragraph className="font-medium text-text-primary">Engagement Rate</Paragraph>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">82%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                      <Paragraph className="font-medium text-text-primary">Total Views</Paragraph>
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