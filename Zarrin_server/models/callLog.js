// File: Zarrin_server/models/callLog.js

const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true
  },
  initiatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  callType: {
    type: String,
    enum: ['audio', 'video'],
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'missed', 'rejected', 'failed'],
    default: 'completed'
  },
  duration: {
    type: Number, // in seconds
    default: 0,
    min: 0
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  initiatorLeftTime: {
    type: Date
  },
  recipientLeftTime: {
    type: Date
  },
  // Quality metrics
  quality: {
    type: String,
    enum: ['poor', 'fair', 'good', 'excellent'],
    default: 'good'
  },
  connectionStrength: {
    type: Number,
    min: 0,
    max: 100
  },
  // Metadata
  metadata: {
    initiatorDeviceType: String, // 'mobile', 'desktop'
    recipientDeviceType: String,
    initiatorBrowser: String,
    recipientBrowser: String,
    initiatedVideoEnabled: Boolean,
    initiatedAudioEnabled: Boolean
  },
  rejectionReason: String,
  failureReason: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for queries
callLogSchema.index({ conversationId: 1, createdAt: -1 });
callLogSchema.index({ initiatorId: 1, createdAt: -1 });
callLogSchema.index({ recipientId: 1, createdAt: -1 });
callLogSchema.index({ status: 1, callType: 1 });

// Virtual for formatted duration
callLogSchema.virtual('formattedDuration').get(function() {
  const minutes = Math.floor(this.duration / 60);
  const seconds = this.duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});

// Pre-save hook to update endTime and duration
callLogSchema.pre('save', function(next) {
  if (this.endTime) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('CallLog', callLogSchema);
