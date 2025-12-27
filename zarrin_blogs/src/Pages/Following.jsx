import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Mail, FileText, UserPlus, UserCheck, Star, BookOpen } from 'lucide-react';
import Paragraph from '../Component/Common/Paragraph';
import Alert from '../Component/Common/Alert';

const Following = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [followingMap, setFollowingMap] = useState({});
  const [userName, setUserName] = useState('');

  const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const loggedInUser = (storedUser && Object.keys(storedUser).length > 0) ? storedUser : {};
  const token = localStorage.getItem('token');
  
  const getUserId = (user) => user?._id || user?.id;

  useEffect(() => {
    if (userId) {
      fetchFollowing();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchFollowing = async () => {
    try {
      setLoading(true);
      console.log('Fetching following for user:', userId);

      const res = await fetch(`http://localhost:8200/api/users/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      const userData = await res.json();
      
      setUserName(userData.name);
      
      // Fetch full details for each followed user
      if (userData.following && Array.isArray(userData.following)) {
        const followingDetails = [];
        const followMap = {};
        
        for (const followedUser of userData.following) {
          const followedUserId = getUserId(followedUser);
          try {
            const userRes = await fetch(`http://localhost:8200/api/users/${followedUserId}`);
            if (userRes.ok) {
              const fullUserData = await userRes.json();
              followingDetails.push(fullUserData);
              
              // Check if logged in user is following this person
              if (token) {
                followMap[followedUserId] = fullUserData.followers?.some(f => getUserId(f) === getUserId(loggedInUser)) || false;
              }
            }
          } catch (err) {
            console.error('Error fetching user details:', err);
          }
        }
        
        setFollowing(followingDetails);
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
  };

  const handleFollowToggle = async (userId) => {
    if (!token) {
      setAlert({ type: 'warning', message: 'Please log in to follow users' });
      return;
    }

    try {
      const method = followingMap[userId] ? 'DELETE' : 'POST';
      const res = await fetch(`http://localhost:8200/api/users/${userId}/follow`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to update follow status');
      
      setFollowingMap(prev => ({
        ...prev,
        [userId]: !prev[userId]
      }));
      
      // Refetch the user's following list to get updated data
      await fetchFollowing();
      
      setAlert({
        type: 'success',
        message: followingMap[userId] ? 'Unfollowed successfully' : 'Followed successfully'
      });
    } catch (err) {
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

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-pink-900 to-slate-900 text-white py-20 sm:py-32">
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
            <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl shadow-lg">
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
                  <div className="relative h-40 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 overflow-hidden flex items-center justify-center">
                    {followedUser.avatar ? (
                      <img src={followedUser.avatar} alt={followedUser.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40">
                        <Users size={56} className="text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                        <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                          {followedUser.totalBlogs || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold flex items-center justify-center gap-1 mt-1">
                          <BookOpen size={12} />
                          Articles
                        </p>
                      </div>
                      <div className="border-l border-gray-300 dark:border-slate-600"></div>
                      <div>
                        <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent">
                          {followedUser.followers?.length || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold flex items-center justify-center gap-1 mt-1">
                          <Star size={12} />
                          Followers
                        </p>
                      </div>
                      <div className="border-l border-gray-300 dark:border-slate-600"></div>
                      <div>
                        <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
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
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
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
                              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
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
          <div className="bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-600 p-16 text-center">
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

      <style jsx>{`
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
