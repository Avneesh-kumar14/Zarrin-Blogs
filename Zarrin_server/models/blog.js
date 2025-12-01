const { Schema, model, default: mongoose } = require('mongoose')
const BlogSchema = new Schema({
  title: { type: String, required: true },
  blog_content: { type: String, required: true },
  short_description: { type: String },
  images: [{ type: String }],
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'category' }],
  tags: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled'],
    default: 'published'
  },
  scheduledAt: { type: Date },
  views: { type: Number, default: 0 },
  wordCount: { type: Number, default: 0 },
  readingTime: { type: Number, default: 0 }
}, { timestamps: true });

const Blog = model('blog', BlogSchema);
module.exports = Blog;