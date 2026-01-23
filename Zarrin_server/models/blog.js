const { Schema, model, default: mongoose } = require('mongoose')
const BlogSchema = new Schema({
  title: { type: String, required: true },
  blog_content: { type: String, required: true },
  short_description: { type: String },
  images: [{ type: String }],
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'category' }],
  tags: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled'],
    default: 'published'
  },
  scheduledAt: { type: Date },
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  wordCount: { type: Number, default: 0 },
  readingTime: { type: Number, default: 0 }
}, { timestamps: true });

// ✅ Database Indexes for optimal query performance
BlogSchema.index({ title: 'text', short_description: 'text' }); // Full text search
BlogSchema.index({ category: 1 }); // Filter by category
BlogSchema.index({ author: 1 }); // Filter by author
BlogSchema.index({ createdAt: -1 }); // Sort by date
BlogSchema.index({ views: -1 }); // Sort by views
BlogSchema.index({ status: 1 }); // Filter by status

const Blog = model('blog', BlogSchema);
module.exports = Blog;