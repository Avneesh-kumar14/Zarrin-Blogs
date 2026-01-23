const { Schema, model } = require('mongoose');

const MessageSchema = new Schema({
  // Reference to conversation
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true
  },

  // Sender of the message
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Message content
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },

  // Message type (text, image, file, etc.)
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },

  // Media attachments (for images, files) - just store URLs like blog stores images
  attachments: [{ type: String }],

  // Track who has read the message
  readBy: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      readAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // Edit history (for edited messages)
  editHistory: [
    {
      content: String,
      editedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // Check if message is deleted (soft delete)
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },

  // Deleted by user (for showing "This message was deleted")
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Reply to another message (for message threading)
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },

  // Emoji reactions
  reactions: [
    {
      emoji: String,
      users: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User'
        }
      ]
    }
  ],

  // Message pin status
  isPinned: {
    type: Boolean,
    default: false,
    index: true
  },

  // Pin info
  pinnedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  pinnedAt: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  collection: 'messages'
});

// Indexes for performance
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ isDeleted: 1, conversationId: 1 });
MessageSchema.index({ isPinned: 1, conversationId: 1 });
MessageSchema.index({ senderId: 1 }); // For faster deletion authorization checks
MessageSchema.index({ conversationId: 1, isDeleted: 1 }); // For message queries

module.exports = model('Message', MessageSchema);
