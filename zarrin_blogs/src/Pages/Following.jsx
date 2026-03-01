// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Users, ArrowLeft, Mail, FileText, UserPlus, UserCheck, Star, BookOpen } from 'lucide-react';
// import Paragraph from '../Component/Common/Paragraph';
// import Alert from '../Component/Common/Alert';
// import { getApiUrl } from '../utils/apiConfig';

// const Following = () => {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [following, setFollowing] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState(null);
//   const [followingMap, setFollowingMap] = useState({});
//   const [userName, setUserName] = useState('');

//   const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
//   const loggedInUser = useMemo(() => (storedUser && Object.keys(storedUser).length > 0) ? storedUser : {}, [storedUser]);
//   const token = localStorage.getItem('token');
  
//   const getUserId = (user) => user?._id || user?.id;

//   const fetchFollowing = useCallback(async () => {
//     try {
//       setLoading(true);
//       console.log('🔍 DEBUG: fetchFollowing called');
//       console.log('userId from useParams:', userId);
//       console.log('Type of userId:', typeof userId);
//       console.log('Full URL will be:', getApiUrl(`/api/users/${userId}`));

//       const res = await fetch(getApiUrl(`/api/users/${userId}`), {
//         credentials: 'include'
//       });
//       console.log('API Response Status:', res.status, res.statusText);
//       if (!res.ok) throw new Error('Failed to fetch user');
//       const userData = await res.json();
//       console.log('User data received:', userData);
      
//       setUserName(userData.name);
      
//       // API returns fully populated following array - use it directly!
//       if (userData.following && Array.isArray(userData.following)) {
//         setFollowing(userData.following);
        
//         // Build following map from logged-in user's following list
//         const followMap = {};
//         if (token && loggedInUser?.following) {
//           userData.following.forEach(followedUser => {
//             const followedUserId = getUserId(followedUser);
//             followMap[followedUserId] = loggedInUser.following.some(f => getUserId(f) === followedUserId);
//           });
//         }
//         setFollowingMap(followMap);
//       } else {
//         setFollowing([]);
//       }
//     } catch (err) {
//       console.error('Error fetching following:', err);
//       setAlert({ type: 'error', message: 'Failed to load following list: ' + err.message });
//     } finally {
//       setLoading(false);
//     }
//   }, [userId, token, loggedInUser.following]);

//   useEffect(() => {
//     console.log('🔍 Following useEffect triggered');
//     console.log('userId from useParams():', userId);
//     console.log('typeof userId:', typeof userId);
    
//     if (userId && userId !== 'undefined') {
//       console.log('✅ Valid userId, calling fetchFollowing');
//       fetchFollowing();
//     } else {
//       console.warn('❌ Invalid userId:', userId);
//       setLoading(false);
//     }
//   }, [userId, fetchFollowing]);

//   const handleFollowToggle = async (userId) => {
//     if (!token) {
//       setAlert({ type: 'warning', message: 'Please log in to follow users' });
//       return;
//     }

//     try {
//       const isCurrentlyFollowing = followingMap[userId];
//       const method = isCurrentlyFollowing ? 'DELETE' : 'POST';
//       const res = await fetch(getApiUrl(`/api/users/${userId}/follow`), {
//         method,
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         credentials: 'include' // CRITICAL: include cookies for production CORS
//       });

//       // Parse error response properly
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || `Failed to update follow status (${res.status})`);
//       }
      
//       // Update followingMap state
//       setFollowingMap(prev => ({
//         ...prev,
//         [userId]: !prev[userId]
//       }));
      
//       // Update the followed user object to reflect changes (professional approach)
//       setFollowing(prevFollowing => 
//         prevFollowing.map(followedUser => {
//           if (followedUser._id === userId) {
//             return {
//               ...followedUser,
//               followers: isCurrentlyFollowing 
//                 ? followedUser.followers.filter(f => f._id !== loggedInUser._id)
//                 : [...(followedUser.followers || []), { _id: loggedInUser._id }]
//             };
//           }
//           return followedUser;
//         })
//       );
      
//       setAlert({
//         type: 'success',
//         message: isCurrentlyFollowing ? 'Unfollowed successfully' : 'Followed successfully'
//       });
//     } catch (err) {
//       console.error('❌ Follow toggle error:', err);
//       setAlert({ type: 'error', message: err.message });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-slate-700 border-t-blue-600 mb-4"></div>
//           <Paragraph className="text-gray-600 dark:text-gray-400 text-lg">Loading following list...</Paragraph>
//         </div>
//       </div>
//     );
//   }

//   if (!userId || userId === 'undefined') {
//     return (
//       <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
//         <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
//           <Users size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
//           <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">Invalid or missing user ID</p>
//           <button 
//             onClick={() => navigate('/')} 
//             className="px-6 py-3 bg-primary hover:bg-primary-dark text-on-primary font-semibold rounded-lg transition-all transform hover:scale-105"
//           >
//             Go Back to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white dark:bg-slate-950">
//       {/* Hero Header */}
//       <div className="relative overflow-hidden bg-primary dark:bg-primary-dark text-white py-20 sm:py-32">
//         {/* Animated Background */}
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//           <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//           <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 mb-8 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm border border-white/20 text-white transition-all transform hover:scale-105"
//           >
//             <ArrowLeft size={18} />
//             Go Back
//           </button>
//           <div className="flex items-center gap-4 mb-6">
//             <div className="p-3 bg-secondary dark:bg-secondary-dark rounded-xl shadow-lg">
//               <Star size={32} className="text-white" />
//             </div>
//             <div>
//               <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2">
//                 Following
//               </h1>
//               {userName && (
//                 <p className="text-gray-300 text-lg">
//                   Amazing creators {userName} follows
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Alert */}
//       {alert && (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
//           <Alert
//             message={alert.message}
//             type={alert.type}
//             onClose={() => setAlert(null)}
//             duration={4000}
//           />
//         </div>
//       )}

//       {/* Following List */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         {following.length > 0 ? (
//           <>
//             <div className="mb-8">
//               <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full border border-purple-200 dark:border-purple-800">
//                 <Star size={16} className="text-purple-600 dark:text-purple-400" />
//                 <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
//                   Following {following.length} {following.length === 1 ? 'creator' : 'creators'}
//                 </span>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {following.map((followedUser) => (
//                 <div
//                   key={followedUser._id}
//                   className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700 transform hover:scale-105 hover:-translate-y-2"
//                 >
//                   {/* Avatar Section with Gradient Background */}
//                   <div className="relative h-40 bg-accent dark:bg-accent-dark overflow-hidden flex items-center justify-center">
//                     {followedUser.avatar ? (
//                       <img src={followedUser.avatar} alt={followedUser.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
//                     ) : (
//                       <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40">
//                         <Users size={56} className="text-white" />
//                       </div>
//                     )}
//                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   </div>

//                   {/* Content */}
//                   <div className="p-6 text-center space-y-4">
//                     <div>
//                       <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
//                         {followedUser.name}
//                       </h3>
//                       <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-3">
//                         <Mail size={14} />
//                         <span className="truncate">{followedUser.email}</span>
//                       </div>
//                     </div>

//                     {/* Bio */}
//                     {followedUser.bio && (
//                       <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 italic">
//                         "{followedUser.bio}"
//                       </p>
//                     )}

//                     {/* Stats */}
//                     <div className="flex gap-4 justify-center py-4 border-y border-gray-200 dark:border-slate-700">
//                       <div>
//                         <p className="text-2xl font-bold text-primary">
//                           {followedUser.totalBlogs || 0}
//                         </p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold flex items-center justify-center gap-1 mt-1">
//                           <BookOpen size={12} />
//                           Articles
//                         </p>
//                       </div>
//                       <div className="border-l border-gray-300 dark:border-slate-600"></div>
//                       <div>
//                         <p className="text-2xl font-bold text-secondary">
//                           {followedUser.followers?.length || 0}
//                         </p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold flex items-center justify-center gap-1 mt-1">
//                           <Star size={12} />
//                           Followers
//                         </p>
//                       </div>
//                       <div className="border-l border-gray-300 dark:border-slate-600"></div>
//                       <div>
//                         <p className="text-2xl font-bold text-accent">
//                           {followedUser.following?.length || 0}
//                         </p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold flex items-center justify-center gap-1 mt-1">
//                           <Users size={12} />
//                           Following
//                         </p>
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex gap-3 pt-2">
//                       <button
//                         onClick={() => navigate(`/profile/${followedUser._id}`)}
//                         className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-dark text-on-primary rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
//                       >
//                         <FileText size={16} />
//                         View
//                       </button>
//                       {loggedInUser._id !== followedUser._id && (
//                         <button
//                           onClick={() => handleFollowToggle(followedUser._id)}
//                           className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm shadow-md transform hover:scale-105 transition-all ${
//                             followingMap[followedUser._id]
//                               ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'
//                               : 'bg-success hover:bg-success-dark text-on-success'
//                           }`}
//                         >
//                           {followingMap[followedUser._id] ? (
//                             <>
//                               <UserCheck size={16} />
//                               Following
//                             </>
//                           ) : (
//                             <>
//                               <UserPlus size={16} />
//                               Follow
//                             </>
//                           )}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <div className="bg-surface-primary dark:bg-surface-dark rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-600 p-16 text-center">
//             <Users size={64} className="mx-auto text-gray-300 dark:text-slate-600 mb-6" />
//             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
//               Not following anyone yet
//             </h2>
//             <p className="text-gray-600 dark:text-gray-400 text-lg">
//               Start following amazing creators to discover new content!
//             </p>
//           </div>
//         )}
//       </div>

//       <style>{`
//         @keyframes blob {
//           0%, 100% {
//             transform: translate(0, 0) scale(1);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//         }
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Following;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Mail, FileText, UserPlus, UserCheck, Star, BookOpen, Sparkles, Search, Heart } from 'lucide-react';
import Paragraph from '../Component/Common/Paragraph';
import Alert from '../Component/Common/Alert';
import { getApiUrl } from '../utils/apiConfig';

const Following = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [followingMap, setFollowingMap] = useState({});
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const loggedInUser = useMemo(() => (storedUser && Object.keys(storedUser).length > 0) ? storedUser : {}, [storedUser]);
  const token = localStorage.getItem('token');
  const getUserId = (user) => user?._id || user?.id;

  /* ── EXISTING fetchFollowing — preserved exactly ── */
  const fetchFollowing = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 DEBUG: fetchFollowing called');
      console.log('userId from useParams:', userId);
      console.log('Type of userId:', typeof userId);
      console.log('Full URL will be:', getApiUrl(`/api/users/${userId}`));
      const res = await fetch(getApiUrl(`/api/users/${userId}`), { credentials: 'include' });
      console.log('API Response Status:', res.status, res.statusText);
      if (!res.ok) throw new Error('Failed to fetch user');
      const userData = await res.json();
      console.log('User data received:', userData);
      setUserName(userData.name);
      if (userData.following && Array.isArray(userData.following)) {
        setFollowing(userData.following);
        const followMap = {};
        if (token && loggedInUser?.following) {
          userData.following.forEach(followedUser => {
            const followedUserId = getUserId(followedUser);
            followMap[followedUserId] = loggedInUser.following.some(f => getUserId(f) === followedUserId);
          });
        }
        setFollowingMap(followMap);
      } else {
        setFollowing([]);
      }
    } catch (err) {
      console.error('Error fetching following:', err);
      setAlert({ type: 'error', message: 'Failed to load following list: ' + err.message });
    } finally {
      setLoading(false);
    }
  }, [userId, token, loggedInUser.following]);

  useEffect(() => {
    console.log('🔍 Following useEffect triggered');
    console.log('userId from useParams():', userId);
    console.log('typeof userId:', typeof userId);
    if (userId && userId !== 'undefined') {
      console.log('✅ Valid userId, calling fetchFollowing');
      fetchFollowing();
    } else {
      console.warn('❌ Invalid userId:', userId);
      setLoading(false);
    }
  }, [userId, fetchFollowing]);

  /* ── EXISTING handleFollowToggle — preserved exactly ── */
  const handleFollowToggle = async (userId) => {
    if (!token) { setAlert({ type: 'warning', message: 'Please log in to follow users' }); return; }
    try {
      const isCurrentlyFollowing = followingMap[userId];
      const method = isCurrentlyFollowing ? 'DELETE' : 'POST';
      const res = await fetch(getApiUrl(`/api/users/${userId}/follow`), {
        method,
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include'
      });
      if (!res.ok) { const errorData = await res.json(); throw new Error(errorData.message || `Failed to update follow status (${res.status})`); }
      setFollowingMap(prev => ({ ...prev, [userId]: !prev[userId] }));
      setFollowing(prevFollowing =>
        prevFollowing.map(followedUser => {
          if (followedUser._id === userId) {
            return {
              ...followedUser,
              followers: isCurrentlyFollowing
                ? followedUser.followers.filter(f => f._id !== loggedInUser._id)
                : [...(followedUser.followers || []), { _id: loggedInUser._id }]
            };
          }
          return followedUser;
        })
      );
      setAlert({ type: 'success', message: isCurrentlyFollowing ? 'Unfollowed successfully' : 'Followed successfully' });
    } catch (err) {
      console.error('❌ Follow toggle error:', err);
      setAlert({ type: 'error', message: err.message });
    }
  };

  const filtered = following.filter(f =>
    !searchQuery ||
    f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="zfw-root zfw-center">
        <div className="zfw-spinner" />
        <Paragraph className="zfw-load-txt">Loading following list…</Paragraph>
        <div className="zfw-sk-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="zfw-sk-card">
              <div className="zfw-sk-hd" />
              <div className="zfw-sk-bd">
                <div className="zfw-sk-l zfw-sk-s" /><div className="zfw-sk-l" /><div className="zfw-sk-l zfw-sk-m" />
              </div>
            </div>
          ))}
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  /* ── INVALID USER ── */
  if (!userId || userId === 'undefined') {
    return (
      <div className="zfw-root zfw-center">
        <div className="zfw-err-card">
          <Users size={48} className="zfw-err-icon" />
          <h3 className="zfw-err-title">Invalid User</h3>
          <p className="zfw-err-desc">Invalid or missing user ID</p>
          <button onClick={() => navigate('/')} className="zfw-err-btn">Go Back to Home</button>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="zfw-root">
      {/* HERO */}
      <section className="zfw-hero">
        <div className="zfw-hero-grid" />
        <div className="zfw-orb zfw-o1" /><div className="zfw-orb zfw-o2" /><div className="zfw-orb zfw-o3" />
        <div className="zfw-hero-inner">
          <button onClick={() => navigate(-1)} className="zfw-back-btn"><ArrowLeft size={15} />Go Back</button>
          <div className="zfw-hero-content">
            <div className="zfw-hero-icon"><Star size={26} color="#fff" /></div>
            <div>
              <div className="zfw-eyebrow"><Sparkles size={12} />Community</div>
              <h1 className="zfw-hero-h1">Following</h1>
              {userName && <p className="zfw-hero-sub">Amazing creators <em>{userName}</em> follows</p>}
            </div>
          </div>
          <div className="zfw-hero-pills">
            <div className="zfw-pill"><Star size={12} className="zfw-pi" /><span className="zfw-pv">{following.length}</span><span className="zfw-pl">Following</span></div>
            <div className="zfw-pill"><Heart size={12} className="zfw-pi" /><span className="zfw-pv">{following.filter(f => followingMap[f._id]).length}</span><span className="zfw-pl">Mutual</span></div>
          </div>
        </div>
        <div className="zfw-wave"><svg viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none"><path d="M0 32 Q360 64 720 32 Q1080 0 1440 32 L1440 64 L0 64 Z" fill="var(--color-surface-secondary,#F5F5F5)" /></svg></div>
      </section>

      {/* MAIN */}
      <div className="zfw-main">
        <div className="zfw-main-inner">
          {alert && <div className="zfw-alert-wrap"><Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} duration={4000} /></div>}

          {following.length > 0 && (
            <div className="zfw-toolbar">
              <div className="zfw-sw"><Search size={14} className="zfw-si" /><input type="text" placeholder="Search following…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="zfw-search" /></div>
              <div className="zfw-count-pill"><Star size={13} />Following {following.length} {following.length === 1 ? 'creator' : 'creators'}</div>
            </div>
          )}

          {following.length > 0 ? (
            filtered.length > 0 ? (
              <div className="zfw-grid">
                {filtered.map((followedUser, idx) => (
                  <UserCard key={followedUser._id} user={followedUser} idx={idx}
                    isFollowing={followingMap[followedUser._id]}
                    isSelf={loggedInUser._id === followedUser._id}
                    onView={() => navigate(`/profile/${followedUser._id}`)}
                    onFollow={() => handleFollowToggle(followedUser._id)} />
                ))}
              </div>
            ) : (
              <div className="zfw-no-res">
                <Search size={36} className="zfw-nr-icon" />
                <p className="zfw-nr-txt">No results match "<strong>{searchQuery}</strong>"</p>
                <button onClick={() => setSearchQuery('')} className="zfw-nr-btn">Clear search</button>
              </div>
            )
          ) : (
            <div className="zfw-empty">
              <Users size={56} className="zfw-empty-icon" />
              <h3 className="zfw-empty-title">Not following anyone yet</h3>
              <p className="zfw-empty-desc">Start following amazing creators to discover new content!</p>
              <button onClick={() => navigate('/blog')} className="zfw-empty-btn"><Sparkles size={15} />Discover Writers</button>
            </div>
          )}
        </div>
      </div>
      <style>{styles}</style>
    </div>
  );
};

/* ── SHARED USER CARD (same as Followers) ── */
const UserCard = ({ user, idx, isFollowing, isSelf, onView, onFollow }) => {
  const accents = [
    'var(--color-accent,#7040CC)',
    'var(--color-primary,#2B64D4)',
    'var(--color-secondary,#1E8A56)',
    'var(--color-warning,#C49A3C)',
  ];
  const accent = accents[idx % accents.length];
  return (
    <article className="zfw-card" style={{ '--ca': accent, animationDelay: `${idx * 0.05}s` }}>
      <div className="zfw-card-topbar" />
      <div className="zfw-card-hd" style={{ background: `linear-gradient(135deg,var(--ca),rgba(0,0,0,0.55))` }}>
        {user.avatar
          ? <img src={user.avatar} alt={user.name} className="zfw-card-img" />
          : <div className="zfw-card-av">{user.name?.charAt(0).toUpperCase()}</div>}
        <div className="zfw-card-hd-ov" />
      </div>
      <div className="zfw-card-body">
        <h3 className="zfw-card-name">{user.name}</h3>
        <div className="zfw-card-email"><Mail size={11} /><span>{user.email}</span></div>
        {user.bio && <p className="zfw-card-bio">"{user.bio}"</p>}
        <div className="zfw-card-stats">
          <div className="zfw-cs"><span className="zfw-cs-v">{user.totalBlogs || 0}</span><span className="zfw-cs-l"><BookOpen size={9} />Articles</span></div>
          <div className="zfw-cs-div" />
          <div className="zfw-cs"><span className="zfw-cs-v">{user.followers?.length || 0}</span><span className="zfw-cs-l"><Star size={9} />Followers</span></div>
          <div className="zfw-cs-div" />
          <div className="zfw-cs"><span className="zfw-cs-v">{user.following?.length || 0}</span><span className="zfw-cs-l"><Users size={9} />Following</span></div>
        </div>
        <div className="zfw-card-actions">
          <button onClick={onView} className="zfw-view-btn" style={{ background: 'var(--ca)' }}><FileText size={13} />View Profile</button>
          {!isSelf && (
            <button onClick={onFollow} className={`zfw-follow-btn ${isFollowing ? 'zfw-fon' : ''}`}>
              {isFollowing ? <><UserCheck size={13} />Following</> : <><UserPlus size={13} />Follow</>}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .zfw-root { font-family: 'Outfit', sans-serif; background: var(--color-surface-secondary,#F5F5F5); color: var(--color-text-primary,#111); min-height: 100vh; overflow-x: hidden; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);} }
  @keyframes drift { 0%,100%{transform:translate(0,0)scale(1);}40%{transform:translate(20px,-26px)scale(1.06);}70%{transform:translate(-14px,16px)scale(0.96);} }
  @keyframes spin { to{transform:rotate(360deg);} }
  @keyframes shimmer { 0%{background-position:-400px 0;}100%{background-position:400px 0;} }
  @keyframes blob { 0%,100%{transform:translate(0,0)scale(1);}33%{transform:translate(30px,-40px)scale(1.1);}66%{transform:translate(-20px,20px)scale(0.9);} }
  .animate-blob{animation:blob 8s infinite;} .animation-delay-2000{animation-delay:2s;} .animation-delay-4000{animation-delay:4s;}

  .zfw-center { display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:72px 24px;gap:20px; }
  .zfw-spinner { width:44px;height:44px;border:3px solid rgba(112,64,204,0.15);border-top-color:var(--color-accent,#7040CC);border-radius:50%;animation:spin 0.7s linear infinite; }
  .zfw-load-txt { font-size:15px;color:var(--color-text-secondary,#4A4A48); }
  .zfw-sk-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:18px;width:100%;max-width:1100px;margin-top:8px; }
  @media(max-width:900px){.zfw-sk-grid{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:560px){.zfw-sk-grid{grid-template-columns:1fr;}}
  .zfw-sk-card { background:var(--color-surface-primary,#fff);border-radius:18px;overflow:hidden;border:1px solid var(--color-border-light,#EEE); }
  .zfw-sk-hd { height:140px;background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:400px 100%;animation:shimmer 1.4s infinite; }
  .zfw-sk-bd { padding:18px;display:flex;flex-direction:column;gap:10px; }
  .zfw-sk-l { height:11px;border-radius:6px;background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:400px 100%;animation:shimmer 1.4s infinite; }
  .zfw-sk-s{width:40%;} .zfw-sk-m{width:65%;}

  .zfw-err-card { text-align:center;background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-light,#EEE);border-radius:22px;padding:56px 40px;box-shadow:0 8px 32px rgba(26,24,22,0.09); }
  .zfw-err-icon{color:var(--color-border-default,#E0E0E0);margin:0 auto 18px;display:block;}
  .zfw-err-title{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:800;color:var(--color-text-primary,#111);margin-bottom:8px;}
  .zfw-err-desc{font-size:14px;color:var(--color-text-secondary,#4A4A48);margin-bottom:24px;}
  .zfw-err-btn{padding:12px 28px;background:var(--color-primary,#2B64D4);color:#fff;border:none;border-radius:10px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:transform 0.15s;}
  .zfw-err-btn:hover{transform:translateY(-1px);}

  .zfw-hero { position:relative;overflow:hidden;background:linear-gradient(148deg,var(--color-primary-dark,#1A3F8A) 0%,var(--color-primary,#2B64D4) 55%,#2468d4 100%);padding:72px 24px 96px; }
  .zfw-hero-grid { position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px);background-size:52px 52px; }
  .zfw-orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;}
  .zfw-o1{width:320px;height:320px;top:-80px;left:-60px;background:rgba(255,255,255,0.07);animation:drift 11s ease-in-out infinite;}
  .zfw-o2{width:240px;height:240px;bottom:-20px;right:-50px;background:rgba(112,64,204,0.18);animation:drift 9s ease-in-out infinite reverse;}
  .zfw-o3{width:180px;height:180px;top:40%;left:60%;background:rgba(30,138,86,0.12);animation:drift 13s ease-in-out infinite 2s;}
  .zfw-hero-inner{position:relative;z-index:2;max-width:1200px;margin:0 auto;animation:fadeUp 0.7s ease both;}
  .zfw-back-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 16px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:9px;color:rgba(255,255,255,0.85);font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;cursor:pointer;backdrop-filter:blur(8px);transition:background 0.18s;margin-bottom:24px;}
  .zfw-back-btn:hover{background:rgba(255,255,255,0.18);}
  .zfw-hero-content{display:flex;align-items:flex-start;gap:16px;margin-bottom:26px;}
  .zfw-hero-icon{width:54px;height:54px;border-radius:14px;background:var(--color-accent,#7040CC);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 18px rgba(0,0,0,0.2);flex-shrink:0;}
  .zfw-eyebrow{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.85);font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;padding:5px 13px;border-radius:100px;margin-bottom:10px;}
  .zfw-hero-h1{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,5vw,4rem);font-weight:800;color:#fff;line-height:1.1;margin-bottom:8px;text-shadow:0 4px 24px rgba(0,0,0,0.2);}
  .zfw-hero-sub{font-size:15px;color:rgba(255,255,255,0.62);font-weight:300;}
  .zfw-hero-sub em{font-style:italic;color:rgba(255,255,255,0.85);}
  .zfw-hero-pills{display:flex;gap:10px;flex-wrap:wrap;}
  .zfw-pill{display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.18);padding:9px 16px;border-radius:100px;backdrop-filter:blur(8px);}
  .zfw-pi{color:rgba(255,255,255,0.5);} .zfw-pv{font-family:'Playfair Display',serif;font-size:1rem;font-weight:800;color:#fff;} .zfw-pl{font-size:11px;color:rgba(255,255,255,0.45);}
  .zfw-wave{position:absolute;bottom:-1px;left:0;right:0;height:64px;} .zfw-wave svg{width:100%;height:100%;}

  .zfw-main{padding:48px 24px 80px;} .zfw-main-inner{max-width:1200px;margin:0 auto;} .zfw-alert-wrap{margin-bottom:24px;}
  .zfw-toolbar{display:flex;align-items:center;gap:12px;margin-bottom:24px;flex-wrap:wrap;}
  .zfw-sw{position:relative;flex:1;min-width:200px;max-width:380px;}
  .zfw-si{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--color-text-muted,#B0B0AD);pointer-events:none;}
  .zfw-search{width:100%;padding:10px 14px 10px 36px;background:var(--color-surface-primary,#fff);border:1.5px solid var(--color-border-default,#E0E0E0);border-radius:10px;font-family:'Outfit',sans-serif;font-size:13px;color:var(--color-text-primary,#111);outline:none;transition:border-color 0.2s,box-shadow 0.2s;}
  .zfw-search:focus{border-color:var(--color-accent,#7040CC);box-shadow:0 0 0 4px rgba(112,64,204,0.08);}
  .zfw-count-pill{display:flex;align-items:center;gap:6px;padding:10px 16px;background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-default,#E0E0E0);border-radius:10px;font-size:12px;font-weight:600;color:var(--color-text-secondary,#4A4A48);white-space:nowrap;}

  .zfw-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
  @media(max-width:1000px){.zfw-grid{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:580px){.zfw-grid{grid-template-columns:1fr;}}

  .zfw-card{background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-light,#EEE);border-radius:18px;overflow:hidden;box-shadow:0 2px 10px rgba(26,24,22,0.06);transition:transform 0.22s,box-shadow 0.22s;animation:fadeUp 0.5s ease both;}
  .zfw-card:hover{transform:translateY(-5px);box-shadow:0 14px 36px rgba(26,24,22,0.1);}
  .zfw-card-topbar{height:3px;background:var(--ca);}
  .zfw-card-hd{position:relative;height:140px;display:flex;align-items:center;justify-content:center;overflow:hidden;}
  .zfw-card-img{width:100%;height:100%;object-fit:cover;transition:transform 0.4s;}
  .zfw-card:hover .zfw-card-img{transform:scale(1.07);}
  .zfw-card-hd-ov{position:absolute;inset:0;background:rgba(0,0,0,0.12);}
  .zfw-card-av{width:70px;height:70px;border-radius:50%;background:rgba(255,255,255,0.2);border:2px solid rgba(255,255,255,0.4);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:800;color:#fff;position:relative;z-index:1;}
  .zfw-card-body{padding:20px;display:flex;flex-direction:column;gap:10px;}
  .zfw-card-name{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:800;color:var(--color-text-primary,#111);text-align:center;transition:color 0.2s;}
  .zfw-card:hover .zfw-card-name{color:var(--ca);}
  .zfw-card-email{display:flex;align-items:center;justify-content:center;gap:5px;font-size:11px;color:var(--color-text-muted,#B0B0AD);}
  .zfw-card-email span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px;}
  .zfw-card-bio{font-size:12px;color:var(--color-text-secondary,#4A4A48);font-style:italic;text-align:center;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
  .zfw-card-stats{display:flex;align-items:center;justify-content:center;gap:14px;padding:14px 0;border-top:1px solid var(--color-border-light,#EEE);border-bottom:1px solid var(--color-border-light,#EEE);}
  .zfw-cs{text-align:center;} .zfw-cs-v{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:800;color:var(--ca);display:block;}
  .zfw-cs-l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:9px;font-weight:600;color:var(--color-text-muted,#B0B0AD);text-transform:uppercase;letter-spacing:0.05em;margin-top:2px;}
  .zfw-cs-div{width:1px;height:32px;background:var(--color-border-light,#EEE);}
  .zfw-card-actions{display:flex;gap:8px;}
  .zfw-view-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:11px;color:#fff;border:none;border-radius:9px;font-family:'Outfit',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:transform 0.15s,box-shadow 0.15s;box-shadow:0 3px 12px rgba(0,0,0,0.15);}
  .zfw-view-btn:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(0,0,0,0.2);}
  .zfw-follow-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:11px;background:var(--color-secondary,#1E8A56);color:#fff;border:none;border-radius:9px;font-family:'Outfit',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.15s;box-shadow:0 3px 12px rgba(30,138,86,0.2);}
  .zfw-follow-btn:hover{transform:translateY(-1px);}
  .zfw-fon{background:var(--color-surface-secondary,#F5F5F5)!important;color:var(--color-text-primary,#111)!important;border:1px solid var(--color-border-default,#E0E0E0);box-shadow:none!important;}

  .zfw-no-res{text-align:center;padding:64px 24px;}
  .zfw-nr-icon{color:var(--color-border-default,#E0E0E0);margin:0 auto 14px;display:block;}
  .zfw-nr-txt{font-size:14px;color:var(--color-text-secondary,#4A4A48);margin-bottom:16px;}
  .zfw-nr-btn{padding:10px 22px;background:var(--color-primary,#2B64D4);color:#fff;border:none;border-radius:9px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;cursor:pointer;}

  .zfw-empty{text-align:center;background:var(--color-surface-primary,#fff);border:2px dashed var(--color-border-default,#E0E0E0);border-radius:22px;padding:72px 32px;}
  .zfw-empty-icon{color:var(--color-border-default,#E0E0E0);margin:0 auto 20px;display:block;}
  .zfw-empty-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:800;color:var(--color-text-primary,#111);margin-bottom:10px;}
  .zfw-empty-desc{font-size:15px;color:var(--color-text-secondary,#4A4A48);line-height:1.7;max-width:420px;margin:0 auto 24px;}
  .zfw-empty-btn{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;background:linear-gradient(135deg,var(--color-primary,#2B64D4),var(--color-primary-dark,#1A3F8A));color:#fff;border:none;border-radius:10px;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 18px rgba(43,100,212,0.25);transition:transform 0.15s;}
  .zfw-empty-btn:hover{transform:translateY(-1px);}

  @media(max-width:768px){.zfw-hero{padding:56px 18px 84px;}.zfw-main{padding:36px 18px 60px;}.zfw-toolbar{flex-direction:column;align-items:stretch;}.zfw-sw{max-width:100%;}}
  @media(max-width:480px){.zfw-hero-h1{font-size:2.2rem;}.zfw-card-stats{gap:10px;}.zfw-cs-v{font-size:1.1rem;}}
`;

export default Following;