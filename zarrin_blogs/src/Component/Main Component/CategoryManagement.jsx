// import React, { useState, useEffect } from 'react';
// import Headings from '../Common/Heading';
// import Button from '../Common/Button';
// import Paragraph from '../Common/Paragraph';

// const CategoryManagement = () => {
//   const [categories, setCategories] = useState([]);
//   const [newCategory, setNewCategory] = useState('');
//   const [editingId, setEditingId] = useState(null);
//   const [editName, setEditName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       const res = await fetch('/api/categories', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       if (!res.ok) throw new Error('Failed to fetch categories');
//       const data = await res.json();
//       setCategories(data);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Add new category
//   const handleAddCategory = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch('/api/categories', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ name: newCategory })
//       });
//       if (!res.ok) throw new Error('Failed to create category');
//       setNewCategory('');
//       fetchCategories();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete category
//   const handleDeleteCategory = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this category?')) return;
    
//     try {
//       const res = await fetch(`/api/categories/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       if (!res.ok) throw new Error('Failed to delete category');
//       fetchCategories();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Edit category
//   const handleEditCategory = async (id) => {
//     try {
//       const res = await fetch(`/api/categories/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ name: editName })
//       });
//       if (!res.ok) throw new Error('Failed to update category');
//       setEditingId(null);
//       setEditName('');
//       fetchCategories();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const colorPalette = [
//     { gradient: 'from-indigo-500 to-indigo-600', light: 'from-indigo-50 to-indigo-100', border: 'border-indigo-200', dark: 'dark:from-indigo-900/20 dark:to-indigo-800/20 dark:border-indigo-700' },
//     { gradient: 'from-pink-500 to-pink-600', light: 'from-pink-50 to-pink-100', border: 'border-pink-200', dark: 'dark:from-pink-900/20 dark:to-pink-800/20 dark:border-pink-700' },
//     { gradient: 'from-amber-500 to-amber-600', light: 'from-amber-50 to-amber-100', border: 'border-amber-200', dark: 'dark:from-amber-900/20 dark:to-amber-800/20 dark:border-amber-700' },
//     { gradient: 'from-emerald-500 to-emerald-600', light: 'from-emerald-50 to-emerald-100', border: 'border-emerald-200', dark: 'dark:from-emerald-900/20 dark:to-emerald-800/20 dark:border-emerald-700' },
//   ];

//   const getColor = (index) => colorPalette[index % colorPalette.length];
//   const getInitial = (name) => name.charAt(0).toUpperCase();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 md:p-8">
//       {/* Header Section */}
//       <div className="max-w-6xl mx-auto mb-10">
//         <div className="mb-8">
//           <Headings type="h2" className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-pink-600 to-amber-600 dark:from-indigo-400 dark:via-pink-400 dark:to-amber-400 bg-clip-text text-transparent mb-3">
//             📁 Category Management
//           </Headings>
//           <Paragraph className="text-slate-600 dark:text-slate-400 text-lg">Organize and manage your blog categories effortlessly</Paragraph>
//         </div>

//         {error && (
//           <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
//             <Paragraph className="text-red-700 dark:text-red-300 font-semibold">{error}</Paragraph>
//           </div>
//         )}

//         {/* Add Category Form */}
//         <form onSubmit={handleAddCategory} className="mb-10">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600">
//             <div className="flex gap-3 md:gap-4 flex-col md:flex-row items-end">
//               <div className="flex-1 w-full">
//                 <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Add New Category</label>
//                 <input
//                   type="text"
//                   value={newCategory}
//                   onChange={(e) => setNewCategory(e.target.value)}
//                   placeholder="Enter category name..."
//                   className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-xl focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 transition-all duration-300 text-gray-800 placeholder-gray-400 dark:placeholder-slate-500"
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                     </svg>
//                     Adding...
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                     </svg>
//                     Add Category
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>

//       {/* Categories Grid */}
//       <div className="max-w-6xl mx-auto">
//         {categories.length === 0 ? (
//           <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-600 shadow-sm hover:shadow-md transition-all">
//             <div className="text-6xl mb-4">📂</div>
//             <Paragraph className="text-slate-600 dark:text-slate-400 text-lg font-medium mb-2">No categories yet</Paragraph>
//             <Paragraph className="text-slate-500 dark:text-slate-500">Create one to organize your blog posts</Paragraph>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {categories.map((category, index) => {
//               const color = getColor(index);
//               return (
//                 <div
//                   key={category._id}
//                   className={`group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 transform hover:scale-105 origin-center`}
//                 >
//                   {/* Gradient Top Bar */}
//                   <div className={`h-2 bg-gradient-to-r ${color.gradient}`}></div>

//                   {/* Content */}
//                   <div className="p-6">
//                     {editingId === category._id ? (
//                       <div className="space-y-4">
//                         <input
//                           type="text"
//                           value={editName}
//                           onChange={(e) => setEditName(e.target.value)}
//                           className="w-full px-4 py-2 border-2 border-indigo-300 dark:border-indigo-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition-all duration-300 text-gray-800 font-semibold"
//                           autoFocus
//                         />
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleEditCategory(category._id)}
//                             className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-md transition-all duration-300 transform hover:scale-105"
//                           >
//                             Save
//                           </button>
//                           <button
//                             onClick={() => {
//                               setEditingId(null);
//                               setEditName('');
//                             }}
//                             className="flex-1 px-4 py-2 bg-gray-300 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-slate-600 transition-all duration-300"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div>
//                         {/* Avatar */}
//                         <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${color.gradient} flex items-center justify-center text-white font-bold text-lg shadow-md mb-4 group-hover:scale-110 transition-transform duration-300`}>
//                           {getInitial(category.name)}
//                         </div>

//                         {/* Category Name */}
//                         <Headings type="h4" className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all">
//                           {category.name}
//                         </Headings>
//                         <Paragraph className="text-slate-500 dark:text-slate-400 text-sm mb-6">Manage this category</Paragraph>

//                         {/* Action Buttons */}
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => {
//                               setEditingId(category._id);
//                               setEditName(category.name);
//                             }}
//                             className={`flex-1 px-4 py-2 bg-gradient-to-r ${color.gradient} text-white rounded-lg font-semibold hover:shadow-md transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2`}
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                             </svg>
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDeleteCategory(category._id)}
//                             className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-md transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                             Delete
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {categories.length > 0 && (
//           <div className="mt-12 text-center">
//             <div className="inline-block px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-full border border-indigo-200 dark:border-indigo-700">
//               <Paragraph className="text-slate-700 dark:text-slate-300 font-semibold">
//                 Total Categories: <span className="text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-lg">{categories.length}</span>
//               </Paragraph>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


//       {/* Categories Grid */}
//       <div>
//         {categories.length === 0 ? (
//           <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300">
//             <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
//             </svg>
//             <Paragraph className="text-gray-500 text-lg">No categories yet. Create one to get started!</Paragraph>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {categories.map((category, index) => (
//               <div
//                 key={category._id}
//                 className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1"
//               >
//                 {/* Gradient Background */}
//                 <div className={`absolute top-0 left-0 right-0 h-20 bg-gradient-to-r ${getGradient(index)} opacity-90`}></div>

//                 {/* Avatar Circle */}
//                 <div className="relative pt-6 pb-8 px-6">
//                   <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getGradient(index)} flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
//                     {getInitial(category.name)}
//                   </div>

//                   {/* Content */}
//                   {editingId === category._id ? (
//                     <div className="space-y-4">
//                       <input
//                         type="text"
//                         value={editName}
//                         onChange={(e) => setEditName(e.target.value)}
//                         className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 text-gray-800 font-semibold"
//                         autoFocus
//                       />
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleEditCategory(category._id)}
//                           className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-md transition-all duration-300 transform hover:scale-105"
//                         >
//                           Save
//                         </button>
//                         <button
//                           onClick={() => {
//                             setEditingId(null);
//                             setEditName('');
//                           }}
//                           className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all duration-300"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <div>
//                       <Headings type="h4" className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
//                         {category.name}
//                       </Headings>
//                       <Paragraph className="text-gray-500 text-sm mb-6">Manage this category</Paragraph>

//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => {
//                             setEditingId(category._id);
//                             setEditName(category.name);
//                           }}
//                           className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-md transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
//                         >
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                           </svg>
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteCategory(category._id)}
//                           className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-md transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
//                         >
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                           </svg>
//                           Delete
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Hover Accent */}
//                 <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getGradient(index)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
//               </div>
//             ))}
//           </div>
//         )}

//         {categories.length > 0 && (
//           <div className="mt-12 text-center">
//             <Paragraph className="text-gray-500 font-semibold">
//               Total Categories: <span className="text-purple-600 text-lg">{categories.length}</span>
//             </Paragraph>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CategoryManagement;


import React, { useState, useEffect } from 'react';
import Headings from '../Common/Heading';
import Paragraph from '../Common/Paragraph';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: newCategory }),
      });
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditCategory = async (id) => {
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: editName }),
      });
      setEditingId(null);
      setEditName('');
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const getInitial = (name) => name.charAt(0).toUpperCase();

  return (
    <>
      <div className="min-h-screen p-6 bg-gray-50 dark:bg-slate-900">
        <Headings type="h2">📁 Category Management</Headings>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleAddCategory} className="mb-6 flex gap-3">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border px-3 py-2 flex-1"
            placeholder="New Category"
            required
          />
          <button className="bg-indigo-600 text-white px-4 py-2">
            Add
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white dark:bg-slate-800 p-5 rounded shadow"
            >
              {editingId === category._id ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border w-full px-3 py-2 mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditCategory(category._id)}
                      className="bg-green-600 text-white px-3 py-2 flex-1"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-400 px-3 py-2 flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xl font-bold mb-2">
                    {getInitial(category.name)} {category.name}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(category._id);
                        setEditName(category.name);
                      }}
                      className="bg-blue-600 text-white px-3 py-2 flex-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="bg-red-600 text-white px-3 py-2 flex-1"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {categories.length > 0 && (
          <Paragraph className="mt-6 text-center">
            Total Categories: {categories.length}
          </Paragraph>
        )}
      </div>
    </>
  );
};

export default CategoryManagement;
