import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, FileText, ArrowLeft, UserCheck, UserPlus } from 'lucide-react';

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
  
  // Handle empty object from App.js - use localStorage instead
  const loggedInUser = (currentUser && Object.keys(currentUser).length > 0) ? currentUser : storedUser;

  // Normalize user ID field (_id or id)
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
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', margin: '0 auto 1rem', border: '4px solid #e5e7eb', borderTopColor: '#60A5FA', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <p style={{ color: '#6b7280' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>User not found</p>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#60A5FA', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isOwnProfile = !userId || loggedInUser?._id === user._id;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem 1rem' }}>
      {alert && (
        <div style={{ maxWidth: '1200px', margin: '0 auto 2rem auto', padding: '1rem', backgroundColor: alert.type === 'error' ? '#fee2e2' : alert.type === 'warning' ? '#fef3c7' : '#dcfce7', borderRadius: '8px', border: `1px solid ${alert.type === 'error' ? '#fecaca' : alert.type === 'warning' ? '#fcd34d' : '#86efac'}`, color: alert.type === 'error' ? '#991b1b' : alert.type === 'warning' ? '#92400e' : '#166534', display: 'flex', justifyContent: 'space-between' }}>
          <p>{alert.message}</p>
          <button onClick={() => setAlert(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {!isOwnProfile && (
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: '0.75rem 1rem', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem', color: '#374151', fontWeight: '500' }}>
            <ArrowLeft size={18} /> Go Back
          </button>
        )}

        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={60} />
                )}
              </div>
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '30px', height: '30px', backgroundColor: '#10b981', borderRadius: '50%', border: '3px solid white' }}></div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', margin: 0, marginBottom: '0.5rem' }}>{user.name}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280' }}>
                    <Mail size={16} />
                    <span>{user.email}</span>
                  </div>
                </div>
                {!isOwnProfile && (
                  <button onClick={handleFollowToggle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: isFollowing ? '#e5e7eb' : '#60A5FA', color: isFollowing ? '#374151' : 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
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

              {user.bio && (
                <p style={{ color: '#4b5563', fontSize: '1rem', marginBottom: '1.5rem', fontStyle: 'italic' }}>"{user.bio}"</p>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#60A5FA', marginBottom: '0.5rem' }}>{user.totalBlogs || 0}</div>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>Articles</p>
                </div>
                <button onClick={() => navigate(`/followers/${user._id}`)} style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #e5e7eb', cursor: 'pointer', fontWeight: 'normal' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.borderColor = '#60A5FA'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.borderColor = '#e5e7eb'; }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a855f7', marginBottom: '0.5rem' }}>{user.followers?.length || 0}</div>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>Followers</p>
                </button>
                <button onClick={() => navigate(`/following/${user._id}`)} style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #e5e7eb', cursor: 'pointer', fontWeight: 'normal' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.borderColor = '#ec4899'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.borderColor = '#e5e7eb'; }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ec4899', marginBottom: '0.5rem' }}>{user.following?.length || 0}</div>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>Following</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#60A5FA', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <FileText size={24} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Published Articles</h2>
          </div>

          {userBlogs.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {userBlogs.map((blog) => (
                <div key={blog._id} onClick={() => navigate(`/blog/${blog._id}/preview`)} style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#60A5FA'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(96, 165, 250, 0.2)'; e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  {blog.images && blog.images.length > 0 && <img src={blog.images[0]} alt={blog.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827', margin: '0 0 0.75rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{blog.title}</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0 0 1rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>{blog.short_description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                      <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      <span style={{ color: '#60A5FA', fontWeight: '600' }}>Read →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '2px dashed #d1d5db' }}>
              <FileText size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
              <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#4b5563', margin: '0 0 0.5rem 0' }}>No articles published yet</p>
              <p style={{ color: '#9ca3af', margin: 0 }}>This author is working on their first piece!</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
