import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, FileText, ArrowLeft, UserCheck, UserPlus, Calendar, BookOpen } from 'lucide-react';
import Alert from '../Component/Common/Alert';
import { getApiUrl } from '../utils/apiConfig';

// Helper function to calculate age from date of birth
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
};

const UserProfile = ({ currentUser, isAuthenticated, ownProfile = false }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [alert, setAlert] = useState(null);
  
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  
  const loggedInUser = (currentUser && Object.keys(currentUser).length > 0) ? currentUser : storedUser;

  const getUserId = (user) => user?._id || user?.id;

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      console.log('=== Fetching Profile ===');
      console.log('ownProfile:', ownProfile, 'userId param:', userId);
      
      let userData;
      let profileUserId;
      
      // If this is the own profile page, get userId from logged-in user
      if (ownProfile) {
        console.log('Showing own profile');
        if (!loggedInUser) {
          setAlert({ type: 'error', message: 'Please log in to view profile' });
          setLoading(false);
          return;
        }
        profileUserId = getUserId(loggedInUser);
      } else {
        // For viewing other users' profiles, use userId from params
        if (!userId || userId === 'undefined' || userId === 'null') {
          setAlert({ type: 'error', message: 'Invalid user ID' });
          setLoading(false);
          return;
        }
        profileUserId = userId;
      }
      
      // Always fetch from API to get complete data with populated followers/following
      if (profileUserId) {
        console.log('Fetching from API for userId:', profileUserId);
        const res = await fetch(getApiUrl(`/api/users/${profileUserId}`), {
          credentials: 'include' // CRITICAL: include cookies for production CORS
        });
        console.log('API response status:', res.status);
        if (!res.ok) throw new Error('Failed to fetch user');
        userData = await res.json();
        console.log('userData from API:', userData);
      }
      
      if (!userData || !getUserId(userData)) {
        console.log('No user data or user ID found');
        throw new Error('No user data available');
      }
      
      setUser(userData);
      setIsFollowing(userData.followers?.some(f => getUserId(f) === getUserId(loggedInUser)) || false);
      
      const userIdForBlogs = getUserId(userData);
      if (userIdForBlogs) {
        const blogsRes = await fetch(getApiUrl(`/api/users/${userIdForBlogs}/blogs`), {
          credentials: 'include' // CRITICAL: include cookies for production CORS
        });
        if (blogsRes.ok) {
          const blogs = await blogsRes.json();
          setUserBlogs(Array.isArray(blogs) ? blogs : []);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setAlert({ type: 'error', message: err.message });
      setUser(null);
      setLoading(false);
    }
  }, [userId, ownProfile, loggedInUser]);

  useEffect(() => {
    // Skip fetch if requirements not met
    if (ownProfile && !loggedInUser) {
      return; // Wait for logged in user data
    }
    
    if (!ownProfile && (!userId || userId === 'undefined' || userId === 'null')) {
      return; // Skip invalid userId
    }
    
    fetchProfile();
  }, [userId, ownProfile, loggedInUser, fetchProfile]);

  const handleFollowToggle = async () => {
    if (!token) {
      setAlert({ type: 'warning', message: 'Please log in to follow users' });
      return;
    }

    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      const res = await fetch(getApiUrl(`/api/users/${user._id}/follow`), {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: 'include' // CRITICAL: include cookies for production CORS
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

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-primary dark:bg-surface-dark flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 dark:bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/20 dark:bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary p-[3px]">
            <div className="w-full h-full bg-surface-primary dark:bg-surface-dark-alt rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-border-light dark:border-border-dark border-t-primary"></div>
            </div>
          </div>
          <p className="text-primary font-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-primary dark:bg-surface-dark flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 dark:bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        </div>
        <div className="text-center bg-surface-primary dark:bg-surface-dark p-12 rounded-2xl shadow-2xl border border-border-light dark:border-border-dark relative z-10">
          <div className="p-4 bg-error dark:bg-error-dark rounded-xl inline-block mb-4">
            <FileText size={48} className="text-white" />
          </div>
          <p className="text-error dark:text-error-dark mb-6 text-lg font-semibold">User not found</p>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-on-primary font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = !userId || loggedInUser?._id === user._id;

  return (
    <div className="min-h-screen bg-surface-primary dark:bg-surface-dark relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 dark:bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/20 dark:bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-secondary/20 dark:bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-primary dark:bg-primary-dark text-on-primary py-20 sm:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isOwnProfile && (
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 mb-8 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm border border-white/20 text-white transition-all transform hover:scale-105"
            >
              <ArrowLeft size={18} /> Go Back
            </button>
          )}
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
            duration={5000}
          />
        </div>
      )}

      {/* Profile Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-12">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-slate-800 backdrop-blur">
          {/* Gradient Top Border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-3xl"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Avatar Section */}
            <div className="col-span-1 flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-40 h-40 rounded-2xl bg-primary flex items-center justify-center shadow-2xl ring-4 ring-white dark:ring-neutral-800 overflow-hidden transform hover:scale-110 transition-transform">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={80} className="text-on-primary" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 shadow-lg pulse"></div>
              </div>

              {!isOwnProfile && (
                <button 
                  onClick={handleFollowToggle} 
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    isFollowing
                      ? 'bg-surface-secondary dark:bg-surface-dark text-text-primary dark:text-text-primary border border-border-default dark:border-border-dark'
                      : 'bg-primary hover:bg-primary-dark text-on-primary shadow-lg'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck size={18} /> Following
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} /> Follow
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="col-span-1 md:col-span-3">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-text-primary dark:text-white mb-2">
                  {user.name}
                </h1>
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail size={18} />
                    <span className="text-lg">{user.email}</span>
                  </div>
                  {user.dateOfBirth && (
                    <div className="flex items-center gap-2 text-text-secondary dark:text-text-secondary">
                      <Calendar size={18} />
                      <span className="text-lg">Age: {calculateAge(user.dateOfBirth)} years old</span>
                    </div>
                  )}
                </div>
                {user.bio && (
                  <p className="text-lg text-text-primary dark:text-text-primary italic max-w-2xl leading-relaxed">
                    "{user.bio}"
                  </p>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Articles Card */}
                <div className="bg-primary dark:bg-primary-dark rounded-2xl p-6 border border-primary/20 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80 font-semibold text-sm">Articles</span>
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <p className="text-4xl font-bold text-white">
                    {user.totalBlogs || 0}
                  </p>
                </div>

                {/* Followers Card */}
                <button 
                  onClick={() => navigate(`/followers/${user._id || user.id}`)}
                  className="bg-error text-on-primary rounded-2xl p-6 border border-error/20 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-on-primary/80 font-semibold text-sm group-hover:text-on-primary transition-colors">Followers</span>
                    <User size={20} className="text-on-primary" />
                  </div>
                  <p className="text-4xl font-bold text-on-primary">
                    {user.followers?.length || 0}
                  </p>
                </button>

                {/* Following Card */}
                <button 
                  onClick={() => navigate(`/following/${user._id || user.id}`)}
                  className="bg-secondary text-on-primary rounded-2xl p-6 border border-secondary/20 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-on-primary/80 font-semibold text-sm group-hover:text-on-primary transition-colors">Following</span>
                    <User size={20} className="text-on-primary" />
                  </div>
                  <p className="text-4xl font-bold text-on-primary">
                    {user.following?.length || 0}
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Published Articles Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-warning rounded-xl">
              <FileText size={24} className="text-on-primary" />
            </div>
            <h2 className="text-4xl font-bold text-text-primary dark:text-text-inverse">
              Published Articles
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {userBlogs.length} {userBlogs.length === 1 ? 'article' : 'articles'} published
          </p>
        </div>

        {userBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userBlogs.map((blog, idx) => {
              const colors = ['bg-primary', 'bg-error', 'bg-secondary', 'bg-warning'];
              const textColors = ['text-primary', 'text-error', 'text-secondary', 'text-warning'];
              return (
                <article
                  key={blog._id}
                  onClick={() => navigate(`/blog/${blog._id}/preview`)}
                  className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 dark:border-slate-800 cursor-pointer backdrop-blur"
                >
                  {/* Solid Color Top Border */}
                  <div className={`h-1 ${colors[idx % 4]}`}></div>

                  {/* Image Container */}
                  {blog.images && blog.images.length > 0 && (
                    <div className="relative overflow-hidden h-52 bg-neutral-200 dark:bg-neutral-700">
                      <img
                        src={blog.images[0]}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                      <Calendar size={14} />
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-text-primary dark:text-text-inverse line-clamp-2 group-hover:opacity-80 transition-opacity">
                      {blog.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
                      {blog.short_description}
                    </p>

                    {/* Read More */}
                    <div className="pt-4 border-t border-gray-200 dark:border-slate-800">
                      <button className={`font-semibold text-sm flex items-center gap-1 transition-all group-hover:gap-2 ${textColors[idx % 4]} dark:opacity-90 hover:opacity-100`}>
                        Read More
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-surface-primary dark:bg-surface-dark rounded-2xl border-2 border-dashed border-border-light dark:border-border-dark p-16 text-center">
            <div className="inline-block p-4 bg-primary rounded-2xl mb-6">
              <FileText size={64} className="text-on-primary" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary dark:text-text-inverse mb-3">
              No articles published yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              This author is working on their first piece!
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

export default UserProfile;
