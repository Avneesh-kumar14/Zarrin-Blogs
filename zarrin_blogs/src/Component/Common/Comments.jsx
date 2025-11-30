import React, { useState, useEffect } from 'react';
import { MessageCircle, Trash2, Edit2, X } from 'lucide-react';
import Heading from '../Common/Heading';
import Paragraph from '../Common/Paragraph';
import Button from '../Common/Button';
import Alert from '../Common/Alert';

const Comments = ({ blogId, currentUser, isAuthenticated }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [alert, setAlert] = useState(null);
  const [charCount, setCharCount] = useState(0);

  // Fetch comments on mount
  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8200/api/comments/blog/${blogId}`
      );
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setAlert({ type: 'error', message: 'Failed to load comments' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setAlert({ type: 'warning', message: 'Please log in to comment' });
      return;
    }

    if (newComment.trim().length < 1 || newComment.length > 1000) {
      setAlert({
        type: 'error',
        message: 'Comment must be 1-1000 characters'
      });
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8200/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          blogId,
          content: newComment
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to post comment');
      }

      const data = await res.json();
      setComments([data.comment, ...comments]);
      setNewComment('');
      setCharCount(0);
      setAlert({ type: 'success', message: 'Comment posted successfully!' });
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (editingText.trim().length < 1 || editingText.length > 1000) {
      setAlert({
        type: 'error',
        message: 'Comment must be 1-1000 characters'
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8200/api/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: editingText })
      });

      if (!res.ok) throw new Error('Failed to update comment');
      const data = await res.json();
      
      setComments(comments.map(c => c._id === commentId ? data.comment : c));
      setEditingId(null);
      setEditingText('');
      setAlert({ type: 'success', message: 'Comment updated successfully!' });
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8200/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete comment');
      
      setComments(comments.filter(c => c._id !== commentId));
      setAlert({ type: 'success', message: 'Comment deleted successfully!' });
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    }
  };

  const canEditDelete = (comment) => {
    return currentUser && (currentUser._id === comment.author?._id || currentUser.isAdmin);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
      {alert && (
        <div className="mb-6">
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
            duration={4000}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle size={24} className="text-blue-600" />
        <Heading type="h3" className="text-2xl font-bold">
          Comments ({comments.length})
        </Heading>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-8 pb-8 border-b border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Comment
            </label>
            <textarea
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);
                setCharCount(e.target.value.length);
              }}
              placeholder="Share your thoughts on this blog..."
              maxLength="1000"
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {charCount}/1000 characters
              </span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting || charCount < 1 || charCount > 1000}
            variant="primary"
            className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            text={submitting ? 'Posting...' : 'Post Comment'}
          />
        </form>
      ) : (
        <div className="mb-8 pb-8 border-b border-gray-200 bg-blue-50 rounded-lg p-4">
          <Paragraph className="text-blue-900 text-center">
            Please log in to post a comment
          </Paragraph>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              {editingId === comment._id ? (
                // Edit Mode
                <div>
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    maxLength="1000"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => handleEditComment(comment._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      text="Save"
                    />
                    <Button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                      text="Cancel"
                    />
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  {/* Author Info */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <Paragraph className="font-semibold text-gray-900">
                        {comment.author?.name || 'Anonymous'}
                      </Paragraph>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()} at{' '}
                        {new Date(comment.createdAt).toLocaleTimeString()}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    {canEditDelete(comment) && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(comment._id);
                            setEditingText(comment.content);
                          }}
                          className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                          title="Edit comment"
                        >
                          <Edit2 size={16} className="text-yellow-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete comment"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Comment Text */}
                  <Paragraph className="text-gray-700 leading-relaxed">
                    {comment.content}
                  </Paragraph>

                  {/* Likes */}
                  {comment.likes > 0 && (
                    <div className="mt-3 text-sm text-gray-600">
                      👍 {comment.likes} like{comment.likes !== 1 ? 's' : ''}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageCircle size={40} className="mx-auto text-gray-300 mb-3" />
          <Paragraph className="text-gray-600">
            No comments yet. Be the first to comment!
          </Paragraph>
        </div>
      )}
    </div>
  );
};

export default Comments;
