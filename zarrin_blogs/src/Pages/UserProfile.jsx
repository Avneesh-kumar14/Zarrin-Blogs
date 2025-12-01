import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, FileText } from 'lucide-react';
import Heading from '../Component/Common/Heading';
import Paragraph from '../Component/Common/Paragraph';
import Button from '../Component/Common/Button';
import Alert from '../Component/Common/Alert';

const UserProfile = ({ currentUser, isAuthenticated }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [alert, setAlert] = useState(null);
  
  // Get current user from props or localStorage
  let loggedInUser = currentUser;
  if (!loggedInUser || !loggedInUser._id) {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        loggedInUser = JSON.parse(storedUser);
      }
    } catch (e) {
      console.error('Error parsing stored user:', e);
      loggedInUser = null;
    }
  }
  
  const token = localStorage.getItem('token');
  const isAuth = isAuthenticated !== undefined ? isAuthenticated : !!token;
  
  // If no userId in params, show own profile (when in dashboard)
  const profileUserId = userId || loggedInUser?._id;

  // Fetch blogs for a user
  const fetchUserBlogs = async (uid) => {
    try {
      const blogsRes = await fetch(`http://localhost:8200/api/users/${uid}/blogs`);
      if (blogsRes.ok) {
        const blogsData = await blogsRes.json();
        setUserBlogs(Array.isArray(blogsData) ? blogsData : []);
      } else {
        setUserBlogs([]);
      }
    } catch (err) {
      console.warn('Could not fetch blogs:', err);
      setUserBlogs([]);
    }
  };

  // Fetch profile from API
  const fetchUserProfile = async (uid) => {
    try {
      console.log('Fetching profile for uid:', uid);
      setLoading(true);
      const url = `http://localhost:8200/api/users/${uid}`;
      console.log('API URL:', url);
      
      const res = await fetch(url);
      console.log('Fetch response status:', res.status);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch user profile (${res.status})`);
      }
      
      const data = await res.json();
      console.log('Profile data received:', data);
      setUser(data);
      setIsFollowing(data.followers?.some(f => f._id === loggedInUser?._id) || false);

      // Fetch user's blogs
      await fetchUserBlogs(uid);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setAlert({ type: 'error', message: 'Failed to load user profile' });
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Main effect to load profile
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    console.log('=== UserProfile Component ===');
    console.log('userId from params:', userId);
    console.log('loggedInUser:', loggedInUser);
    console.log('profileUserId:', profileUserId);
    
    if (!userId) {
      // Viewing own profile from /dashboard/profile
      console.log('Loading own profile from localStorage');
      if (loggedInUser && loggedInUser._id) {
        console.log('Setting user from loggedInUser:', loggedInUser);
        setUser(loggedInUser);
        setLoading(false);
        // Fetch blogs in background
        fetchUserBlogs(loggedInUser._id);
      } else {
        console.log('No logged in user found - showing empty state');
        setLoading(false);
      }
    } else {
      // Viewing another user's profile - fetch from API
      console.log('Fetching other user profile for userId:', userId);
      fetchUserProfile(userId);
    }
  }, [userId]);

  const handleFollowToggle = async () => {
    if (!isAuth) {
      setAlert({ type: 'warning', message: 'Please log in to follow users' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const method = isFollowing ? 'DELETE' : 'POST';
      const res = await fetch(`http://localhost:8200/api/users/${profileUserId}/follow`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to update follow status');
      setIsFollowing(!isFollowing);
      setAlert({
        type: 'success',
        message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully'
      });
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #dbeafe',
            borderTop: '4px solid #2563eb',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#4b5563' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  // User not found state
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#4b5563', fontSize: '18px', marginBottom: '16px' }}>User not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '10px 24px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = loggedInUser?._id === profileUserId;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-12">
      {alert && (
        <div className="max-w-4xl mx-auto px-4 mb-4">
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border border-blue-100">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white shadow-2xl border-4 border-white">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={80} />
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <Heading type="h1" className="text-5xl font-bold text-gray-900 mb-2">
                {user.name}
              </Heading>
              <Paragraph className="text-gray-600 mb-4 flex items-center justify-center md:justify-start gap-2">
                <Mail size={18} className="text-blue-600" />
                {user.email}
              </Paragraph>
              {user.bio && (
                <Paragraph className="text-gray-700 mb-6 text-lg italic">
                  "{user.bio}"
                </Paragraph>
              )}

              {/* Stats */}
              <div className="flex gap-8 mb-8 justify-center md:justify-start">
                <div className="text-center">
                  <Heading type="h3" className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {user.totalBlogs || 0}
                  </Heading>
                  <Paragraph className="text-gray-600 font-semibold mt-1">Articles</Paragraph>
                </div>
                <div className="border-l border-gray-300"></div>
                <button
                  onClick={() => navigate(`/followers/${profileUserId}`)}
                  className="text-center hover:scale-110 transition-transform duration-300 cursor-pointer group"
                >
                  <Heading type="h3" className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-pink-700">
                    {user.followers?.length || 0}
                  </Heading>
                  <Paragraph className="text-gray-600 font-semibold mt-1 group-hover:text-purple-600">Followers</Paragraph>
                </button>
                <div className="border-l border-gray-300"></div>
                <button
                  onClick={() => navigate(`/following/${profileUserId}`)}
                  className="text-center hover:scale-110 transition-transform duration-300 cursor-pointer group"
                >
                  <Heading type="h3" className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent group-hover:from-pink-700 group-hover:to-orange-700">
                    {user.following?.length || 0}
                  </Heading>
                  <Paragraph className="text-gray-600 font-semibold mt-1 group-hover:text-pink-600">Following</Paragraph>
                </button>
              </div>

              {/* Follow Button */}
              {!isOwnProfile && (
                <Button
                  onClick={handleFollowToggle}
                  className={`px-10 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    isFollowing
                      ? 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  }`}
                  text={isFollowing ? '✓ Following' : '+ Follow'}
                />
              )}
            </div>
          </div>
        </div>

        {/* User's Blogs */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <FileText size={28} className="text-white" />
            </div>
            <Heading type="h2" className="text-3xl font-bold text-gray-900">
              Published Articles
            </Heading>
          </div>

          {userBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {userBlogs.map((blog) => (
                <div
                  key={blog._id}
                  onClick={() => navigate(`/blog/${blog._id}/preview`)}
                  className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                >
                  {blog.images && blog.images.length > 0 && (
                    <div className="h-48 rounded-xl mb-5 overflow-hidden bg-gray-200 relative">
                      <img
                        src={blog.images[0]}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  )}
                  <Heading type="h3" className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600">
                    {blog.title}
                  </Heading>
                  <Paragraph className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {blog.short_description}
                  </Paragraph>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-xs text-gray-500 font-semibold">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-blue-600 font-bold group-hover:gap-2 transition-all">Read →</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
              <FileText size={56} className="mx-auto text-gray-400 mb-4" />
              <Paragraph className="text-gray-600 text-lg font-semibold">
                No articles published yet
              </Paragraph>
              <Paragraph className="text-gray-500 mt-2">
                This author is working on their first piece!
              </Paragraph>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
