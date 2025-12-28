import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, FileText, ArrowLeft, UserCheck, UserPlus, Calendar, BookOpen, Heart } from 'lucide-react';
import Alert from '../Component/Common/Alert';
import Paragraph from '../Component/Common/Paragraph';

const UserProfile = ({ currentUser, isAuthenticated }) => {
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

  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log('=== Fetching Profile ===');
      console.log('userId param:', userId);
      console.log('currentUser prop:', currentUser);
      console.log('storedUser:', storedUser);
      console.log('loggedInUser:', loggedInUser);
      console.log('loggedInUser ID:', getUserId(loggedInUser));
      
      let userData;
      
      if (!userId) {
        console.log('No userId - using logged in user');
        userData = loggedInUser;
        console.log('userData from loggedInUser:', userData);
      } else {
        console.log('Fetching from API for userId:', userId);
        const res = await fetch(`http://localhost:8200/api/users/${userId}`);
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
      
      const blogsRes = await fetch(`http://localhost:8200/api/users/${getUserId(userData)}/blogs`);
      if (blogsRes.ok) {
        const blogs = await blogsRes.json();
        setUserBlogs(Array.isArray(blogs) ? blogs : []);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setAlert({ type: 'error', message: err.message });
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleFollowToggle = async () => {
    if (!token) {
      setAlert({ type: 'warning', message: 'Please log in to follow users' });
      return;
    }

    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      const res = await fetch(`http://localhost:8200/api/users/${user._id}/follow`, {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-slate-700 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700">
          <FileText size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">User not found</p>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = !userId || loggedInUser?._id === user._id;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-pink-600 to-amber-600 dark:from-indigo-700 dark:via-pink-700 dark:to-amber-700 text-white py-16 sm:py-24">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isOwnProfile && (
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 mb-8 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm border border-white/20 text-white transition-all"
            >
              <ArrowLeft size={18} /> Go Back
            </button>
          )}
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
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
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Avatar Section */}
            <div className="col-span-1 flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center shadow-2xl ring-4 ring-white dark:ring-slate-700 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={80} className="text-white" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-700 shadow-lg"></div>
              </div>

              {!isOwnProfile && (
                <button 
                  onClick={handleFollowToggle} 
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                    isFollowing
                      ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
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
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.name}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                  <Mail size={18} />
                  <span className="text-lg">{user.email}</span>
                </div>
                {user.bio && (
                  <p className="text-lg text-gray-700 dark:text-gray-300 italic max-w-2xl leading-relaxed">
                    "{user.bio}"
                  </p>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400 font-semibold">Articles</span>
                    <BookOpen size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    {user.totalBlogs || 0}
                  </p>
                </div>

                <button 
                  onClick={() => navigate(`/followers/${user._id}`)}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400 font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Followers</span>
                    <User size={20} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                    {user.followers?.length || 0}
                  </p>
                </button>

                <button 
                  onClick={() => navigate(`/following/${user._id}`)}
                  className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-900/10 rounded-2xl p-6 border border-pink-200 dark:border-pink-800 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400 font-semibold group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">Following</span>
                    <User size={20} className="text-pink-600 dark:text-pink-400" />
                  </div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent">
                    {user.following?.length || 0}
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Published Articles Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
              <FileText size={24} className="text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Published Articles
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {userBlogs.length} {userBlogs.length === 1 ? 'article' : 'articles'} published
          </p>
        </div>

        {userBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userBlogs.map((blog) => (
              <article
                key={blog._id}
                onClick={() => navigate(`/blog/${blog._id}/preview`)}
                className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 border border-gray-100 dark:border-slate-700 cursor-pointer"
              >
                {/* Image Container */}
                {blog.images && blog.images.length > 0 && (
                  <div className="relative overflow-hidden h-52 bg-gray-200 dark:bg-slate-700">
                    <img
                      src={blog.images[0]}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {blog.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">
                    {blog.short_description}
                  </p>

                  {/* Read More */}
                  <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                    <button className="text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-2 flex items-center gap-1 transition-all">
                      Read More
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-600 p-16 text-center">
            <FileText size={64} className="mx-auto text-gray-300 dark:text-slate-600 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              No articles published yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              This author is working on their first piece!
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

export default UserProfile;
