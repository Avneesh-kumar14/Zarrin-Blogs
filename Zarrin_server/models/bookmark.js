const { Schema, model, default: mongoose } = require('mongoose');

const BookmarkSchema = new Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'blog', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  createdAt: { type: Date, default: Date.now }
}, {
  // Ensure one bookmark per user per blog
  indexes: [{ blog: 1, user: 1, unique: true }]
});

const Bookmark = model('bookmark', BookmarkSchema);
module.exports = Bookmark;
