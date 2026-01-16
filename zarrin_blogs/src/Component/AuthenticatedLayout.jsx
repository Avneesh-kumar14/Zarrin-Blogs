import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SideBar from "./Main Component/SideBar";
import DashboardNavbar from "./Main Component/DashboardNavbar";

/**
 * AuthenticatedLayout Component
 * 
 * Main layout for authenticated pages.
 * Provides consistent spacing, colors, and typography from design system.
 */

export default function AuthenticatedLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [hasValidated, setHasValidated] = useState(false);

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
        const response = await fetch('http://localhost:8200/api/auth/validate', {
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
        if (!user.id || !user.email) {
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
    <div className="flex flex-col h-screen bg-bg-page">
      {/* Fixed Navbar */}
      <DashboardNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main Content Area with proper spacing */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Responsive */}
        <SideBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        {/* Main Content with professional spacing and typography */}
        <div className="flex-1 overflow-y-auto bg-bg-page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
