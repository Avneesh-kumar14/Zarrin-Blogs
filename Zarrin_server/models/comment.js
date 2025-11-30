const { Schema, model, default: mongoose } = require('mongoose');

const CommentSchema = new Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'blog', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  content: { type: String, required: true, maxlength: 1000 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Comment = model('comment', CommentSchema);
module.exports = Comment;
