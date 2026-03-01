// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Users, ArrowLeft, Mail, FileText, UserPlus, UserCheck, Heart, BookOpen } from 'lucide-react';
// import Paragraph from '../Component/Common/Paragraph';
// import Alert from '../Component/Common/Alert';
// import { getApiUrl } from '../utils/apiConfig';

// const Followers = () => {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [followers, setFollowers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState(null);
//   const [followingMap, setFollowingMap] = useState({});
//   const [userName, setUserName] = useState('');

//   const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
//   const loggedInUser = useMemo(() => (storedUser && Object.keys(storedUser).length > 0) ? storedUser : {}, [storedUser]);
//   const token = localStorage.getItem('token');
  
//   const getUserId = (user) => user?._id || user?.id;

//   const fetchFollowers = useCallback(async () => {
//     try {
//       console.log('🔍 DEBUG: fetchFollowers called');
//       console.log('userId:', userId);
      
//       if (!userId || userId === 'undefined') {
//         throw new Error('userId is not defined');
//       }
      
//       setLoading(true);
//       console.log('Fetching from API with userId:', userId);
//       console.log('Full URL:', getApiUrl(`/api/users/${userId}`));

//       const res = await fetch(getApiUrl(`/api/users/${userId}`), {
//         credentials: 'include'
//       });
//       console.log('API Response Status:', res.status, res.statusText);
//       if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);
//       const userData = await res.json();
//       console.log('User data received:', userData);
      
//       setUserName(userData.name);
      
//       // API returns fully populated followers array - use it directly!
//       if (userData.followers && Array.isArray(userData.followers)) {
//         setFollowers(userData.followers);
        
//         // Build following map from logged-in user's following list
//         const followMap = {};
//         if (token && loggedInUser?.following) {
//           userData.followers.forEach(follower => {
//             const followerId = getUserId(follower);
//             followMap[followerId] = loggedInUser.following.some(f => getUserId(f) === followerId);
//           });
//         }
//         setFollowingMap(followMap);
//       } else {
//         setFollowers([]);
//       }
//     } catch (err) {
//       console.error('Error fetching followers:', err);
//       setAlert({ type: 'error', message: 'Failed to load followers: ' + err.message });
//     } finally {
//       setLoading(false);
//     }
//   }, [userId, token, loggedInUser.following]);

//   useEffect(() => {
//     console.log('🔍 Followers useEffect triggered');
//     console.log('userId from useParams():', userId);
//     console.log('typeof userId:', typeof userId);
    
//     if (userId && userId !== 'undefined') {
//       console.log('✅ Valid userId, calling fetchFollowers');
//       fetchFollowers();
//     } else {
//       console.warn('❌ Invalid userId:', userId);
//       setLoading(false);
//     }
//   }, [userId, fetchFollowers]);

//   const handleFollowToggle = async (followerId) => {
//     if (!token) {
//       setAlert({ type: 'warning', message: 'Please log in to follow users' });
//       return;
//     }

//     try {
//       const isCurrentlyFollowing = followingMap[followerId];
//       const method = isCurrentlyFollowing ? 'DELETE' : 'POST';
//       const res = await fetch(getApiUrl(`/api/users/${followerId}/follow`), {
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
//         [followerId]: !prev[followerId]
//       }));
      
//       // Update the follower object to reflect changes (professional approach)
//       setFollowers(prevFollowers => 
//         prevFollowers.map(follower => {
//           if (follower._id === followerId) {
//             return {
//               ...follower,
//               followers: isCurrentlyFollowing 
//                 ? follower.followers.filter(f => f._id !== loggedInUser._id)
//                 : [...(follower.followers || []), { _id: loggedInUser._id }]
//             };
//           }
//           return follower;
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
//           <Paragraph className="text-gray-600 dark:text-gray-400 text-lg">Loading followers...</Paragraph>
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
//           <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//           <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//           <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
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
//               <Heart size={32} className="text-white" />
//             </div>
//             <div>
//               <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2">
//                 Followers
//               </h1>
//               {userName && (
//                 <p className="text-gray-300 text-lg">
//                   People who love {userName}'s content
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

//       {/* Followers List */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         {followers.length > 0 ? (
//           <>
//             <div className="mb-8">
//               <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-800">
//                 <Heart size={16} className="text-blue-600 dark:text-blue-400" />
//                 <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
//                   {followers.length} {followers.length === 1 ? 'follower' : 'followers'}
//                 </span>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {followers.map((follower) => (
//                 <div
//                   key={follower._id}
//                   className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700 transform hover:scale-105 hover:-translate-y-2"
//                 >
//                   {/* Avatar Section with Gradient Background */}
//                   <div className="relative h-40 bg-accent dark:bg-accent-dark overflow-hidden flex items-center justify-center">
//                     {follower.avatar ? (
//                       <img src={follower.avatar} alt={follower.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
//                       <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//                         {follower.name}
//                       </h3>
//                       <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-3">
//                         <Mail size={14} />
//                         <span className="truncate">{follower.email}</span>
//                       </div>
//                     </div>

//                     {/* Bio */}
//                     {follower.bio && (
//                       <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 italic">
//                         "{follower.bio}"
//                       </p>
//                     )}

//                     {/* Stats */}
//                     <div className="flex gap-4 justify-center py-4 border-y border-gray-200 dark:border-slate-700">
//                       <div>
//                         <p className="text-2xl font-bold text-primary">
//                           {follower.totalBlogs || 0}
//                         </p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold flex items-center justify-center gap-1 mt-1">
//                           <BookOpen size={12} />
//                           Articles
//                         </p>
//                       </div>
//                       <div className="border-l border-gray-300 dark:border-slate-600"></div>
//                       <div>
//                         <p className="text-2xl font-bold text-secondary">
//                           {follower.followers?.length || 0}
//                         </p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold flex items-center justify-center gap-1 mt-1">
//                           <Heart size={12} />
//                           Followers
//                         </p>
//                       </div>
//                       <div className="border-l border-gray-300 dark:border-slate-600"></div>
//                       <div>
//                         <p className="text-2xl font-bold text-accent">
//                           {follower.following?.length || 0}
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
//                         onClick={() => navigate(`/profile/${follower._id}`)}
//                         className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-dark text-on-primary rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
//                       >
//                         <FileText size={16} />
//                         View
//                       </button>
//                       {loggedInUser._id !== follower._id && (
//                         <button
//                           onClick={() => handleFollowToggle(follower._id)}
//                           className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm shadow-md transform hover:scale-105 transition-all ${
//                             followingMap[follower._id]
//                               ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'
//                               : 'bg-success hover:bg-success-dark text-on-success'
//                           }`}
//                         >
//                           {followingMap[follower._id] ? (
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
//               No followers yet
//             </h2>
//             <p className="text-gray-600 dark:text-gray-400 text-lg">
//               This user hasn't built their following yet. Follow them to be the first!
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

// export default Followers;



import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Mail, FileText, UserPlus, UserCheck, Heart, BookOpen, Sparkles, Search } from 'lucide-react';
import Paragraph from '../Component/Common/Paragraph';
import Alert from '../Component/Common/Alert';
import { getApiUrl } from '../utils/apiConfig';

const Followers = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [followingMap, setFollowingMap] = useState({});
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const loggedInUser = useMemo(() => (storedUser && Object.keys(storedUser).length > 0) ? storedUser : {}, [storedUser]);
  const token = localStorage.getItem('token');
  const getUserId = (user) => user?._id || user?.id;

  /* ── EXISTING fetchFollowers — preserved exactly ── */
  const fetchFollowers = useCallback(async () => {
    try {
      console.log('🔍 DEBUG: fetchFollowers called');
      console.log('userId:', userId);
      if (!userId || userId === 'undefined') throw new Error('userId is not defined');
      setLoading(true);
      console.log('Fetching from API with userId:', userId);
      console.log('Full URL:', getApiUrl(`/api/users/${userId}`));
      const res = await fetch(getApiUrl(`/api/users/${userId}`), { credentials: 'include' });
      console.log('API Response Status:', res.status, res.statusText);
      if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);
      const userData = await res.json();
      console.log('User data received:', userData);
      setUserName(userData.name);
      if (userData.followers && Array.isArray(userData.followers)) {
        setFollowers(userData.followers);
        const followMap = {};
        if (token && loggedInUser?.following) {
          userData.followers.forEach(follower => {
            const followerId = getUserId(follower);
            followMap[followerId] = loggedInUser.following.some(f => getUserId(f) === followerId);
          });
        }
        setFollowingMap(followMap);
      } else {
        setFollowers([]);
      }
    } catch (err) {
      console.error('Error fetching followers:', err);
      setAlert({ type: 'error', message: 'Failed to load followers: ' + err.message });
    } finally {
      setLoading(false);
    }
  }, [userId, token, loggedInUser.following]);

  useEffect(() => {
    console.log('🔍 Followers useEffect triggered');
    console.log('userId from useParams():', userId);
    console.log('typeof userId:', typeof userId);
    if (userId && userId !== 'undefined') {
      console.log('✅ Valid userId, calling fetchFollowers');
      fetchFollowers();
    } else {
      console.warn('❌ Invalid userId:', userId);
      setLoading(false);
    }
  }, [userId, fetchFollowers]);

  /* ── EXISTING handleFollowToggle — preserved exactly ── */
  const handleFollowToggle = async (followerId) => {
    if (!token) { setAlert({ type: 'warning', message: 'Please log in to follow users' }); return; }
    try {
      const isCurrentlyFollowing = followingMap[followerId];
      const method = isCurrentlyFollowing ? 'DELETE' : 'POST';
      const res = await fetch(getApiUrl(`/api/users/${followerId}/follow`), {
        method,
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include'
      });
      if (!res.ok) { const errorData = await res.json(); throw new Error(errorData.message || `Failed to update follow status (${res.status})`); }
      setFollowingMap(prev => ({ ...prev, [followerId]: !prev[followerId] }));
      setFollowers(prevFollowers =>
        prevFollowers.map(follower => {
          if (follower._id === followerId) {
            return {
              ...follower,
              followers: isCurrentlyFollowing
                ? follower.followers.filter(f => f._id !== loggedInUser._id)
                : [...(follower.followers || []), { _id: loggedInUser._id }]
            };
          }
          return follower;
        })
      );
      setAlert({ type: 'success', message: isCurrentlyFollowing ? 'Unfollowed successfully' : 'Followed successfully' });
    } catch (err) {
      console.error('❌ Follow toggle error:', err);
      setAlert({ type: 'error', message: err.message });
    }
  };

  const filtered = followers.filter(f =>
    !searchQuery ||
    f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="zfl-root zfl-center-screen">
        <div className="zfl-spinner" />
        <Paragraph className="zfl-loading-txt">Loading followers…</Paragraph>
        <div className="zfl-sk-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="zfl-sk-card">
              <div className="zfl-sk-hd" />
              <div className="zfl-sk-bd">
                <div className="zfl-sk-l zfl-sk-s" /><div className="zfl-sk-l" /><div className="zfl-sk-l zfl-sk-m" />
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
      <div className="zfl-root zfl-center-screen">
        <div className="zfl-err-card">
          <Users size={48} className="zfl-err-icon" />
          <h3 className="zfl-err-title">Invalid User</h3>
          <p className="zfl-err-desc">Invalid or missing user ID</p>
          <button onClick={() => navigate('/')} className="zfl-err-btn">Go Back to Home</button>
        </div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="zfl-root">
      {/* HERO */}
      <section className="zfl-hero">
        <div className="zfl-hero-grid" />
        <div className="zfl-orb zfl-o1" /><div className="zfl-orb zfl-o2" /><div className="zfl-orb zfl-o3" />
        <div className="zfl-hero-inner">
          <button onClick={() => navigate(-1)} className="zfl-back-btn"><ArrowLeft size={15} />Go Back</button>
          <div className="zfl-hero-content">
            <div className="zfl-hero-icon"><Heart size={26} color="#fff" /></div>
            <div>
              <div className="zfl-eyebrow"><Sparkles size={12} />Community</div>
              <h1 className="zfl-hero-h1">Followers</h1>
              {userName && <p className="zfl-hero-sub">People who love <em>{userName}'s</em> content</p>}
            </div>
          </div>
          <div className="zfl-hero-pills">
            <div className="zfl-pill"><Heart size={12} className="zfl-pi" /><span className="zfl-pv">{followers.length}</span><span className="zfl-pl">Followers</span></div>
            <div className="zfl-pill"><Users size={12} className="zfl-pi" /><span className="zfl-pv">{followers.filter(f => followingMap[f._id]).length}</span><span className="zfl-pl">You Follow</span></div>
          </div>
        </div>
        <div className="zfl-wave"><svg viewBox="0 0 1440 64" fill="none" preserveAspectRatio="none"><path d="M0 32 Q360 64 720 32 Q1080 0 1440 32 L1440 64 L0 64 Z" fill="var(--color-surface-secondary,#F5F5F5)" /></svg></div>
      </section>

      {/* MAIN */}
      <div className="zfl-main">
        <div className="zfl-main-inner">
          {alert && <div className="zfl-alert-wrap"><Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} duration={4000} /></div>}

          {followers.length > 0 && (
            <div className="zfl-toolbar">
              <div className="zfl-sw"><Search size={14} className="zfl-si" /><input type="text" placeholder="Search followers…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="zfl-search" /></div>
              <div className="zfl-count-pill"><Heart size={13} />{followers.length} {followers.length === 1 ? 'follower' : 'followers'}</div>
            </div>
          )}

          {followers.length > 0 ? (
            filtered.length > 0 ? (
              <div className="zfl-grid">
                {filtered.map((follower, idx) => (
                  <UserCard key={follower._id} user={follower} idx={idx}
                    isFollowing={followingMap[follower._id]}
                    isSelf={loggedInUser._id === follower._id}
                    onView={() => navigate(`/profile/${follower._id}`)}
                    onFollow={() => handleFollowToggle(follower._id)} />
                ))}
              </div>
            ) : (
              <div className="zfl-no-res">
                <Search size={36} className="zfl-nr-icon" />
                <p className="zfl-nr-txt">No followers match "<strong>{searchQuery}</strong>"</p>
                <button onClick={() => setSearchQuery('')} className="zfl-nr-btn">Clear search</button>
              </div>
            )
          ) : (
            <div className="zfl-empty">
              <Users size={56} className="zfl-empty-icon" />
              <h3 className="zfl-empty-title">No followers yet</h3>
              <p className="zfl-empty-desc">This user hasn't built their following yet. Follow them to be the first!</p>
              <button onClick={() => navigate('/blog')} className="zfl-empty-btn"><Sparkles size={15} />Explore Writers</button>
            </div>
          )}
        </div>
      </div>
      <style>{styles}</style>
    </div>
  );
};

/* ── SHARED USER CARD ── */
const UserCard = ({ user, idx, isFollowing, isSelf, onView, onFollow }) => {
  const accents = [
    'var(--color-primary,#2B64D4)',
    'var(--color-secondary,#1E8A56)',
    'var(--color-accent,#7040CC)',
    'var(--color-warning,#C49A3C)',
  ];
  const accent = accents[idx % accents.length];
  return (
    <article className="zfl-card" style={{ '--ca': accent, animationDelay: `${idx * 0.05}s` }}>
      <div className="zfl-card-topbar" />
      <div className="zfl-card-hd" style={{ background: `linear-gradient(135deg,var(--ca),rgba(0,0,0,0.55))` }}>
        {user.avatar
          ? <img src={user.avatar} alt={user.name} className="zfl-card-img" />
          : <div className="zfl-card-av">{user.name?.charAt(0).toUpperCase()}</div>}
        <div className="zfl-card-hd-ov" />
      </div>
      <div className="zfl-card-body">
        <h3 className="zfl-card-name">{user.name}</h3>
        <div className="zfl-card-email"><Mail size={11} /><span>{user.email}</span></div>
        {user.bio && <p className="zfl-card-bio">"{user.bio}"</p>}
        <div className="zfl-card-stats">
          <div className="zfl-cs"><span className="zfl-cs-v">{user.totalBlogs || 0}</span><span className="zfl-cs-l"><BookOpen size={9} />Articles</span></div>
          <div className="zfl-cs-div" />
          <div className="zfl-cs"><span className="zfl-cs-v">{user.followers?.length || 0}</span><span className="zfl-cs-l"><Heart size={9} />Followers</span></div>
          <div className="zfl-cs-div" />
          <div className="zfl-cs"><span className="zfl-cs-v">{user.following?.length || 0}</span><span className="zfl-cs-l"><Users size={9} />Following</span></div>
        </div>
        <div className="zfl-card-actions">
          <button onClick={onView} className="zfl-view-btn" style={{ background: 'var(--ca)' }}><FileText size={13} />View Profile</button>
          {!isSelf && (
            <button onClick={onFollow} className={`zfl-follow-btn ${isFollowing ? 'zfl-fon' : ''}`}>
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

  .zfl-root { font-family: 'Outfit', sans-serif; background: var(--color-surface-secondary,#F5F5F5); color: var(--color-text-primary,#111); min-height: 100vh; overflow-x: hidden; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);} }
  @keyframes drift { 0%,100%{transform:translate(0,0)scale(1);}40%{transform:translate(20px,-26px)scale(1.06);}70%{transform:translate(-14px,16px)scale(0.96);} }
  @keyframes spin { to{transform:rotate(360deg);} }
  @keyframes shimmer { 0%{background-position:-400px 0;}100%{background-position:400px 0;} }

  .zfl-center-screen { display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:72px 24px;gap:20px; }
  .zfl-spinner { width:44px;height:44px;border:3px solid rgba(43,100,212,0.15);border-top-color:var(--color-primary,#2B64D4);border-radius:50%;animation:spin 0.7s linear infinite; }
  .zfl-loading-txt { font-size:15px;color:var(--color-text-secondary,#4A4A48); }
  .zfl-sk-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:18px;width:100%;max-width:1100px;margin-top:8px; }
  @media(max-width:900px){.zfl-sk-grid{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:560px){.zfl-sk-grid{grid-template-columns:1fr;}}
  .zfl-sk-card { background:var(--color-surface-primary,#fff);border-radius:18px;overflow:hidden;border:1px solid var(--color-border-light,#EEE); }
  .zfl-sk-hd { height:140px;background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:400px 100%;animation:shimmer 1.4s infinite; }
  .zfl-sk-bd { padding:18px;display:flex;flex-direction:column;gap:10px; }
  .zfl-sk-l { height:11px;border-radius:6px;background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:400px 100%;animation:shimmer 1.4s infinite; }
  .zfl-sk-s{width:40%;} .zfl-sk-m{width:65%;}

  .zfl-err-card { text-align:center;background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-light,#EEE);border-radius:22px;padding:56px 40px;box-shadow:0 8px 32px rgba(26,24,22,0.09); }
  .zfl-err-icon { color:var(--color-border-default,#E0E0E0);margin:0 auto 18px;display:block; }
  .zfl-err-title { font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:800;color:var(--color-text-primary,#111);margin-bottom:8px; }
  .zfl-err-desc { font-size:14px;color:var(--color-text-secondary,#4A4A48);margin-bottom:24px; }
  .zfl-err-btn { padding:12px 28px;background:var(--color-primary,#2B64D4);color:#fff;border:none;border-radius:10px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:transform 0.15s; }
  .zfl-err-btn:hover{transform:translateY(-1px);}

  .zfl-hero { position:relative;overflow:hidden;background:linear-gradient(148deg,var(--color-primary-dark,#1A3F8A) 0%,var(--color-primary,#2B64D4) 55%,#2468d4 100%);padding:72px 24px 96px; }
  .zfl-hero-grid { position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px);background-size:52px 52px; }
  .zfl-orb { position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none; }
  .zfl-o1{width:320px;height:320px;top:-80px;left:-60px;background:rgba(255,255,255,0.07);animation:drift 11s ease-in-out infinite;}
  .zfl-o2{width:240px;height:240px;bottom:-20px;right:-50px;background:rgba(30,138,86,0.18);animation:drift 9s ease-in-out infinite reverse;}
  .zfl-o3{width:180px;height:180px;top:40%;left:60%;background:rgba(112,64,204,0.12);animation:drift 13s ease-in-out infinite 2s;}
  .zfl-hero-inner { position:relative;z-index:2;max-width:1200px;margin:0 auto;animation:fadeUp 0.7s ease both; }
  .zfl-back-btn { display:inline-flex;align-items:center;gap:7px;padding:9px 16px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:9px;color:rgba(255,255,255,0.85);font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;cursor:pointer;backdrop-filter:blur(8px);transition:background 0.18s;margin-bottom:24px; }
  .zfl-back-btn:hover{background:rgba(255,255,255,0.18);}
  .zfl-hero-content { display:flex;align-items:flex-start;gap:16px;margin-bottom:26px; }
  .zfl-hero-icon { width:54px;height:54px;border-radius:14px;background:var(--color-secondary,#1E8A56);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 18px rgba(0,0,0,0.2);flex-shrink:0; }
  .zfl-eyebrow { display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.85);font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;padding:5px 13px;border-radius:100px;margin-bottom:10px; }
  .zfl-hero-h1 { font-family:'Playfair Display',serif;font-size:clamp(2.4rem,5vw,4rem);font-weight:800;color:#fff;line-height:1.1;margin-bottom:8px;text-shadow:0 4px 24px rgba(0,0,0,0.2); }
  .zfl-hero-sub { font-size:15px;color:rgba(255,255,255,0.62);font-weight:300; }
  .zfl-hero-sub em { font-style:italic;color:rgba(255,255,255,0.85); }
  .zfl-hero-pills { display:flex;gap:10px;flex-wrap:wrap; }
  .zfl-pill { display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.18);padding:9px 16px;border-radius:100px;backdrop-filter:blur(8px); }
  .zfl-pi{color:rgba(255,255,255,0.5);} .zfl-pv{font-family:'Playfair Display',serif;font-size:1rem;font-weight:800;color:#fff;} .zfl-pl{font-size:11px;color:rgba(255,255,255,0.45);}
  .zfl-wave { position:absolute;bottom:-1px;left:0;right:0;height:64px; }
  .zfl-wave svg { width:100%;height:100%; }

  .zfl-main { padding:48px 24px 80px; }
  .zfl-main-inner { max-width:1200px;margin:0 auto; }
  .zfl-alert-wrap { margin-bottom:24px; }

  .zfl-toolbar { display:flex;align-items:center;gap:12px;margin-bottom:24px;flex-wrap:wrap; }
  .zfl-sw { position:relative;flex:1;min-width:200px;max-width:380px; }
  .zfl-si { position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--color-text-muted,#B0B0AD);pointer-events:none; }
  .zfl-search { width:100%;padding:10px 14px 10px 36px;background:var(--color-surface-primary,#fff);border:1.5px solid var(--color-border-default,#E0E0E0);border-radius:10px;font-family:'Outfit',sans-serif;font-size:13px;color:var(--color-text-primary,#111);outline:none;transition:border-color 0.2s,box-shadow 0.2s; }
  .zfl-search:focus{border-color:var(--color-primary,#2B64D4);box-shadow:0 0 0 4px rgba(43,100,212,0.08);}
  .zfl-count-pill { display:flex;align-items:center;gap:6px;padding:10px 16px;background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-default,#E0E0E0);border-radius:10px;font-size:12px;font-weight:600;color:var(--color-text-secondary,#4A4A48);white-space:nowrap; }

  .zfl-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:20px; }
  @media(max-width:1000px){.zfl-grid{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:580px){.zfl-grid{grid-template-columns:1fr;}}

  .zfl-card { background:var(--color-surface-primary,#fff);border:1px solid var(--color-border-light,#EEE);border-radius:18px;overflow:hidden;box-shadow:0 2px 10px rgba(26,24,22,0.06);transition:transform 0.22s,box-shadow 0.22s;animation:fadeUp 0.5s ease both; }
  .zfl-card:hover{transform:translateY(-5px);box-shadow:0 14px 36px rgba(26,24,22,0.1);}
  .zfl-card-topbar { height:3px;background:var(--ca); }
  .zfl-card-hd { position:relative;height:140px;display:flex;align-items:center;justify-content:center;overflow:hidden; }
  .zfl-card-img { width:100%;height:100%;object-fit:cover;transition:transform 0.4s; }
  .zfl-card:hover .zfl-card-img{transform:scale(1.07);}
  .zfl-card-hd-ov { position:absolute;inset:0;background:rgba(0,0,0,0.12); }
  .zfl-card-av { width:70px;height:70px;border-radius:50%;background:rgba(255,255,255,0.2);border:2px solid rgba(255,255,255,0.4);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:800;color:#fff;position:relative;z-index:1; }
  .zfl-card-body { padding:20px;display:flex;flex-direction:column;gap:10px; }
  .zfl-card-name { font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:800;color:var(--color-text-primary,#111);text-align:center;transition:color 0.2s; }
  .zfl-card:hover .zfl-card-name{color:var(--ca);}
  .zfl-card-email { display:flex;align-items:center;justify-content:center;gap:5px;font-size:11px;color:var(--color-text-muted,#B0B0AD); }
  .zfl-card-email span { overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px; }
  .zfl-card-bio { font-size:12px;color:var(--color-text-secondary,#4A4A48);font-style:italic;text-align:center;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
  .zfl-card-stats { display:flex;align-items:center;justify-content:center;gap:14px;padding:14px 0;border-top:1px solid var(--color-border-light,#EEE);border-bottom:1px solid var(--color-border-light,#EEE); }
  .zfl-cs{text-align:center;}
  .zfl-cs-v{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:800;color:var(--ca);display:block;}
  .zfl-cs-l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:9px;font-weight:600;color:var(--color-text-muted,#B0B0AD);text-transform:uppercase;letter-spacing:0.05em;margin-top:2px;}
  .zfl-cs-div{width:1px;height:32px;background:var(--color-border-light,#EEE);}
  .zfl-card-actions { display:flex;gap:8px; }
  .zfl-view-btn { flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:11px;color:#fff;border:none;border-radius:9px;font-family:'Outfit',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:transform 0.15s,box-shadow 0.15s;box-shadow:0 3px 12px rgba(0,0,0,0.15); }
  .zfl-view-btn:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(0,0,0,0.2);}
  .zfl-follow-btn { flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:11px;background:var(--color-secondary,#1E8A56);color:#fff;border:none;border-radius:9px;font-family:'Outfit',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.15s;box-shadow:0 3px 12px rgba(30,138,86,0.2); }
  .zfl-follow-btn:hover{transform:translateY(-1px);}
  .zfl-fon{background:var(--color-surface-secondary,#F5F5F5)!important;color:var(--color-text-primary,#111)!important;border:1px solid var(--color-border-default,#E0E0E0);box-shadow:none!important;}

  .zfl-no-res{text-align:center;padding:64px 24px;}
  .zfl-nr-icon{color:var(--color-border-default,#E0E0E0);margin:0 auto 14px;display:block;}
  .zfl-nr-txt{font-size:14px;color:var(--color-text-secondary,#4A4A48);margin-bottom:16px;}
  .zfl-nr-btn{padding:10px 22px;background:var(--color-primary,#2B64D4);color:#fff;border:none;border-radius:9px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:600;cursor:pointer;}

  .zfl-empty{text-align:center;background:var(--color-surface-primary,#fff);border:2px dashed var(--color-border-default,#E0E0E0);border-radius:22px;padding:72px 32px;}
  .zfl-empty-icon{color:var(--color-border-default,#E0E0E0);margin:0 auto 20px;display:block;}
  .zfl-empty-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:800;color:var(--color-text-primary,#111);margin-bottom:10px;}
  .zfl-empty-desc{font-size:15px;color:var(--color-text-secondary,#4A4A48);line-height:1.7;max-width:420px;margin:0 auto 24px;}
  .zfl-empty-btn{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;background:linear-gradient(135deg,var(--color-primary,#2B64D4),var(--color-primary-dark,#1A3F8A));color:#fff;border:none;border-radius:10px;font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 18px rgba(43,100,212,0.25);transition:transform 0.15s;}
  .zfl-empty-btn:hover{transform:translateY(-1px);}

  @media(max-width:768px){.zfl-hero{padding:56px 18px 84px;}.zfl-main{padding:36px 18px 60px;}.zfl-toolbar{flex-direction:column;align-items:stretch;}.zfl-sw{max-width:100%;}}
  @media(max-width:480px){.zfl-hero-h1{font-size:2.2rem;}.zfl-card-stats{gap:10px;}.zfl-cs-v{font-size:1.1rem;}}
`;

export default Followers;