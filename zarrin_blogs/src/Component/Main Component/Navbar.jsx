import React, { useState, useRef, useEffect, useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Menu,
  X,
  LogOut,
  BookOpen,
  Info,
  Mail,
  Bookmark,
  Moon,
  Sun,
  ChevronDown,
  User,
  LogIn,
  UserPlus,
  Sparkles,
  TrendingUp,
  Bell,
  Settings,
  ArrowRight
} from 'lucide-react';
import Heading from '../Common/Heading';
import Logo from '../Common/Logo';
import { ThemeContext } from '../../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState({
    totalBlogs: 0,
    followers: 0,
    following: 0
  });
  const [loadingStats, setLoadingStats] = useState(false);

  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useContext(ThemeContext);

  // Load user from localStorage and listen for updates
  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      setIsLoggedIn(!!token);
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }
    };

    loadUser();

    // Listen for storage changes (avatar updates, profile changes)
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === null) {
        loadUser();
      }
    };

    // Listen for custom avatar update event
    const handleAvatarUpdated = (e) => {
      if (e.detail && e.detail.user) {
        setUser(e.detail.user);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('avatarUpdated', handleAvatarUpdated);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('avatarUpdated', handleAvatarUpdated);
    };
  }, []);

  // Fetch user stats from API with real-time updates
  useEffect(() => {
    const fetchUserStats = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        console.log('⚠️ Missing token or user data');
        return;
      }

      try {
        setLoadingStats(true);
        const parsedUser = JSON.parse(userData);
        console.log('📌 Fetching stats for user:', parsedUser._id);
        
        // Construct API URL properly
        const apiBase = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8200';
        const apiUrl = apiBase.includes('/api') ? apiBase : `${apiBase}/api`;
        const fetchUrl = `${apiUrl}/users/${parsedUser._id}`;
        console.log('📍 Fetch URL:', fetchUrl);
        
        const response = await fetch(fetchUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Stats fetched:', { followers: data.followers?.length, blogs: data.totalBlogs });
          setUserStats({
            totalBlogs: data.totalBlogs || 0,
            followers: data.followers?.length || 0,
            following: data.following?.length || 0
          });
          // Update avatar if it changed
          if (data.avatar && data.avatar !== user?.avatar) {
            console.log('🖼️ Updating avatar:', data.avatar);
            setUser(prev => ({ ...prev, avatar: data.avatar }));
          }
        } else {
          console.error('❌ Failed to fetch stats:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (isLoggedIn) {
      fetchUserStats();
      // Refresh stats every 3 seconds for real-time updates
      const interval = setInterval(fetchUserStats, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, location.pathname, user]);

  // Also update when location changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, [location]);

  useEffect(() => {
    if (showSearch && searchRef.current) searchRef.current.focus();
  }, [showSearch]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const navLinks = [
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const trendingTopics = [
    { name: "Web Development", count: "2.3K articles", icon: "💻", color: "from-[#6366F1] to-[#8B5CF6]" },
    { name: "UI/UX Design", count: "1.8K articles", icon: "🎨", color: "from-[#EC4899] to-[#F472B6]" },
    { name: "AI & Machine Learning", count: "1.5K articles", icon: "🤖", color: "from-[#06B6D4] to-[#6366F1]" },
    { name: "Mobile Development", count: "1.2K articles", icon: "📱", color: "from-[#FB923C] to-[#F472B6]" }
  ];

  const quickLinks = [
    { title: "Getting Started", desc: "New to blogging?" },
    { title: "Writing Guide", desc: "Tips for great content" },
    { title: "Community Guidelines", desc: "Our community rules" },
    { title: "Success Stories", desc: "Inspiring journeys" }
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">

            {/* Logo */}
            <NavLink 
              to="/" 
              className="flex items-center gap-2 group hover:scale-105 transition-transform duration-300"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#EC4899] flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
                  Z
                </div>
              </div>
              <Heading
                type="h4"
                className="hidden sm:block text-lg font-bold bg-gradient-to-r from-[#6366F1] to-[#EC4899] bg-clip-text text-transparent"
              >
                Zarrin
              </Heading>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ name, path, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <NavLink
                    key={path}
                    to={path}
                    className="relative group"
                  >
                    <button className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}>
                      <Icon size={18} />
                      <span>{name}</span>
                    </button>

                    {/* Mega Menu for Blog */}
                    {name === 'Blog' && (
                      <div className="absolute top-full left-0 mt-0 w-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <div className="p-6">
                          <div className="grid grid-cols-2 gap-6">
                            {/* Trending Topics */}
                            <div>
                              <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                Trending Topics
                              </h3>
                              <div className="space-y-2">
                                {trendingTopics.slice(0, 2).map((topic) => (
                                  <button
                                    key={topic.name}
                                    onClick={() => navigate('/blog')}
                                    className="w-full text-left p-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-md bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg`}>
                                        {topic.icon}
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm text-slate-900 dark:text-white">{topic.name}</p>
                                        <p className="text-xs text-slate-500">{topic.count}</p>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                              <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                                <Sparkles className="w-4 h-4 text-blue-600" />
                                Quick Links
                              </h3>
                              <div className="space-y-2">
                                {quickLinks.map((link) => (
                                  <button
                                    key={link.title}
                                    className="w-full text-left p-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  >
                                    <p className="font-medium text-sm text-slate-900 dark:text-white">{link.title}</p>
                                    <p className="text-xs text-slate-500">{link.desc}</p>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 border-t border-slate-200 dark:border-slate-800">
                          <button 
                            onClick={() => navigate('/blog')}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-all"
                          >
                            <BookOpen className="w-4 h-4" />
                            Browse All Articles
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">

              {/* Search Bar */}
              <div className="relative hidden md:block group">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Search size={20} />
                </button>

                {showSearch && (
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="absolute right-0 mt-2 w-64 px-4 py-3 text-sm rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 focus:border-[#6366F1] dark:focus:border-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/10 dark:focus:ring-[#8B5CF6]/10 shadow-lg transition-all duration-300"
                  />
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gradient-to-br hover:from-[#6366F1]/10 hover:to-[#EC4899]/10 dark:hover:bg-slate-800 transition-all duration-300 text-[#6366F1] dark:text-[#8B5CF6]"
                title={isDark ? 'Light Mode' : 'Dark Mode'}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Auth Section */}
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  {/* Bookmarks */}
                  <NavLink
                    to="/bookmarks"
                    className="p-2 rounded-lg hover:bg-gradient-to-br hover:from-amber-50 hover:to-amber-100 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400"
                    title="Bookmarks"
                  >
                    <Bookmark size={20} />
                  </NavLink>

                  {/* Notifications */}
                  <NavLink
                    to="/notifications"
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-300 text-gray-700 dark:text-gray-300 relative hidden sm:block"
                    title="Notifications"
                  >
                    <Bell size={20} />
                    <span className="absolute top-1 right-0 w-2 h-2 bg-gradient-to-r from-[#EC4899] to-[#F472B6] rounded-full animate-pulse" />
                  </NavLink>

                  {/* User Profile Dropdown */}
                  <div className="relative group">
                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#6366F1]/10 to-[#EC4899]/10 dark:from-slate-800 dark:to-slate-700 hover:from-[#6366F1]/20 hover:to-[#EC4899]/20 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-300 border border-[#6366F1]/20 dark:border-slate-700 hover:border-[#6366F1]/50 group-hover:shadow-lg z-40">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-bold text-sm overflow-hidden border-2 border-white dark:border-slate-700">
                        {user?.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user?.name?.[0]?.toUpperCase() || <User size={16} />
                        )}
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {user?.name?.split(' ')[0] || 'User'}
                      </span>
                      <ChevronDown size={16} className="text-gray-500 dark:text-gray-400 group-hover:rotate-180 transition-transform" />
                    </button>

                    {/* User Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-2xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all overflow-hidden z-50">
                      {/* Profile Section */}
                      <div className="p-4 bg-gradient-to-br from-[#6366F1]/10 to-[#EC4899]/10 dark:from-slate-800 dark:to-slate-700 border-b border-gray-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white font-bold overflow-hidden border-2 border-white dark:border-slate-700">
                            {user?.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              user?.name?.[0]?.toUpperCase() || 'U'
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{user?.email || 'user@email.com'}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors cursor-default">
                            <p className="font-bold text-gray-900 dark:text-white">{loadingStats ? '⟳' : userStats.totalBlogs}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Posts</p>
                          </div>
                          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors cursor-default">
                            <p className="font-bold text-gray-900 dark:text-white">{loadingStats ? '⟳' : userStats.followers}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Followers</p>
                          </div>
                          <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-colors cursor-default">
                            <p className="font-bold text-gray-900 dark:text-white">{loadingStats ? '⟳' : userStats.following}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Following</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <NavLink
                          to="/dashboard/analytics"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-300"
                        >
                          <User size={16} />
                          <span className="text-sm">Dashboard</span>
                        </NavLink>
                        <NavLink
                          to="/bookmarks"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-300"
                        >
                          <Bookmark size={16} />
                          <span className="text-sm">My Bookmarks</span>
                        </NavLink>
                        <NavLink
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-300"
                        >
                          <Settings size={16} />
                          <span className="text-sm">Settings</span>
                        </NavLink>
                      </div>

                      {/* Logout Button */}
                      <div className="border-t border-gray-200 dark:border-slate-700 p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Logout */}
                  <button
                    onClick={handleLogout}
                    className="md:hidden p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 text-red-600 dark:text-red-400"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  {/* Login Button */}
                  <NavLink to="/login">
                    <button className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-[#6366F1] dark:hover:border-[#8B5CF6] transition-all duration-300">
                      <LogIn size={16} />
                      Login
                    </button>
                  </NavLink>

                  {/* Sign Up Button */}
                  <NavLink to="/signup">
                    <button className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4EE8] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                      <UserPlus size={16} className="group-hover:scale-110 transition-transform" />
                      Sign up
                    </button>
                  </NavLink>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-300"
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

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-3">
              {/* Mobile Search */}
              <div className="mb-4">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-slate-700">
                  <Search size={18} className="text-gray-600 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="bg-transparent flex-1 outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Mobile Nav Links */}
              {navLinks.map(({ name, path, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{name}</span>
                  </NavLink>
                );
              })}

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-slate-800 my-2" />

              {/* Mobile Auth Section */}
              {isLoggedIn ? (
                <div className="space-y-3">
                  {user && (
                    <div className="px-4 py-3 bg-gradient-to-r from-[#6366F1]/10 to-[#EC4899]/10 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-[#6366F1]/20 dark:border-slate-700">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Logged in as</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</p>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      navigate('/dashboard/analytics');
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white font-semibold rounded-lg hover:from-[#5558E3] hover:to-[#7C4EE8] transition-all shadow-lg"
                  >
                    <Sparkles size={18} />
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-all border border-red-200 dark:border-red-900/40"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <NavLink
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-center rounded-lg font-semibold text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-center rounded-lg font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4EE8] transition-all shadow-lg"
                  >
                    Sign up
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
