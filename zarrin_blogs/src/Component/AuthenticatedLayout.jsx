import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SideBar from "./Main Component/SideBar";
import DashboardNavbar from "./Main Component/DashboardNavbar";
import CallNotification from "./Chat/CallComponents/CallNotification";
import CallModal from "./Chat/CallComponents/CallModal";

export default function AuthenticatedLayout() {
  // eslint-disable-next-line no-unused-vars
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [hasValidated, setHasValidated] = useState(false);
  // API_URL is constant and doesn't change - safe to use in effects
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const API_URL = process.env.REACT_APP_API_BASE_URL ? `${process.env.REACT_APP_API_BASE_URL}/api` : 'https://zarrin-blogs-backend.onrender.com/api';

  useEffect(() => {
    // Skip validation if already validated in this session
    if (hasValidated) return;

    const validateToken = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        console.log('No authentication data found, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        navigate('/login');
        setHasValidated(true);
        return;
      }

      try {
        // Validate token with backend
        const response = await fetch(`${API_URL}/auth/validate`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Token validation failed');
        }

        const data = await response.json();
        console.log('✅ Token validated:', data);
        
        const user = JSON.parse(userStr);
        // Check for both _id (MongoDB) and id (normalized field)
        if (!(user._id || user.id) || !user.email) {
          throw new Error('Invalid user data');
        }
        
        setIsAuthenticated(true);
        setHasValidated(true);
      } catch (err) {
        console.error('Auth validation failed:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        navigate('/login');
        setHasValidated(true);
      }
    };

    validateToken();
  }, [hasValidated, navigate]);

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Sticky Navbar */}
      <DashboardNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Disappears on scroll */}
        <SideBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
          
          {/* Call Components */}
          <CallNotification />
          <CallModal />
        </div>
      </div>
    </div>
  );
}