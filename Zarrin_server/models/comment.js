const { Schema, model, default: mongoose } = require('mongoose');

const CommentSchema = new Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'blog', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 1000 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ✅ Database Indexes for optimal query performance
CommentSchema.index({ blog: 1, createdAt: -1 }); // Get comments for a blog
CommentSchema.index({ author: 1 }); // Get comments by user

const Comment = model('comment', CommentSchema);
module.exports = Comment;
