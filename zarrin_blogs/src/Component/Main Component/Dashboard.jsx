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
          <div className="p-8">
            <div className="mb-6">
              <Headings type="h4" className="text-2xl font-semibold">Dashboard Overview</Headings>
              <Paragraph className="text-secondary">Home / Dashboard</Paragraph>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-primary p-6 rounded-xl flex items-center justify-between">
                <div className="text-tertiary">
                  <Headings type="h4">Posts</Headings>
                  <Paragraph className="text-2xl font-bold">{stats.blogs}</Paragraph>
                </div>
                <Edit className="text-tertiary" size={32} />
              </div>

              <div className="bg-primary p-6 rounded-xl flex items-center justify-between">
                <div className="text-tertiary">
                  <Headings type="h4">Categories</Headings>
                  <Paragraph className="text-2xl font-bold">{stats.categories}</Paragraph>
                </div>
                <Grid className="text-tertiary" size={32} />
              </div>

              <div className="bg-primary p-6 rounded-xl flex items-center justify-between">
                <div className="text-tertiary">
                  <Headings type="h4">Users</Headings>
                  <Paragraph className="text-2xl font-bold">{stats.users}</Paragraph>
                </div>
                <User className="text-tertiary" size={32} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-tertiary p-6 rounded-xl shadow">
                <Headings type="h4" className="text-lg font-semibold mb-4">Visitor Growth</Headings>
                <div className="flex space-x-4 mb-4">
                  <Button variant="primary" className="bg-secondaryGray hover:bg-primary text-tertiary px-4 py-1 rounded-full" text="Monthly"/>
                  <Button variant="primary" className="bg-secondaryGray hover:bg-primary text-tertiary px-4 py-1 rounded-full" text="Yearly"/>
                </div>
              </div>

              <div className="bg-tertiary p-6 rounded-xl shadow">
                <Headings type="h4" className="text-lg font-semibold mb-4">Latest Posts</Headings>
                <ul className="space-y-4 text-sm">
                  <li>
                    <Paragraph className="font-medium">The Power of Dream</Paragraph>
                    <span className="text-secondary">28 June 2021</span>
                  </li>
                  <li>
                    <Paragraph className="font-medium">Train</Paragraph>
                    <span className="text-secondary">22 June 2021</span>
                  </li>
                  <li>
                    <Paragraph className="font-medium">Works vs School</Paragraph>
                    <span className="text-secondary">21 June 2021</span>
                  </li>
                </ul>
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