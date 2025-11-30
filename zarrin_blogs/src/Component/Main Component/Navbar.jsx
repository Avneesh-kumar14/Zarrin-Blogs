import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Heading from '../Common/Heading';
import { Search, Menu, X, LogOut, BookOpen, Info, Mail, LogIn } from 'lucide-react';
import Button from '../Common/Button';
import Logo from '../Common/Logo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const searchInputRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <nav className="sticky top-0 w-full z-50 bg-gradient-to-r from-white to-blue-50 border-b border-gray-200 shadow-sm backdrop-blur-md bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group hover:scale-105 transition-transform duration-300">
            <Logo size="text-3xl" className="group-hover:rotate-12 transition-transform" />
            <Heading type="h4" className="hidden sm:block text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Zarrin
            </Heading>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} className="group-hover:scale-110 transition-transform" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Search & Auth Section */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center relative group">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 text-gray-700"
              >
                <Search size={20} className="group-hover:scale-110 transition-transform" />
              </button>
              {showSearch && (
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search blogs..."
                  className="absolute right-10 w-48 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-sm bg-white shadow-lg animate-slide-down"
                />
              )}
            </div>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{user?.name || 'User'}</span>
                </div>
                <NavLink to="/dashboard/analytics">
                  <Button
                    text="Dashboard"
                    variant="primary"
                    size="sm"
                    className="hidden sm:inline-block"
                  />
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 rounded-lg transition-all duration-300 text-gray-700 hover:text-red-600"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <NavLink to="/login">
                  <Button
                    text="Login"
                    variant="outline"
                    size="sm"
                    icon={LogIn}
                  />
                </NavLink>
                <NavLink to="/signup">
                  <Button
                    text="Sign Up"
                    variant="primary"
                    size="sm"
                  />
                </NavLink>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed top-16 right-0 h-[calc(100vh-64px)] w-full bg-white shadow-lg z-40 transform transition-all duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-2 p-4">
          {/* Mobile Nav Links */}
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}

          {/* Mobile Search */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
              <Search size={18} className="text-gray-600" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent flex-1 outline-none text-sm text-gray-700 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Mobile Auth */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            {isLoggedIn ? (
              <div className="space-y-2">
                {user && (
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700">Logged in as</p>
                    <p className="text-lg font-bold text-gray-900">{user.name}</p>
                  </div>
                )}
                <NavLink to="/dashboard/analytics" onClick={() => setIsOpen(false)}>
                  <Button text="Go to Dashboard" variant="primary" fullWidth size="md" />
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <NavLink to="/login" onClick={() => setIsOpen(false)}>
                  <Button text="Login" variant="outline" fullWidth size="md" />
                </NavLink>
                <NavLink to="/signup" onClick={() => setIsOpen(false)}>
                  <Button text="Sign Up" variant="primary" fullWidth size="md" />
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
