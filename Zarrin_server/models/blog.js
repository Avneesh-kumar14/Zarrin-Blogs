const { Schema, model, default: mongoose } = require('mongoose')
const BlogSchema = new Schema({
  title: { type: String, required: true },
  blog_content: { type: String, required: true },
  short_description: { type: String },
  images: [{ type: String }],
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'category' }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
}, { timestamps: true });

const Blog = model('blog', BlogSchema);
module.exports = Blog;