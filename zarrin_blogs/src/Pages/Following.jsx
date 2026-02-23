import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Mail, FileText, UserPlus, UserCheck, Star, BookOpen } from 'lucide-react';
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

  const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const loggedInUser = useMemo(() => (storedUser && Object.keys(storedUser).length > 0) ? storedUser : {}, [storedUser]);
  const token = localStorage.getItem('token');
  
  const getUserId = (user) => user?._id || user?.id;

  const fetchFollowing = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 DEBUG: fetchFollowing called');
      console.log('userId from useParams:', userId);
      console.log('Type of userId:', typeof userId);
      console.log('Full URL will be:', getApiUrl(`/api/users/${userId}`));

      const res = await fetch(getApiUrl(`/api/users/${userId}`), {
        credentials: 'include'
      });
      console.log('API Response Status:', res.status, res.statusText);
      if (!res.ok) throw new Error('Failed to fetch user');
      const userData = await res.json();
      console.log('User data received:', userData);
      
      setUserName(userData.name);
      
      // API returns fully populated following array - use it directly!
      if (userData.following && Array.isArray(userData.following)) {
        setFollowing(userData.following);
        
        // Build following map from logged-in user's following list
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

  const handleFollowToggle = async (userId) => {
    if (!token) {
      setAlert({ type: 'warning', message: 'Please log in to follow users' });
      return;
    }

    try {
      const isCurrentlyFollowing = followingMap[userId];
      const method = isCurrentlyFollowing ? 'DELETE' : 'POST';
      const res = await fetch(getApiUrl(`/api/users/${userId}/follow`), {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: 'include' // CRITICAL: include cookies for production CORS
      });

      // Parse error response properly
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to update follow status (${res.status})`);
      }
      
      // Update followingMap state
      setFollowingMap(prev => ({
        ...prev,
        [userId]: !prev[userId]
      }));
      
      // Update the followed user object to reflect changes (professional approach)
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
      
      setAlert({
        type: 'success',
        message: isCurrentlyFollowing ? 'Unfollowed successfully' : 'Followed successfully'
      });
    } catch (err) {
      console.error('❌ Follow toggle error:', err);
      setAlert({ type: 'error', message: err.message });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-slate-700 border-t-blue-600 mb-4"></div>
          <Paragraph className="text-gray-600 dark:text-gray-400 text-lg">Loading following list...</Paragraph>
        </div>
      </div>
    );
  }

  if (!userId || userId === 'undefined') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
          <Users size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">Invalid or missing user ID</p>
          <button 
            onClick={() => navigate('/')} 
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-on-primary font-semibold rounded-lg transition-all transform hover:scale-105"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-primary dark:bg-primary-dark text-white py-20 sm:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-8 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm border border-white/20 text-white transition-all transform hover:scale-105"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-secondary dark:bg-secondary-dark rounded-xl shadow-lg">
              <Star size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2">
                Following
              </h1>
              {userName && (
                <p className="text-gray-300 text-lg">
                  Amazing creators {userName} follows
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
            duration={4000}
          />
        </div>
      )}

      {/* Following List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {following.length > 0 ? (
          <>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full border border-purple-200 dark:border-purple-800">
                <Star size={16} className="text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                  Following {following.length} {following.length === 1 ? 'creator' : 'creators'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {following.map((followedUser) => (
                <div
                  key={followedUser._id}
                  className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700 transform hover:scale-105 hover:-translate-y-2"
                >
                  {/* Avatar Section with Gradient Background */}
                  <div className="relative h-40 bg-accent dark:bg-accent-dark overflow-hidden flex items-center justify-center">
                    {followedUser.avatar ? (
                      <img src={followedUser.avatar} alt={followedUser.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40">
                        <Users size={56} className="text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {followedUser.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-3">
                        <Mail size={14} />
                        <span className="truncate">{followedUser.email}</span>
                      </div>
                    </div>

                    {/* Bio */}
                    {followedUser.bio && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 italic">
                        "{followedUser.bio}"
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex gap-4 justify-center py-4 border-y border-gray-200 dark:border-slate-700">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {followedUser.totalBlogs || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold flex items-center justify-center gap-1 mt-1">
                          <BookOpen size={12} />
                          Articles
                        </p>
                      </div>
                      <div className="border-l border-gray-300 dark:border-slate-600"></div>
                      <div>
                        <p className="text-2xl font-bold text-secondary">
                          {followedUser.followers?.length || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold flex items-center justify-center gap-1 mt-1">
                          <Star size={12} />
                          Followers
                        </p>
                      </div>
                      <div className="border-l border-gray-300 dark:border-slate-600"></div>
                      <div>
                        <p className="text-2xl font-bold text-accent">
                          {followedUser.following?.length || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold flex items-center justify-center gap-1 mt-1">
                          <Users size={12} />
                          Following
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => navigate(`/profile/${followedUser._id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-dark text-on-primary rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                      >
                        <FileText size={16} />
                        View
                      </button>
                      {loggedInUser._id !== followedUser._id && (
                        <button
                          onClick={() => handleFollowToggle(followedUser._id)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm shadow-md transform hover:scale-105 transition-all ${
                            followingMap[followedUser._id]
                              ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'
                              : 'bg-success hover:bg-success-dark text-on-success'
                          }`}
                        >
                          {followingMap[followedUser._id] ? (
                            <>
                              <UserCheck size={16} />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus size={16} />
                              Follow
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-surface-primary dark:bg-surface-dark rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-600 p-16 text-center">
            <Users size={64} className="mx-auto text-gray-300 dark:text-slate-600 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Not following anyone yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Start following amazing creators to discover new content!
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Following;
