const { Schema, model, default: mongoose } = require('mongoose');

const LikeSchema = new Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'blog', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
}, { 
  // Ensure one like per user per blog
  indexes: [{ blog: 1, user: 1, unique: true }]
});

const Like = model('like', LikeSchema);
module.exports = Like;
