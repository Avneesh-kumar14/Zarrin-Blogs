
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Headings from "../Common/Heading";
import Paragraph from "../Common/Paragraph";
import Button from "../Common/Button";
import Image from "../Common/Image";
import { X } from "lucide-react"; 

const BlogForm = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:8200/api/categories');
        if (!res.ok) {
          console.error('Failed to fetch categories:', res.status);
          throw new Error(`Failed to fetch categories: ${res.status}`);
        }
        const data = await res.json();
        console.log('Categories fetched:', data);
        setCategories(data);
      } catch (err) {
        console.error('Category fetch error:', err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [shortDesc, setShortDesc] = useState("");
  const [content, setContent] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    // Check if category already exists
    if (categories.some(cat => cat.name.toLowerCase() === newCategory.trim().toLowerCase())) {
      alert('Category already exists');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8200/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCategory.trim() })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create category');
      }

      const newCat = await res.json();
      setCategories([...categories, newCat]);
      setNewCategory("");
      alert('Category created successfully!');
    } catch (err) {
      console.error('Error creating category:', err);
      alert('Error: ' + err.message);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const uploadedImages = [];

      // Upload each image to Cloudinary
      for (const file of files) {
        console.log(`Starting upload for file: ${file.name}, size: ${file.size} bytes`);
        
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch('http://localhost:8200/api/upload/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        console.log(`Upload response status: ${res.status} for ${file.name}`);

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(`Failed to upload ${file.name}: ${errorData.message || res.statusText}`);
        }

        const data = await res.json();
        console.log(`Upload success for ${file.name}. URL:`, data.url);

        uploadedImages.push({
          file: file,
          preview: data.url,
          cloudinaryUrl: data.url
        });
      }

      setImages((prev) => [...prev, ...uploadedImages]);
      console.log('All images uploaded to Cloudinary:', uploadedImages);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading images: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a blog title');
      return;
    }
    if (!category) {
      alert('Please select a category');
      return;
    }
    if (!shortDesc.trim()) {
      alert('Please enter a short description');
      return;
    }
    if (!content.trim()) {
      alert('Please enter blog content');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const blogData = {
        title: title.trim(),
        category: category ? [category] : [],
        shortDesc: shortDesc.trim(),
        content,
        images: images.map(img => img.cloudinaryUrl || img.preview)
      };

      const res = await fetch('http://localhost:8200/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(blogData)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create blog');
      }
      alert('Blog submitted successfully!');
      setTitle('');
      setCategory('');
      setShortDesc('');
      setContent('');
      setImages([]);
      setPreviewMode(false);
      // Redirect to MyBlogs after successful submission
      setTimeout(() => {
        window.location.href = '/dashboard/myblogs';
      }, 1000);
    } catch (err) {
      console.error('Blog submission error:', err);
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="p-6 bg-tertiary rounded-lg shadow-md max-w-6xl w-full mx-auto mt-6">
      {!previewMode ? (
        <form onSubmit={handleSubmit}>
          <Headings type="h5" className="font-bold mb-4">
            Add New Blog
          </Headings>

          <label className="block mb-2 font-semibold">Title</label>
          <input
            type="text"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-secondaryGray rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />

          <label className="block mb-2 font-semibold">Category</label>
          <div className="flex gap-2 mb-4 flex-wrap w-full">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 border border-secondaryGray rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select category</option>
              {categories && categories.length > 0 && categories.map((cat) => (
                <option key={cat._id || cat} value={cat._id || cat}>
                  {cat.name || cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 border border-secondaryGray rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              variant="primary"
              onClick={handleAddCategory}
              type="button"
              className="hover:bg-secondaryGray px-4 rounded-lg"
            >
              Add
            </Button>
          </div>

          <label className="block mb-2 font-semibold">Upload Images to Cloudinary</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploading}
            className="mb-4 w-full disabled:opacity-50"
          />
          {uploading && <Paragraph className="text-blue-500 mb-4">Uploading images to Cloudinary...</Paragraph>}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative border rounded-lg overflow-hidden"
                >
                  <Image
                    src={img.preview}
                    alt={`Preview ${index}`}
                    className="w-full h-40 object-cover"
                  />
                  <Button
                    variant="dark"
                    onClick={() => handleDeleteImage(index)}
                    type="button"
                    className="absolute top-1 right-1 text-xs px-2 py-1 rounded flex items-center justify-center"
                  >
                    <X size={14} /> 
                  </Button>
                </div>
              ))}
            </div>
          )}

          <label className="block mb-2 font-semibold">Short Description</label>
          <textarea
            placeholder="Write a short description..."
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            className="w-full border border-secondaryGray rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
            rows="3"
            required
          ></textarea>

          <label className="block mb-2 font-semibold">Blog Content</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            theme="snow"
            className="mb-6 w-full"
          />

          <div className="flex justify-between">
            <Button
              variant="primary"
              type="submit"
              className="font-semibold py-2 px-4 rounded-lg"
            >
              Submit
            </Button>
            <Button
              variant="primary"
              type="button"
              onClick={handlePreview}
              className="font-semibold py-2 px-4 rounded-lg"
            >
              Preview
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <Headings type="h5" className="font-bold mb-2">
            {title}
          </Headings>
          <Paragraph variant="big" className="text-dark mb-4">
            {category}
          </Paragraph>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {images.map((img, index) => (
                <Image 
                  key={index}
                  src={img.preview}
                  alt={`Preview ${index}`}
                  className="w-full h-40 object-cover"
                />
              ))}
            </div>
          )}

          <Paragraph className="mb-4">{shortDesc}</Paragraph>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>

          <Button
            variant="dark"
            onClick={handlePreview}
            className="mt-4 font-semibold py-2 px-4 rounded-lg"
          >
            Back to Edit
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogForm;
