
import React from 'react';
import { Menu, X } from 'lucide-react';

const DashboardNavbar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <nav className="sticky top-0 w-full z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Menu Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

       
      </div>
    </nav>
  );
};

export default DashboardNavbar;
