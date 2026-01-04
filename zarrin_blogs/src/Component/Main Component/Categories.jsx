// import React, { useState, useEffect } from "react";
// import { Trash2, X, Plus, FolderPlus, CheckCircle, AlertCircle, Loader } from "lucide-react";
// import Button from '../Common/Button';
// import Heading from '../Common/Heading';
// import Paragraph from '../Common/Paragraph';

// const Categories = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [newCategory, setNewCategory] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [deleteLoading, setDeleteLoading] = useState(null);

//   // Fetch all categories on component mount
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('http://localhost:8200/api/categories');
//       if (!res.ok) throw new Error('Failed to fetch categories');
//       const data = await res.json();
//       setCategories(data);
//       setError("");
//     } catch (err) {
//       console.error('Fetch error:', err);
//       setError('Failed to load categories');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addCategory = async () => {
//     if (!newCategory.trim()) {
//       setError("Category name cannot be empty");
//       return;
//     }

//     // Check if category already exists
//     if (categories.some(cat => cat.name.toLowerCase() === newCategory.trim().toLowerCase())) {
//       setError("This category already exists");
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError("You must be logged in to create categories");
//         return;
//       }

//       const res = await fetch('http://localhost:8200/api/categories', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ name: newCategory.trim() })
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || 'Failed to create category');
//       }

//       const newCat = await res.json();
//       setCategories([...categories, newCat]);
//       setNewCategory("");
//       setShowCreateForm(false);
//       setSuccess("Category created successfully!");
//       setError("");
      
//       // Clear success message after 3 seconds
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       console.error('Create error:', err);
//       setError(err.message || 'Error creating category');
//     }
//   };

//   const deleteCategory = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this category?")) return;

//     try {
//       setDeleteLoading(id);
//       const token = localStorage.getItem('token');
//       const res = await fetch(`http://localhost:8200/api/categories/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || 'Failed to delete category');
//       }

//       setCategories(categories.filter(cat => cat._id !== id));
//       setSuccess("Category deleted successfully!");
//       setError("");
      
//       setTimeout(() => setSuccess(""), 3000);
//     } catch (err) {
//       console.error('Delete error:', err);
//       setError(err.message || 'Error deleting category');
//     } finally {
//       setDeleteLoading(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8">
//       {/* Background Effects */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//         <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//         <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
//       </div>

//       <div className="relative z-10 max-w-6xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-12">
//           <div className="flex items-center gap-4 mb-4">
//             <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
//               <FolderPlus size={32} className="text-white" />
//             </div>
//             <div>
//               <Heading type="h1" className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
//                 Categories Management
//               </Heading>
//               <Paragraph className="text-gray-300 mt-2">
//                 Organize and manage your blog categories
//               </Paragraph>
//             </div>
//           </div>
//         </div>

//         {/* Alert Messages */}
//         {success && (
//           <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl backdrop-blur-sm flex items-center gap-3 animate-in fade-in slide-in-from-top">
//             <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
//             <Paragraph className="text-green-300">{success}</Paragraph>
//           </div>
//         )}

//         {error && (
//           <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/50 rounded-xl backdrop-blur-sm flex items-center gap-3 animate-in fade-in slide-in-from-top">
//             <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
//             <Paragraph className="text-red-300">{error}</Paragraph>
//           </div>
//         )}

//         {/* Create Button */}
//         {!showCreateForm && (
//           <button
//             onClick={() => setShowCreateForm(true)}
//             className="mb-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 group"
//           >
//             <Plus size={20} className="group-hover:rotate-90 transition-transform" />
//             Create New Category
//           </button>
//         )}

//         {/* Create Form Modal */}
//         {showCreateForm && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//             <div className="bg-gradient-to-br from-slate-800 to-slate-900 w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-700 animate-in scale-in">
//               <div className="flex justify-between items-center mb-6">
//                 <Heading type="h3" className="text-2xl font-bold text-white">
//                   Create New Category
//                 </Heading>
//                 <button
//                   onClick={() => {
//                     setShowCreateForm(false);
//                     setError("");
//                     setNewCategory("");
//                   }}
//                   className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                   <X size={24} className="text-gray-400 hover:text-white" />
//                 </button>
//               </div>

//               <input
//                 type="text"
//                 placeholder="Enter category name"
//                 value={newCategory}
//                 onChange={(e) => setNewCategory(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && addCategory()}
//                 className="w-full mb-6 px-4 py-3 bg-slate-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 autoFocus
//               />

//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => {
//                     setShowCreateForm(false);
//                     setError("");
//                     setNewCategory("");
//                   }}
//                   className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors duration-200 font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={addCategory}
//                   className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
//                 >
//                   Create Category
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Categories Grid */}
//         {!showCreateForm && (
//           <>
//             {loading ? (
//               <div className="flex flex-col items-center justify-center py-16">
//                 <Loader size={48} className="text-blue-400 animate-spin mb-4" />
//                 <Paragraph className="text-gray-300">Loading categories...</Paragraph>
//               </div>
//             ) : categories.length > 0 ? (
//               <div>
//                 <div className="mb-8">
//                   <Heading type="h2" className="text-2xl font-bold text-white mb-2">
//                     Your Categories
//                   </Heading>
//                   <div className="flex items-center gap-2">
//                     <div className="px-4 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
//                       <Paragraph className="text-blue-300 font-semibold">
//                         {categories.length} {categories.length === 1 ? 'category' : 'categories'}
//                       </Paragraph>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {categories.map((cat) => (
//                     <div
//                       key={cat._id}
//                       className="group relative bg-gradient-to-br from-slate-800 to-slate-800/50 border border-gray-700 hover:border-purple-500/50 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
//                     >
//                       {/* Gradient overlay on hover */}
//                       <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/10 group-hover:to-purple-600/10 transition-all duration-300"></div>

//                       <div className="relative z-10">
//                         {/* Category Icon */}
//                         <div className="mb-4 inline-block p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30 group-hover:border-purple-500/50 transition-all">
//                           <FolderPlus size={24} className="text-blue-400 group-hover:text-purple-400 transition-colors" />
//                         </div>

//                         {/* Category Name */}
//                         <Heading type="h3" className="text-xl font-bold text-white mb-4 line-clamp-2">
//                           {cat.name}
//                         </Heading>

//                         {/* Delete Button */}
//                         <button
//                           onClick={() => deleteCategory(cat._id)}
//                           disabled={deleteLoading === cat._id}
//                           className="w-full px-4 py-2 bg-gradient-to-r from-red-600/20 to-rose-600/20 hover:from-red-600/40 hover:to-rose-600/40 border border-red-600/30 hover:border-red-600/60 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
//                           title="Delete category"
//                         >
//                           {deleteLoading === cat._id ? (
//                             <Loader size={18} className="animate-spin" />
//                           ) : (
//                             <>
//                               <Trash2 size={18} />
//                               Delete
//                             </>
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="text-center py-16">
//                 <div className="mb-6 inline-block p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
//                   <FolderPlus size={48} className="text-blue-400" />
//                 </div>
//                 <Heading type="h3" className="text-2xl font-bold text-white mb-3">
//                   No Categories Yet
//                 </Heading>
//                 <Paragraph className="text-gray-300 mb-8">
//                   Create your first category to organize your blog posts
//                 </Paragraph>
//                 <button
//                   onClick={() => setShowCreateForm(true)}
//                   className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
//                 >
//                   <Plus size={20} />
//                   Create First Category
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes blob {
//           0%, 100% {
//             transform: translate(0, 0) scale(1);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//         }
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Categories;
import React, { useState, useEffect } from "react";
import {
  Trash2,
  X,
  Plus,
  Folder,
  CheckCircle,
  AlertTriangle,
  Loader2
} from "lucide-react";
import Heading from "../Common/Heading";
import Paragraph from "../Common/Paragraph";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8200/api/categories");
      if (!res.ok) throw new Error();
      setCategories(await res.json());
    } catch {
      setError("Unable to load categories");
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return setError("Category name is required");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8200/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCategory.trim() })
      });

      if (!res.ok) throw new Error();

      setCategories([...categories, await res.json()]);
      setNewCategory("");
      setShowCreateForm(false);
      setSuccess("Category created successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to create category");
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      setDeleteLoading(id);
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8200/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(categories.filter((c) => c._id !== id));
    } catch {
      setError("Delete failed");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-purple-50 px-6 py-14">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-center gap-5">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg">
            <Folder size={28} className="text-white" />
          </div>

          <div>
            <Heading type="h1" className="text-4xl font-bold text-slate-900">
              Categories
            </Heading>
            <Paragraph className="text-slate-600">
              Manage and organize your blog content
            </Paragraph>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="flex items-center gap-3 bg-emerald-100 border border-emerald-300 rounded-xl px-4 py-3">
            <CheckCircle size={18} className="text-emerald-600" />
            <span className="text-emerald-700">{success}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 bg-rose-100 border border-rose-300 rounded-xl px-4 py-3">
            <AlertTriangle size={18} className="text-rose-600" />
            <span className="text-rose-700">{error}</span>
          </div>
        )}

        {/* Create Button */}
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md hover:shadow-xl transition"
          >
            <Plus size={18} />
            Create Category
          </button>
        )}

        {/* Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-7 animate-in fade-in zoom-in">
              <div className="flex justify-between items-center mb-6">
                <Heading type="h3" className="text-xl text-slate-900">
                  New Category
                </Heading>
                <button onClick={() => setShowCreateForm(false)}>
                  <X className="text-slate-500 hover:text-slate-800" />
                </button>
              </div>

              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={addCategory}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 size={36} className="animate-spin text-indigo-500" />
          </div>
        ) : categories.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition border border-slate-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100">
                      <Folder size={20} className="text-indigo-600" />
                    </div>
                    <Heading type="h3" className="text-lg text-slate-900">
                      {cat.name}
                    </Heading>
                  </div>

                  <button
                    onClick={() => deleteCategory(cat._id)}
                    disabled={deleteLoading === cat._id}
                    className="text-slate-400 hover:text-rose-600 transition"
                  >
                    {deleteLoading === cat._id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>

                <Paragraph className="text-sm text-slate-500">
                  Used to group related blog posts.
                </Paragraph>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-28">
            <div className="mx-auto mb-6 w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100">
              <Folder size={32} className="text-indigo-600" />
            </div>
            <Heading type="h3" className="text-slate-900">
              No categories yet
            </Heading>
            <Paragraph className="text-slate-600 mt-2">
              Create categories to organize your blog
            </Paragraph>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
