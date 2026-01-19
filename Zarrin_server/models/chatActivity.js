const { Schema, model } = require('mongoose');

const ChatActivitySchema = new Schema({
  // User who is performing the activity
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Conversation the activity is in
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true
  },

  // Type of activity
  activityType: {
    type: String,
    enum: ['typing', 'online', 'offline', 'recording', 'calling'],
    required: true,
    index: true
  },

  // For typing indicator - character count
  characterCount: {
    type: Number,
    default: 0
  },

  // Last activity timestamp
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
    expires: 3600 // Auto-expire after 1 hour (TTL index)
  }
}, { 
  timestamps: false,
  collection: 'chatActivities'
});

// Compound index for queries
ChatActivitySchema.index({ userId: 1, conversationId: 1, activityType: 1 });

module.exports = model('ChatActivity', ChatActivitySchema);
