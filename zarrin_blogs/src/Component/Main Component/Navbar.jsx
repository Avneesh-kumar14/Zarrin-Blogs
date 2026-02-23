// import React, { useState, useRef, useEffect, useContext } from 'react';
// import { NavLink, useLocation, useNavigate } from 'react-router-dom';
// import {
//   Search,
//   Menu,
//   X,
//   LogOut,
//   BookOpen,
//   Info,
//   Mail,
//   Bookmark,
//   Moon,
//   Sun,
//   ChevronDown,
//   User,
//   LogIn,
//   UserPlus,
//   Sparkles,
//   TrendingUp,
//   Bell,
//   Settings,
//   ArrowRight,
//   MessageCircle,
//   LayoutDashboard
// } from 'lucide-react';
// import Heading from '../Common/Heading';
// import { ThemeContext } from '../../context/ThemeContext';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [showSearch, setShowSearch] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);
//   const [userStats, setUserStats] = useState({
//     totalBlogs: 0,
//     followers: 0,
//     following: 0
//   });
//   const [loadingStats, setLoadingStats] = useState(false);

//   const searchRef = useRef(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { isDark, toggleTheme } = useContext(ThemeContext);

//   useEffect(() => {
//     const loadUser = () => {
//       const token = localStorage.getItem('token');
//       const userData = localStorage.getItem('user');
//       setIsLoggedIn(!!token);
//       if (userData) {
//         try {
//           const parsedUser = JSON.parse(userData);
//           setUser(parsedUser);
//         } catch (e) {
//           console.error('Failed to parse user data:', e);
//         }
//       }
//     };

//     loadUser();

//     const handleStorageChange = (e) => {
//       if (e.key === 'user' || e.key === null) loadUser();
//     };

//     const handleAvatarUpdated = (e) => {
//       if (e.detail && e.detail.user) setUser(e.detail.user);
//     };

//     window.addEventListener('storage', handleStorageChange);
//     window.addEventListener('avatarUpdated', handleAvatarUpdated);
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//       window.removeEventListener('avatarUpdated', handleAvatarUpdated);
//     };
//   }, []);

//   useEffect(() => {
//     const fetchUserStats = async () => {
//       const token = localStorage.getItem('token');
//       const userData = localStorage.getItem('user');
//       if (!token || !userData) return;

//       try {
//         setLoadingStats(true);
//         const parsedUser = JSON.parse(userData);
//         const apiBase = process.env.REACT_APP_API_BASE_URL || 'https://zarrin-blogs-backend.onrender.com';
//         const apiUrl = apiBase.includes('/api') ? apiBase : `${apiBase}/api`;
//         const response = await fetch(`${apiUrl}/users/${parsedUser._id}`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setUserStats({
//             totalBlogs: data.totalBlogs || 0,
//             followers: data.followers?.length || 0,
//             following: data.following?.length || 0
//           });
//           if (data.avatar && data.avatar !== user?.avatar) {
//             setUser(prev => ({ ...prev, avatar: data.avatar }));
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching user stats:', error);
//       } finally {
//         setLoadingStats(false);
//       }
//     };

//     if (isLoggedIn) {
//       fetchUserStats();
//       const interval = setInterval(fetchUserStats, 3000);
//       return () => clearInterval(interval);
//     }
//   }, [isLoggedIn, location.pathname, user]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const userData = localStorage.getItem('user');
//     setIsLoggedIn(!!token);
//     if (userData) {
//       try { setUser(JSON.parse(userData)); }
//       catch (e) { console.error('Failed to parse user data:', e); }
//     }
//   }, [location]);

//   useEffect(() => {
//     if (showSearch && searchRef.current) searchRef.current.focus();
//   }, [showSearch]);

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = '/';
//   };

//   const handleSearch = (e) => {
//     if (e.key === 'Enter' && searchQuery.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
//       setSearchQuery('');
//       setShowSearch(false);
//     }
//   };

//   const navLinks = [
//     { name: 'Blog', path: '/blog', icon: BookOpen },
//     { name: 'About', path: '/about', icon: Info },
//     { name: 'Contact', path: '/contact', icon: Mail },
//   ];

//   const trendingTopics = [
//     { name: "Web Development", count: "2.3K articles", icon: "💻" },
//     { name: "UI/UX Design", count: "1.8K articles", icon: "🎨" },
//     { name: "AI & Machine Learning", count: "1.5K articles", icon: "🤖" },
//     { name: "Mobile Development", count: "1.2K articles", icon: "📱" }
//   ];

//   const quickLinks = [
//     { title: "Getting Started", desc: "New to blogging?" },
//     { title: "Writing Guide", desc: "Tips for great content" },
//     { title: "Community Guidelines", desc: "Our community rules" },
//     { title: "Success Stories", desc: "Inspiring journeys" }
//   ];

//   const StatPill = ({ value, label, color }) => (
//     <div className="flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-xl bg-surface-primary/60 dark:bg-slate-800/60 backdrop-blur-sm border border-border-light/40 dark:border-border-dark/40">
//       <span className={`text-base font-bold ${color}`}>
//         {loadingStats ? <span className="inline-block w-4 h-1.5 bg-current rounded animate-pulse opacity-40" /> : value}
//       </span>
//       <span className="text-[10px] uppercase tracking-widest font-semibold text-text-secondary">{label}</span>
//     </div>
//   );

//   return (
//     <>
//       <nav className="sticky top-0 z-50 bg-surface-primary/90 dark:bg-surface-dark/90 backdrop-blur-2xl border-b border-border-light/30 dark:border-border-dark/30">

//         {/* Top accent line */}
//         <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="h-[60px] flex items-center justify-between gap-4">

//             {/* ── Logo ── */}
//             <NavLink to="/" className="flex items-center gap-3 shrink-0 group">
//               <div className="relative w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-md group-hover:shadow-primary/40 group-hover:shadow-lg transition-all duration-300">
//                 <span className="text-on-primary font-bold text-base tracking-tight">Z</span>
//               </div>
//               <div className="hidden sm:flex flex-col leading-none">
//                 <span className="text-[15px] font-bold text-primary tracking-tight">Zarrin</span>
//                 <span className="text-[10px] text-text-secondary font-medium tracking-widest uppercase">Blogs</span>
//               </div>
//             </NavLink>

//             {/* ── Desktop Nav Links ── */}
//             <div className="hidden md:flex items-center gap-1">
//               {navLinks.map(({ name, path, icon: Icon }) => {
//                 const isActive = location.pathname === path;
//                 return (
//                   <div key={path} className="relative group">
//                     <NavLink to={path}>
//                       <button className={`relative flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-lg tracking-wide transition-all duration-200 ${
//                         isActive
//                           ? 'text-primary bg-primary/10 dark:bg-primary/15'
//                           : 'text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800'
//                       }`}>
//                         <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
//                         {name}
//                         {isActive && (
//                           <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[1px] w-5 h-0.5 rounded-full bg-primary" />
//                         )}
//                       </button>
//                     </NavLink>

//                     {/* Blog Mega Menu */}
//                     {name === 'Blog' && (
//                       <div className="absolute top-full left-0 mt-3 w-[480px] bg-surface-primary dark:bg-surface-dark border border-border-light/60 dark:border-border-dark/60 shadow-xl shadow-black/10 dark:shadow-black/30 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50 translate-y-1 group-hover:translate-y-0">
//                         {/* Menu Header */}
//                         <div className="px-6 py-5 border-b border-border-light/50 dark:border-border-dark/50 bg-neutral-50/60 dark:bg-neutral-900/60">
//                           <p className="text-[11px] uppercase tracking-widest font-bold text-text-secondary">Explore</p>
//                           <p className="text-base font-bold text-text-primary mt-0.5">Discover what's trending</p>
//                         </div>

//                         <div className="grid grid-cols-2 gap-0 divide-x divide-border-light/40 dark:divide-border-dark/40">
//                           {/* Trending Topics */}
//                           <div className="p-5">
//                             <p className="text-[10px] uppercase tracking-widest font-bold text-text-secondary flex items-center gap-1.5 mb-3">
//                               <TrendingUp size={10} className="text-primary" />
//                               Trending
//                             </p>
//                             <div className="space-y-1">
//                               {trendingTopics.slice(0, 2).map((topic) => (
//                                 <button
//                                   key={topic.name}
//                                   onClick={() => navigate('/blog')}
//                                   className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/8 dark:hover:bg-primary/12 transition-colors group/t"
//                                 >
//                                   <span className="text-xl">{topic.icon}</span>
//                                   <div>
//                                     <p className="text-[13px] font-semibold text-text-primary group-hover/t:text-primary transition-colors leading-tight">{topic.name}</p>
//                                     <p className="text-[11px] text-text-secondary mt-0.5">{topic.count}</p>
//                                   </div>
//                                 </button>
//                               ))}
//                             </div>
//                           </div>

//                           {/* Quick Help */}
//                           <div className="p-5">
//                             <p className="text-[10px] uppercase tracking-widest font-bold text-text-secondary flex items-center gap-1.5 mb-3">
//                               <Sparkles size={10} className="text-secondary" />
//                               Quick Help
//                             </p>
//                             <div className="space-y-1">
//                               {quickLinks.slice(0, 3).map((link) => (
//                                 <button
//                                   key={link.title}
//                                   className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-secondary/8 dark:hover:bg-secondary/12 transition-colors group/q"
//                                 >
//                                   <p className="text-[13px] font-semibold text-text-primary group-hover/q:text-secondary transition-colors leading-tight">{link.title}</p>
//                                   <p className="text-[11px] text-text-secondary mt-0.5">{link.desc}</p>
//                                 </button>
//                               ))}
//                             </div>
//                           </div>
//                         </div>

//                         {/* Menu Footer */}
//                         <div className="flex items-center justify-between px-5 py-3.5 border-t border-border-light/50 dark:border-border-dark/50 bg-neutral-50/60 dark:bg-neutral-900/60">
//                           <p className="text-[12px] text-text-secondary font-medium">All articles →</p>
//                           <button
//                             onClick={() => navigate('/blog')}
//                             className="flex items-center gap-1.5 px-4 py-1.5 bg-primary hover:bg-primary-dark text-on-primary text-[12px] font-bold rounded-lg shadow-sm hover:shadow-md transition-all"
//                           >
//                             <BookOpen size={12} />
//                             Browse All
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             {/* ── Right Actions ── */}
//             <div className="flex items-center gap-1.5">

//               {/* Search Toggle */}
//               <div className={`hidden md:flex items-center transition-all duration-300 ${showSearch ? 'w-56' : 'w-8'}`}>
//                 {showSearch ? (
//                   <div className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-border-light dark:border-border-dark text-[13px]">
//                     <Search size={13} className="text-text-secondary shrink-0" />
//                     <input
//                       ref={searchRef}
//                       type="text"
//                       placeholder="Search…"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       onKeyDown={handleSearch}
//                       onBlur={() => { if (!searchQuery) setShowSearch(false); }}
//                       className="bg-transparent flex-1 outline-none text-text-primary placeholder-text-secondary/60 min-w-0"
//                     />
//                     <button onClick={() => { setShowSearch(false); setSearchQuery(''); }}>
//                       <X size={12} className="text-text-secondary hover:text-text-primary transition-colors" />
//                     </button>
//                   </div>
//                 ) : (
//                   <button
//                     onClick={() => setShowSearch(true)}
//                     className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
//                     title="Search"
//                   >
//                     <Search size={16} />
//                   </button>
//                 )}
//               </div>

//               {/* Theme Toggle */}
//               <button
//                 onClick={toggleTheme}
//                 className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
//                 title="Toggle theme"
//               >
//                 {isDark ? <Sun size={16} /> : <Moon size={16} />}
//               </button>

//               {isLoggedIn ? (
//                 <>
//                   {/* Bookmarks */}
//                   <NavLink
//                     to="/bookmarks"
//                     className="hidden sm:flex p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
//                     title="Bookmarks"
//                   >
//                     <Bookmark size={16} />
//                   </NavLink>

//                   {/* Chat */}
//                   <NavLink
//                     to="/chat"
//                     className="hidden sm:flex p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
//                     title="Chat"
//                   >
//                     <MessageCircle size={16} />
//                   </NavLink>

//                   {/* Notifications */}
//                   <NavLink
//                     to="/notifications"
//                     className="hidden sm:flex p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all relative"
//                     title="Notifications"
//                   >
//                     <Bell size={16} />
//                     <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error rounded-full" />
//                   </NavLink>

//                   {/* Divider */}
//                   <div className="hidden sm:block w-px h-5 bg-border-light dark:bg-border-dark mx-1" />

//                   {/* User Avatar Dropdown */}
//                   <div className="relative group">
//                     <button className="hidden sm:flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all border border-transparent hover:border-border-light dark:hover:border-border-dark">
//                       <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-on-primary font-bold text-xs overflow-hidden border border-white/30 dark:border-slate-600 shadow-sm">
//                         {user?.avatar
//                           ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
//                           : user?.name?.[0]?.toUpperCase() || <User size={13} />
//                         }
//                       </div>
//                       <span className="text-[13px] font-semibold text-text-primary hidden lg:block max-w-[100px] truncate">
//                         {user?.name?.split(' ')[0] || 'User'}
//                       </span>
//                       <ChevronDown size={12} className="text-text-secondary group-hover:rotate-180 transition-transform duration-200" />
//                     </button>

//                     {/* Dropdown */}
//                     <div className="absolute right-0 top-full mt-2.5 w-72 bg-surface-primary dark:bg-surface-dark border border-border-light/60 dark:border-border-dark/60 shadow-xl shadow-black/10 dark:shadow-black/30 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0 transition-all duration-200 overflow-hidden z-50">

//                       {/* Profile Section */}
//                       <div className="p-5 border-b border-border-light/50 dark:border-border-dark/50">
//                         <div className="flex items-center gap-3">
//                           <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-base overflow-hidden shadow-sm border border-white/20 dark:border-slate-600 shrink-0">
//                             {user?.avatar
//                               ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
//                               : user?.name?.[0]?.toUpperCase() || 'U'
//                             }
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-[14px] font-bold text-text-primary truncate leading-tight">{user?.name || 'User'}</p>
//                             <p className="text-[11px] text-text-secondary truncate mt-0.5">{user?.email || 'user@email.com'}</p>
//                             <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-primary/10 dark:bg-primary/20 text-primary text-[10px] font-bold rounded-md tracking-wide uppercase">
//                               Pro Member
//                             </span>
//                           </div>
//                         </div>

//                         {/* Stats */}
//                         <div className="mt-4 flex items-center gap-3">
//                           <StatPill value={userStats.totalBlogs} label="Blogs" color="text-primary" />
//                           <StatPill value={userStats.followers} label="Followers" color="text-secondary" />
//                           <StatPill value={userStats.following} label="Following" color="text-accent" />
//                         </div>
//                       </div>

//                       {/* Menu Items */}
//                       <div className="p-2 space-y-0.5">
//                         {[
//                           { to: '/dashboard/analytics', icon: LayoutDashboard, label: 'Dashboard', desc: 'Analytics & overview', color: 'text-primary', bg: 'hover:bg-primary/8 dark:hover:bg-primary/12' },
//                           { to: '/dashboard/myblogs', icon: BookOpen, label: 'My Blogs', desc: 'Manage your articles', color: 'text-secondary', bg: 'hover:bg-secondary/8 dark:hover:bg-secondary/12' },
//                           { to: '/settings', icon: Settings, label: 'Settings', desc: 'Account preferences', color: 'text-accent', bg: 'hover:bg-accent/8 dark:hover:bg-accent/12' },
//                         ].map(({ to, icon: Icon, label, desc, color, bg }) => (
//                           <NavLink
//                             key={to}
//                             to={to}
//                             className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${bg} transition-all group/item`}
//                           >
//                             <div className={`w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform`}>
//                               <Icon size={15} className={color} />
//                             </div>
//                             <div>
//                               <p className={`text-[13px] font-semibold text-text-primary group-hover/item:${color} transition-colors leading-tight`}>{label}</p>
//                               <p className="text-[11px] text-text-secondary">{desc}</p>
//                             </div>
//                           </NavLink>
//                         ))}
//                       </div>

//                       {/* Logout */}
//                       <div className="p-2 pt-0 border-t border-border-light/50 dark:border-border-dark/50 mt-1">
//                         <button
//                           onClick={handleLogout}
//                           className="w-full flex items-center gap-3 px-3 py-2.5 text-error hover:bg-error/8 dark:hover:bg-error/12 rounded-xl transition-all group/out"
//                         >
//                           <div className="w-8 h-8 rounded-lg bg-error/10 dark:bg-error/15 flex items-center justify-center shrink-0 group-hover/out:scale-105 transition-transform">
//                             <LogOut size={14} className="text-error" />
//                           </div>
//                           <p className="text-[13px] font-semibold">Sign Out</p>
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Mobile Logout */}
//                   <button
//                     onClick={handleLogout}
//                     className="md:hidden p-2 rounded-lg text-error hover:bg-error/10 transition-all"
//                     title="Logout"
//                   >
//                     <LogOut size={16} />
//                   </button>
//                 </>
//               ) : (
//                 <div className="hidden md:flex items-center gap-2">
//                   <NavLink to="/login">
//                     <button className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold text-text-primary hover:text-primary border border-border-light dark:border-border-dark hover:border-primary/50 rounded-lg hover:bg-primary/5 transition-all">
//                       <LogIn size={13} />
//                       Login
//                     </button>
//                   </NavLink>
//                   <NavLink to="/signup">
//                     <button className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-bold text-on-primary bg-primary hover:bg-primary-dark rounded-lg shadow-sm hover:shadow-md transition-all">
//                       <UserPlus size={13} />
//                       Sign up
//                     </button>
//                   </NavLink>
//                 </div>
//               )}

//               {/* Mobile Menu Toggle */}
//               <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
//               >
//                 {isOpen ? <X size={18} /> : <Menu size={18} />}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ── Mobile Menu ── */}
//         {isOpen && (
//           <div className="md:hidden border-t border-border-light/40 dark:border-border-dark/40 bg-surface-primary dark:bg-surface-dark">
//             <div className="px-4 py-5 space-y-1.5">

//               {/* Mobile Search */}
//               <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-transparent focus-within:border-primary/40 transition-all mb-4">
//                 <Search size={14} className="text-text-secondary shrink-0" />
//                 <input
//                   type="text"
//                   placeholder="Search articles…"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onKeyDown={handleSearch}
//                   className="bg-transparent flex-1 outline-none text-[13px] text-text-primary placeholder-text-secondary/60"
//                 />
//               </div>

//               {/* Nav Links */}
//               {navLinks.map(({ name, path, icon: Icon }) => {
//                 const isActive = location.pathname === path;
//                 return (
//                   <NavLink
//                     key={path}
//                     to={path}
//                     onClick={() => setIsOpen(false)}
//                     className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
//                       isActive
//                         ? 'bg-primary/10 dark:bg-primary/15 text-primary'
//                         : 'text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800'
//                     }`}
//                   >
//                     <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
//                     {name}
//                   </NavLink>
//                 );
//               })}

//               <div className="border-t border-border-light/40 dark:border-border-dark/40 my-3 pt-1" />

//               {/* Mobile Auth */}
//               {isLoggedIn ? (
//                 <div className="space-y-2">
//                   {user && (
//                     <div className="px-4 py-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-border-light/50 dark:border-border-dark/50">
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold text-sm overflow-hidden shrink-0">
//                           {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase() || 'U'}
//                         </div>
//                         <div>
//                           <p className="text-[14px] font-bold text-text-primary">{user.name}</p>
//                           <p className="text-[11px] text-text-secondary">{userStats.totalBlogs} articles · {userStats.followers} followers</p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   <button
//                     onClick={() => { navigate('/dashboard/analytics'); setIsOpen(false); }}
//                     className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-on-primary text-[13px] font-bold rounded-xl hover:bg-primary-dark transition-all shadow-sm"
//                   >
//                     <LayoutDashboard size={14} />
//                     Go to Dashboard
//                   </button>
//                   <button
//                     onClick={() => { handleLogout(); setIsOpen(false); }}
//                     className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-bold text-error rounded-xl border border-error/25 hover:bg-error/8 transition-all"
//                   >
//                     <LogOut size={14} />
//                     Sign Out
//                   </button>
//                 </div>
//               ) : (
//                 <div className="flex flex-col gap-2">
//                   <NavLink to="/login" onClick={() => setIsOpen(false)}>
//                     <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-text-primary border border-border-light dark:border-border-dark rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
//                       <LogIn size={14} />
//                       Login
//                     </button>
//                   </NavLink>
//                   <NavLink to="/signup" onClick={() => setIsOpen(false)}>
//                     <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-bold text-on-primary bg-primary hover:bg-primary-dark rounded-xl transition-all shadow-sm">
//                       <UserPlus size={14} />
//                       Sign up
//                     </button>
//                   </NavLink>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </nav>
//     </>
//   );
// };

// export default Navbar;
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
  ArrowRight,
  MessageCircle,
  LayoutDashboard
} from 'lucide-react';
import Heading from '../Common/Heading';
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

    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === null) loadUser();
    };

    const handleAvatarUpdated = (e) => {
      if (e.detail && e.detail.user) setUser(e.detail.user);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('avatarUpdated', handleAvatarUpdated);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('avatarUpdated', handleAvatarUpdated);
    };
  }, []);

  useEffect(() => {
    const fetchUserStats = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (!token || !userData) return;

      try {
        setLoadingStats(true);
        const parsedUser = JSON.parse(userData);
        const apiBase = process.env.REACT_APP_API_BASE_URL || 'https://zarrin-blogs-backend.onrender.com';
        const apiUrl = apiBase.includes('/api') ? apiBase : `${apiBase}/api`;
        const response = await fetch(`${apiUrl}/users/${parsedUser._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setUserStats({
            totalBlogs: data.totalBlogs || 0,
            followers: data.followers?.length || 0,
            following: data.following?.length || 0
          });
          if (data.avatar && data.avatar !== user?.avatar) {
            setUser(prev => ({ ...prev, avatar: data.avatar }));
          }
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    if (isLoggedIn) {
      fetchUserStats();
      const interval = setInterval(fetchUserStats, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, location.pathname, user]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (userData) {
      try { setUser(JSON.parse(userData)); }
      catch (e) { console.error('Failed to parse user data:', e); }
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
    { name: "Web Development", count: "2.3K articles", icon: "💻" },
    { name: "UI/UX Design", count: "1.8K articles", icon: "🎨" },
    { name: "AI & Machine Learning", count: "1.5K articles", icon: "🤖" },
    { name: "Mobile Development", count: "1.2K articles", icon: "📱" }
  ];

  const quickLinks = [
    { title: "Getting Started", desc: "New to blogging?" },
    { title: "Writing Guide", desc: "Tips for great content" },
    { title: "Community Guidelines", desc: "Our community rules" },
    { title: "Success Stories", desc: "Inspiring journeys" }
  ];

  const StatPill = ({ value, label, color }) => (
    <div className="flex-1 flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-border-light/30 dark:border-border-dark/30 min-w-0">
      <span className={`text-sm font-bold ${color} leading-none`}>
        {loadingStats ? <span className="inline-block w-3 h-1 bg-current rounded animate-pulse opacity-40" /> : value}
      </span>
      <span className="text-[10px] uppercase tracking-wide font-semibold text-text-secondary truncate w-full text-center">{label}</span>
    </div>
  );

  return (
    <>
      <nav className="sticky top-0 z-50 bg-surface-primary/90 dark:bg-surface-dark/90 backdrop-blur-2xl border-b border-border-light/30 dark:border-border-dark/30">

        {/* Top accent line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[60px] flex items-center justify-between gap-4">

            {/* ── Logo ── */}
            <NavLink to="/" className="flex items-center gap-3 shrink-0 group">
              <div className="relative w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-md group-hover:shadow-primary/40 group-hover:shadow-lg transition-all duration-300">
                <span className="text-on-primary font-bold text-base tracking-tight">Z</span>
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-[15px] font-bold text-primary tracking-tight">Zarrin</span>
                <span className="text-[10px] text-text-secondary font-medium tracking-widest uppercase">Blogs</span>
              </div>
            </NavLink>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ name, path, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <div key={path} className="relative group">
                    <NavLink to={path}>
                      <button className={`relative flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-lg tracking-wide transition-all duration-200 ${
                        isActive
                          ? 'text-primary bg-primary/10 dark:bg-primary/15'
                          : 'text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}>
                        <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                        {name}
                        {isActive && (
                          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[1px] w-5 h-0.5 rounded-full bg-primary" />
                        )}
                      </button>
                    </NavLink>

                    {/* Blog Mega Menu */}
                    {name === 'Blog' && (
                      <div className="absolute top-full left-0 mt-3 w-[480px] bg-surface-primary dark:bg-surface-dark border border-border-light/60 dark:border-border-dark/60 shadow-xl shadow-black/10 dark:shadow-black/30 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50 translate-y-1 group-hover:translate-y-0">
                        {/* Menu Header */}
                        <div className="px-6 py-5 border-b border-border-light/50 dark:border-border-dark/50 bg-neutral-50/60 dark:bg-neutral-900/60">
                          <p className="text-[11px] uppercase tracking-widest font-bold text-text-secondary">Explore</p>
                          <p className="text-base font-bold text-text-primary mt-0.5">Discover what's trending</p>
                        </div>

                        <div className="grid grid-cols-2 gap-0 divide-x divide-border-light/40 dark:divide-border-dark/40">
                          {/* Trending Topics */}
                          <div className="p-5">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-text-secondary flex items-center gap-1.5 mb-3">
                              <TrendingUp size={10} className="text-primary" />
                              Trending
                            </p>
                            <div className="space-y-1">
                              {trendingTopics.slice(0, 2).map((topic) => (
                                <button
                                  key={topic.name}
                                  onClick={() => navigate('/blog')}
                                  className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/8 dark:hover:bg-primary/12 transition-colors group/t"
                                >
                                  <span className="text-xl">{topic.icon}</span>
                                  <div>
                                    <p className="text-[13px] font-semibold text-text-primary group-hover/t:text-primary transition-colors leading-tight">{topic.name}</p>
                                    <p className="text-[11px] text-text-secondary mt-0.5">{topic.count}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Quick Help */}
                          <div className="p-5">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-text-secondary flex items-center gap-1.5 mb-3">
                              <Sparkles size={10} className="text-secondary" />
                              Quick Help
                            </p>
                            <div className="space-y-1">
                              {quickLinks.slice(0, 3).map((link) => (
                                <button
                                  key={link.title}
                                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-secondary/8 dark:hover:bg-secondary/12 transition-colors group/q"
                                >
                                  <p className="text-[13px] font-semibold text-text-primary group-hover/q:text-secondary transition-colors leading-tight">{link.title}</p>
                                  <p className="text-[11px] text-text-secondary mt-0.5">{link.desc}</p>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Menu Footer */}
                        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border-light/50 dark:border-border-dark/50 bg-neutral-50/60 dark:bg-neutral-900/60">
                          <p className="text-[12px] text-text-secondary font-medium">All articles →</p>
                          <button
                            onClick={() => navigate('/blog')}
                            className="flex items-center gap-1.5 px-4 py-1.5 bg-primary hover:bg-primary-dark text-on-primary text-[12px] font-bold rounded-lg shadow-sm hover:shadow-md transition-all"
                          >
                            <BookOpen size={12} />
                            Browse All
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-1.5">

              {/* Search Toggle */}
              <div className={`hidden md:flex items-center transition-all duration-300 ${showSearch ? 'w-56' : 'w-8'}`}>
                {showSearch ? (
                  <div className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-border-light dark:border-border-dark text-[13px]">
                    <Search size={13} className="text-text-secondary shrink-0" />
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearch}
                      onBlur={() => { if (!searchQuery) setShowSearch(false); }}
                      className="bg-transparent flex-1 outline-none text-text-primary placeholder-text-secondary/60 min-w-0"
                    />
                    <button onClick={() => { setShowSearch(false); setSearchQuery(''); }}>
                      <X size={12} className="text-text-secondary hover:text-text-primary transition-colors" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                    title="Search"
                  >
                    <Search size={16} />
                  </button>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                title="Toggle theme"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {isLoggedIn ? (
                <>
                  {/* Bookmarks */}
                  <NavLink
                    to="/bookmarks"
                    className="hidden sm:flex p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                    title="Bookmarks"
                  >
                    <Bookmark size={16} />
                  </NavLink>

                  {/* Chat */}
                  <NavLink
                    to="/chat"
                    className="hidden sm:flex p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                    title="Chat"
                  >
                    <MessageCircle size={16} />
                  </NavLink>

                  {/* Notifications */}
                  <NavLink
                    to="/notifications"
                    className="hidden sm:flex p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all relative"
                    title="Notifications"
                  >
                    <Bell size={16} />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error rounded-full" />
                  </NavLink>

                  {/* Divider */}
                  <div className="hidden sm:block w-px h-5 bg-border-light dark:bg-border-dark mx-1" />

                  {/* User Avatar Dropdown */}
                  <div className="relative group">
                    <button className="hidden sm:flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all border border-transparent hover:border-border-light dark:hover:border-border-dark">
                      <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-on-primary font-bold text-xs overflow-hidden border border-white/30 dark:border-slate-600 shadow-sm">
                        {user?.avatar
                          ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          : user?.name?.[0]?.toUpperCase() || <User size={13} />
                        }
                      </div>
                      <span className="text-[13px] font-semibold text-text-primary hidden lg:block max-w-[100px] truncate">
                        {user?.name?.split(' ')[0] || 'User'}
                      </span>
                      <ChevronDown size={12} className="text-text-secondary group-hover:rotate-180 transition-transform duration-200" />
                    </button>

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2.5 w-72 bg-surface-primary dark:bg-surface-dark border border-border-light/60 dark:border-border-dark/60 shadow-xl shadow-black/10 dark:shadow-black/30 rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0 transition-all duration-200 overflow-hidden z-50">

                      {/* Profile Section */}
                      <div className="p-5 border-b border-border-light/50 dark:border-border-dark/50">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-base overflow-hidden shadow-sm border border-white/20 dark:border-slate-600 shrink-0">
                            {user?.avatar
                              ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                              : user?.name?.[0]?.toUpperCase() || 'U'
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-bold text-text-primary truncate leading-tight">{user?.name || 'User'}</p>
                            <p className="text-[11px] text-text-secondary truncate mt-0.5">{user?.email || 'user@email.com'}</p>
                            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-primary/10 dark:bg-primary/20 text-primary text-[10px] font-bold rounded-md tracking-wide uppercase">
                              Pro Member
                            </span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-2 mt-4 w-full">
                          <StatPill value={userStats.totalBlogs} label="Articles" color="text-primary" />
                          <StatPill value={userStats.followers} label="Followers" color="text-secondary" />
                          <StatPill value={userStats.following} label="Following" color="text-accent" />
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2 space-y-0.5">
                        {[
                          { to: '/dashboard/analytics', icon: LayoutDashboard, label: 'Dashboard', desc: 'Analytics & overview', color: 'text-primary', bg: 'hover:bg-primary/8 dark:hover:bg-primary/12' },
                          { to: '/dashboard/myblogs', icon: BookOpen, label: 'My Blogs', desc: 'Manage your articles', color: 'text-secondary', bg: 'hover:bg-secondary/8 dark:hover:bg-secondary/12' },
                          { to: '/settings', icon: Settings, label: 'Settings', desc: 'Account preferences', color: 'text-accent', bg: 'hover:bg-accent/8 dark:hover:bg-accent/12' },
                        ].map(({ to, icon: Icon, label, desc, color, bg }) => (
                          <NavLink
                            key={to}
                            to={to}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${bg} transition-all group/item`}
                          >
                            <div className={`w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform`}>
                              <Icon size={15} className={color} />
                            </div>
                            <div>
                              <p className={`text-[13px] font-semibold text-text-primary group-hover/item:${color} transition-colors leading-tight`}>{label}</p>
                              <p className="text-[11px] text-text-secondary">{desc}</p>
                            </div>
                          </NavLink>
                        ))}
                      </div>

                      {/* Logout */}
                      <div className="p-2 pt-0 border-t border-border-light/50 dark:border-border-dark/50 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-error hover:bg-error/8 dark:hover:bg-error/12 rounded-xl transition-all group/out"
                        >
                          <div className="w-8 h-8 rounded-lg bg-error/10 dark:bg-error/15 flex items-center justify-center shrink-0 group-hover/out:scale-105 transition-transform">
                            <LogOut size={14} className="text-error" />
                          </div>
                          <p className="text-[13px] font-semibold">Sign Out</p>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Logout */}
                  <button
                    onClick={handleLogout}
                    className="md:hidden p-2 rounded-lg text-error hover:bg-error/10 transition-all"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <NavLink to="/login">
                    <button className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold text-text-primary hover:text-primary border border-border-light dark:border-border-dark hover:border-primary/50 rounded-lg hover:bg-primary/5 transition-all">
                      <LogIn size={13} />
                      Login
                    </button>
                  </NavLink>
                  <NavLink to="/signup">
                    <button className="flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-bold text-on-primary bg-primary hover:bg-primary-dark rounded-lg shadow-sm hover:shadow-md transition-all">
                      <UserPlus size={13} />
                      Sign up
                    </button>
                  </NavLink>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
              >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {isOpen && (
          <div className="md:hidden border-t border-border-light/40 dark:border-border-dark/40 bg-surface-primary dark:bg-surface-dark">
            <div className="px-4 py-5 space-y-1.5">

              {/* Mobile Search */}
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-transparent focus-within:border-primary/40 transition-all mb-4">
                <Search size={14} className="text-text-secondary shrink-0" />
                <input
                  type="text"
                  placeholder="Search articles…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="bg-transparent flex-1 outline-none text-[13px] text-text-primary placeholder-text-secondary/60"
                />
              </div>

              {/* Nav Links */}
              {navLinks.map(({ name, path, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                      isActive
                        ? 'bg-primary/10 dark:bg-primary/15 text-primary'
                        : 'text-text-secondary hover:text-text-primary hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                    {name}
                  </NavLink>
                );
              })}

              <div className="border-t border-border-light/40 dark:border-border-dark/40 my-3 pt-1" />

              {/* Mobile Auth */}
              {isLoggedIn ? (
                <div className="space-y-2">
                  {user && (
                    <div className="px-4 py-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-border-light/50 dark:border-border-dark/50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold text-sm overflow-hidden shrink-0">
                          {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-text-primary">{user.name}</p>
                          <p className="text-[11px] text-text-secondary">{userStats.totalBlogs} articles · {userStats.followers} followers</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => { navigate('/dashboard/analytics'); setIsOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-on-primary text-[13px] font-bold rounded-xl hover:bg-primary-dark transition-all shadow-sm"
                  >
                    <LayoutDashboard size={14} />
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-bold text-error rounded-xl border border-error/25 hover:bg-error/8 transition-all"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <NavLink to="/login" onClick={() => setIsOpen(false)}>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-text-primary border border-border-light dark:border-border-dark rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
                      <LogIn size={14} />
                      Login
                    </button>
                  </NavLink>
                  <NavLink to="/signup" onClick={() => setIsOpen(false)}>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-bold text-on-primary bg-primary hover:bg-primary-dark rounded-xl transition-all shadow-sm">
                      <UserPlus size={14} />
                      Sign up
                    </button>
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