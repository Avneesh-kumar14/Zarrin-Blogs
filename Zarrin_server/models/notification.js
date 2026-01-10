const { Schema, model } = require('mongoose');

const NotificationSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    default: null
  },
  type: {
    type: String,
    enum: ['like', 'comment', 'follow', 'bookmark', 'trending'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  // Reference to the blog or article
  blog: {
    type: Schema.Types.ObjectId,
    ref: 'blog',
    default: null
  },
  // Reference to the comment
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'comment',
    default: null
  },
  // Additional data
  data: {
    type: Schema.Types.Mixed,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = model('notification', NotificationSchema);
