import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, Mail, FileText, UserPlus, UserCheck } from 'lucide-react';
import Heading from '../Component/Common/Heading';
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

  const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (userId) {
      fetchFollowing();
    }
  }, [userId]);

  const fetchFollowing = async () => {
    try {
      setLoading(true);
      console.log('Fetching following for user:', userId);

      const res = await fetch(`http://localhost:8200/api/users/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      const userData = await res.json();
      
      setUserName(userData.name);
      setFollowing(userData.following || []);
      
      // Check following status for each user
      if (token && userData.following) {
        const followMap = {};
        for (const followedUser of userData.following) {
          const userRes = await fetch(`http://localhost:8200/api/users/${followedUser._id}`);
          if (userRes.ok) {
            const userData = await userRes.json();
            followMap[followedUser._id] = userData.followers?.some(f => f._id === loggedInUser._id) || false;
          }
        }
        setFollowingMap(followMap);
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <Paragraph className="text-gray-600 text-lg">Loading following list...</Paragraph>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 py-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-white/20 backdrop-blur-lg rounded-lg">
              <Users size={36} className="text-white" />
            </div>
            <div>
              <Heading type="h1" className="text-5xl md:text-6xl font-bold">
                Following
              </Heading>
              <Paragraph className="text-pink-50 text-lg mt-2">
                {userName && `People ${userName} follows`}
              </Paragraph>
            </div>
          </div>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8">
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
            duration={4000}
          />
        </div>
      )}

      {/* Following List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {following.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {following.map((followedUser) => (
              <div
                key={followedUser._id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-300 transform hover:scale-105"
              >
                {/* Avatar Section */}
                <div className="h-32 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 relative flex items-center justify-center overflow-hidden">
                  {followedUser.avatar ? (
                    <img src={followedUser.avatar} alt={followedUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center">
                      <Users size={48} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <Heading type="h3" className="text-xl font-bold text-gray-900 mb-1 text-center group-hover:text-purple-600 transition-colors">
                    {followedUser.name}
                  </Heading>
                  
                  {/* Email */}
                  <Paragraph className="text-gray-600 text-sm text-center mb-2 flex items-center justify-center gap-2">
                    <Mail size={14} />
                    {followedUser.email}
                  </Paragraph>

                  {/* Bio */}
                  {followedUser.bio && (
                    <Paragraph className="text-gray-600 text-sm text-center mb-4 line-clamp-2 italic">
                      "{followedUser.bio}"
                    </Paragraph>
                  )}

                  {/* Stats */}
                  <div className="flex gap-4 mb-6 justify-center py-4 border-y border-gray-200">
                    <div className="text-center">
                      <Heading type="h4" className="text-xl font-bold text-purple-600">
                        {followedUser.totalBlogs || 0}
                      </Heading>
                      <Paragraph className="text-gray-500 text-xs font-semibold">Articles</Paragraph>
                    </div>
                    <div className="border-l border-gray-300"></div>
                    <div className="text-center">
                      <Heading type="h4" className="text-xl font-bold text-pink-600">
                        {followedUser.followers?.length || 0}
                      </Heading>
                      <Paragraph className="text-gray-500 text-xs font-semibold">Followers</Paragraph>
                    </div>
                    <div className="border-l border-gray-300"></div>
                    <div className="text-center">
                      <Heading type="h4" className="text-xl font-bold text-red-600">
                        {followedUser.following?.length || 0}
                      </Heading>
                      <Paragraph className="text-gray-500 text-xs font-semibold">Following</Paragraph>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/profile/${followedUser._id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 font-semibold text-sm shadow-md transform hover:scale-105 transition-all"
                    >
                      <FileText size={16} />
                      View Profile
                    </button>
                    {loggedInUser._id !== followedUser._id && (
                      <button
                        onClick={() => handleFollowToggle(followedUser._id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm shadow-md transform hover:scale-105 transition-all ${
                          followingMap[followedUser._id]
                            ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600'
                            : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700'
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
        ) : (
          <div className="text-center py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 rounded-3xl border-2 border-dashed border-gray-300 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <Users size={200} className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-900" />
            </div>
            <div className="relative z-10">
              <Users size={64} className="mx-auto text-gray-400 mb-4" />
              <Heading type="h2" className="text-3xl font-bold text-gray-700 mb-2">
                Not following anyone yet
              </Heading>
              <Paragraph className="text-gray-600 text-lg">
                This user hasn't started following anyone. Be the first to inspire them!
              </Paragraph>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Following;
