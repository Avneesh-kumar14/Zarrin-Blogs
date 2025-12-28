import React, { useState, useRef, useEffect, useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Heading from '../Common/Heading';
import { Search, Menu, X, LogOut, BookOpen, Info, Mail, LogIn, Bookmark, Moon, Sun } from 'lucide-react';
import Button from '../Common/Button';
import Logo from '../Common/Logo';
import { ThemeContext } from '../../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useContext(ThemeContext);

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

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <nav className="sticky top-0 w-full z-50 bg-gradient-to-r from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-900/20 border-b border-gray-200 dark:border-indigo-700 shadow-sm backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group hover:scale-105 transition-transform duration-300">
            <Logo size="text-3xl" className="group-hover:rotate-12 transition-transform" />
            <Heading type="h4" className="hidden sm:block text-2xl font-bold bg-gradient-to-r from-indigo-600 dark:from-indigo-400 to-pink-600 dark:to-pink-400 bg-clip-text text-transparent">
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
                      ? 'bg-gradient-to-r from-indigo-600 dark:from-indigo-700 to-pink-600 dark:to-pink-700 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
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
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-300 text-gray-700 dark:text-gray-300"
              >
                <Search size={20} className="group-hover:scale-110 transition-transform" />
              </button>
              {showSearch && (
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearch}
                  className="absolute right-10 w-48 px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-indigo-600 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all duration-300 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg animate-slide-down"
                />
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-300 text-indigo-600 dark:text-indigo-400"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 dark:from-indigo-900/20 to-pink-50 dark:to-pink-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user?.name || 'User'}</span>
                </div>
                <NavLink to="/bookmarks" className="p-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400" title="Bookmarks">
                  <Bookmark size={20} />
                </NavLink>
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
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
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
              className="md:hidden p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-300"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed top-16 right-0 h-[calc(100vh-64px)] w-full bg-white dark:bg-gray-900 shadow-lg z-40 transform transition-all duration-300 ease-in-out overflow-y-auto ${
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
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
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
                <NavLink to="/bookmarks" onClick={() => setIsOpen(false)}>
                  <Button 
                    text="My Bookmarks" 
                    variant="outline" 
                    fullWidth 
                    size="md"
                    icon={Bookmark}
                  />
                </NavLink>
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
