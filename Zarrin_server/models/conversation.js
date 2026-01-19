const { Schema, model } = require('mongoose');

const ConversationSchema = new Schema({
  // Participants in the conversation
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],

  // Conversation name (for group chats)
  conversationName: {
    type: String,
    default: null // null for one-on-one chats
  },

  // Type of conversation
  conversationType: {
    type: String,
    enum: ['direct', 'group'],
    default: 'direct'
  },

  // Group description
  groupDescription: {
    type: String,
    default: null
  },

  // Group avatar
  groupAvatar: {
    type: String,
    default: null
  },

  // Last message reference for quick access
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },

  // Last message preview and timestamp
  lastMessagePreview: {
    type: String,
    default: null
  },

  lastMessageTime: {
    type: Date,
    default: null
  },

  // Creator of the group (for group chats)
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Track if conversation is muted for each user
  mutedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],

  // Track if conversation is pinned for each user
  pinnedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],

  // Track if conversation is archived for each user
  archivedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  updatedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { 
  timestamps: true,
  collection: 'conversations'
});

// Indexes for performance
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ createdAt: -1 });
ConversationSchema.index({ lastMessageTime: -1 });
ConversationSchema.index({ conversationType: 1 });

module.exports = model('Conversation', ConversationSchema);
