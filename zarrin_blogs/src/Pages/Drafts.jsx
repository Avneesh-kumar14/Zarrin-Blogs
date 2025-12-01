import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, Edit2, Plus } from 'lucide-react';
import Heading from '../Component/Common/Heading';
import Paragraph from '../Component/Common/Paragraph';
import Alert from '../Component/Common/Alert';

const Drafts = ({ isAuthenticated, currentUser }) => {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [deleting, setDeleting] = useState(null);
  
  // Get current user from localStorage if not provided as prop
  const user = currentUser || JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const isAuth = isAuthenticated !== undefined ? isAuthenticated : !!token;

  useEffect(() => {
    // Get user from localStorage if not provided
    const userData = user || JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!isAuth) {
      console.log('Not authenticated');
      navigate('/login');
      return;
    }
    if (userData?._id) {
      console.log('Fetching drafts for user:', userData._id);
      fetchDrafts();
    } else {
      console.log('No user ID found');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth, navigate]);

  const fetchDrafts = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');
      
      if (!userData?._id || !token) {
        throw new Error('User data or token missing');
      }

      console.log('Fetching drafts from:', `http://localhost:8200/api/users/${userData._id}/drafts`);
      
      const res = await fetch(`http://localhost:8200/api/users/${userData._id}/drafts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', res.status);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch drafts');
      }
      
      const data = await res.json();
      console.log('Drafts fetched:', data);
      setDrafts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching drafts:', err);
      setAlert({ type: 'error', message: 'Failed to load drafts: ' + err.message });
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDraft = async (blogId) => {
    if (!window.confirm('Delete this draft?')) return;

    try {
      setDeleting(blogId);
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8200/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete draft');
      setDrafts(drafts.filter(d => d._id !== blogId));
      setAlert({ type: 'success', message: 'Draft deleted' });
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to delete draft: ' + err.message });
    } finally {
      setDeleting(null);
    }
  };

  const handleEditDraft = (blogId) => {
    navigate(`/blog/${blogId}/edit`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 dark:from-blue-700 via-purple-600 dark:via-purple-700 to-pink-600 dark:to-pink-700 text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-lg rounded-lg">
                <FileText size={36} className="text-white" />
              </div>
              <Heading type="h1" className="text-5xl md:text-6xl font-bold">
                My Drafts
              </Heading>
            </div>
            <button
              onClick={() => navigate('/blog/create')}
              className="flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 font-bold shadow-xl transform hover:scale-105 transition-all"
            >
              <Plus size={20} />
              New Draft
            </button>
          </div>
          <Paragraph className="text-blue-50 text-lg">
            ✍️ Create, edit, and manage your blog drafts before publishing
          </Paragraph>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {alert && (
          <div className="mb-8 animate-fade-in">
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
              duration={4000}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <Paragraph className="text-gray-600 text-lg">Loading your drafts...</Paragraph>
          </div>
        ) : drafts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {drafts.map((draft) => (
              <div
                key={draft._id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transform hover:scale-105"
              >
                {draft.images && draft.images.length > 0 && (
                  <div className="h-48 overflow-hidden bg-gradient-to-br from-gray-200 dark:from-gray-700 to-gray-300 dark:to-gray-600 relative">
                    <img
                      src={draft.images[0]}
                      alt={draft.title}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Heading type="h3" className="text-xl font-bold text-gray-900 flex-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {draft.title}
                    </Heading>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full whitespace-nowrap">
                      📝 Draft
                    </span>
                  </div>

                  <Paragraph className="text-gray-600 text-sm mb-5 line-clamp-2">
                    {draft.short_description}
                  </Paragraph>

                  <div className="text-xs text-gray-500 font-semibold mb-6 pb-4 border-b border-gray-200">
                    Last updated: {new Date(draft.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditDraft(draft._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold text-sm shadow-md transform hover:scale-105 transition-all"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDraft(draft._id)}
                      disabled={deleting === draft._id}
                      className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 font-semibold shadow-md transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gradient-to-br from-blue-50 dark:from-gray-800 via-purple-50 dark:via-gray-700 to-pink-50 dark:to-gray-800 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <FileText size={200} className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-900" />
            </div>
            <div className="relative z-10">
              <FileText size={64} className="mx-auto text-gray-400 mb-4" />
              <Heading type="h2" className="text-3xl font-bold text-gray-700 mb-2">
                No drafts yet
              </Heading>
              <Paragraph className="text-gray-600 text-lg mb-8">
                Start writing your next blog post! Create a draft and save your work.
              </Paragraph>
              <button
                onClick={() => navigate('/blog/create')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-bold shadow-lg transform hover:scale-105 transition-all inline-block"
              >
                ✍️ Create New Blog
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drafts;
