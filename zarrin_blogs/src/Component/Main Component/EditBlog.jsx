import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Heading from '../Common/Heading';
import Paragraph from '../Common/Paragraph';
import Button from '../Common/Button';
import Image from '../Common/Image';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    content: '',
    category: []
  });

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:8200/api/blogs/${id}`);
        if (!res.ok) throw new Error('Failed to fetch blog');
        const data = await res.json();
        setBlog(data);
        setFormData({
          title: data.title,
          shortDesc: data.short_description || '',
          content: data.blog_content,
          category: data.category && data.category.length > 0 ? data.category.map(c => c._id) : []
        });
        setImages(data.images || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:8200/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
    if (id) fetchBlog();
  }, [id]);

  // Handle image upload to Cloudinary
  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    setError('');
    try {
      const newImages = [];
      for (let file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('http://localhost:8200/api/upload/upload', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) throw new Error('Image upload failed');
        const data = await res.json();
        newImages.push(data.secure_url);
      }
      setImages([...images, ...newImages]);
    } catch (err) {
      setError('Failed to upload images: ' + err.message);
    }
  };

  // Remove image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      category: selectedOptions
    }));
  };

  // Handle content change
  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!formData.title.trim() || !formData.content.trim() || !formData.shortDesc.trim()) {
      setError('Title, description, and content are required');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`http://localhost:8200/api/blogs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          shortDesc: formData.shortDesc,
          images: images,
          category: formData.category
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update blog');
      }

      navigate(`/blog/${id}/preview`);
    } catch (err) {
      setError('Error updating blog: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center"><Paragraph>Loading blog...</Paragraph></div>;
  if (error && !blog) return <div className="p-8 text-center"><Paragraph className="text-red-500">Error: {error}</Paragraph></div>;
  if (!blog) return <div className="p-8 text-center"><Paragraph>Blog not found</Paragraph></div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Heading type="h2" className="font-bold mb-6">Edit Blog</Heading>

      {error && <Paragraph className="text-red-500 mb-4 p-4 bg-red-50 rounded">{error}</Paragraph>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-2">Blog Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">Short Description</label>
          <textarea
            name="shortDesc"
            value={formData.shortDesc}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold mb-2">Select Categories</label>
          <select
            multiple
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories && categories.length > 0 && categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <Paragraph className="text-sm text-gray-500 mt-1">Hold Ctrl (Cmd on Mac) to select multiple categories</Paragraph>
        </div>

        {/* Rich Text Editor */}
        <div>
          <label className="block text-sm font-semibold mb-2">Blog Content</label>
          <ReactQuill
            value={formData.content}
            onChange={handleContentChange}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'blockquote', 'code-block'],
                ['clean']
              ]
            }}
            theme="snow"
            className="bg-white rounded-lg border border-gray-300"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-semibold mb-2">Upload Images to Cloudinary</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <Paragraph className="text-sm text-gray-500 mt-1">Select JPEG, PNG, GIF, or WebP images (max 5MB each)</Paragraph>
        </div>

        {/* Image Preview */}
        {images.length > 0 && (
          <div>
            <Heading type="h5" className="font-semibold mb-3">Uploaded Images</Heading>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <Image src={img} alt={`Preview ${idx}`} className="h-32 w-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            variant="primary"
            className="px-6 py-3"
            disabled={submitting}
          >
            {submitting ? 'Updating...' : 'Update Blog'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="px-6 py-3"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
