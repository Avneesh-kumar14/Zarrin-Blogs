import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SideBar from "./Main Component/SideBar";

export default function AuthenticatedLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        console.log('No authentication data found, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        navigate('/login');
        return;
      }

      try {
        // Validate token with backend
        const response = await fetch('/api/auth/validate', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Token validation failed');
        }

        const user = JSON.parse(userStr);
        if (!user.id || !user.email) {
          throw new Error('Invalid user data');
        }
        
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Auth validation failed:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        navigate('/login');
      }
    };

    validateToken();
  }, [navigate]);

  return (
    <div className="flex">
       <div><SideBar/> </div>
      <Outlet />
    </div>
  );
}