const mongoose = require('mongoose');

const readingProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
    scrollPosition: {
      type: Number,
      default: 0,
      min: 0,
      max: 100, // percentage
    },
    timeSpent: {
      type: Number,
      default: 0, // seconds
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    lastReadAt: {
      type: Date,
      default: Date.now,
    },
    startedReadingAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast queries
readingProgressSchema.index({ userId: 1, blogId: 1 }, { unique: true });
readingProgressSchema.index({ userId: 1, lastReadAt: -1 });

module.exports = mongoose.model('ReadingProgress', readingProgressSchema);
