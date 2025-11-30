# 🎨 Zarrin Blogs - Frontend React Application

A modern, responsive React frontend for the Zarrin Blogs MERN platform. Built with React 18, Tailwind CSS, and React Router v7, featuring a complete blog management system with rich text editing and cloud image storage.

---

## 📋 Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Components](#components)
- [Pages](#pages)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)

---

## ✨ Features

- ✅ **User Authentication** - Login and signup with JWT
- ✅ **Blog Management** - Create, read, update, delete blogs
- ✅ **Rich Text Editor** - ReactQuill for formatted content
- ✅ **Image Upload** - Upload to Cloudinary with preview
- ✅ **Blog Preview** - Preview before publishing
- ✅ **Responsive Design** - Mobile-friendly Tailwind CSS
- ✅ **Category Management** - Create and manage categories
- ✅ **Dashboard** - User analytics and stats
- ✅ **Search & Filter** - Find blogs by category
- ✅ **Protected Routes** - Authenticated user pages

---

## 🛠️ Installation

### Prerequisites
- Node.js v16+
- npm or yarn
- Backend running on `http://localhost:8200`

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```
   App opens on `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
zarrin_blogs/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── Assets/              # Static images and media
│
├── src/
│   ├── Component/
│   │   ├── Main Component/  # Large page components
│   │   │   ├── AboutUS.jsx
│   │   │   ├── Banner.jsx
│   │   │   ├── BlogManagement.jsx    # Blog CRUD list
│   │   │   ├── BlogPreview.jsx       # View full blog
│   │   │   ├── Categories.jsx        # Category management
│   │   │   ├── ContactPage.jsx
│   │   │   ├── Dashboard.jsx         # Admin dashboard
│   │   │   ├── EditBlog.jsx          # Edit blog form
│   │   │   ├── Footer.jsx
│   │   │   ├── Layout1.jsx
│   │   │   ├── Main.jsx
│   │   │   ├── MyBlogs.jsx           # User's blogs
│   │   │   ├── Navbar.jsx
│   │   │   ├── OurBlogs.jsx          # Public blogs
│   │   │   ├── Posts.jsx             # Create blog
│   │   │   ├── RecentPost.jsx
│   │   │   ├── SideBar.jsx
│   │   │   └── SingleBlog.jsx        # Blog template
│   │   │
│   │   ├── Common/          # Reusable components
│   │   │   ├── Button.jsx
│   │   │   ├── Cards.jsx
│   │   │   ├── Heading.jsx
│   │   │   ├── Image.jsx
│   │   │   ├── Loginpage.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── Paragraph.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── StepsSection.jsx
│   │   │   └── Usercontact.jsx
│   │   │
│   │   └── AuthenticatedLayout.jsx   # Protected routes wrapper
│   │
│   ├── Pages/               # Main page components
│   │   ├── About.jsx
│   │   ├── Blog.jsx         # Blog listing page
│   │   ├── Contact.jsx
│   │   └── Home.jsx         # Homepage
│   │
│   ├── App.js              # Main app component
│   ├── App.css
│   ├── index.js            # Entry point
│   ├── index.css
│   └── reportWebVitals.js
│
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 🎯 Available Scripts

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in browser.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner in interactive watch mode.

---

## 🌐 API Integration

### Base URL
```javascript
const API_BASE = 'http://localhost:8200/api'
```

### Authentication Header
```javascript
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`
}
```

---

## 🔐 Protected Routes

The `AuthenticatedLayout` component handles protected routes:

```jsx
<Route path='/dashboard' element={<AuthenticatedLayout />}>
  <Route path='/dashboard/analytics' element={<Dashboard />} />
  <Route path='/dashboard/posts' element={<Posts />} />
  <Route path='/dashboard/myblogs' element={<MyBlogs />} />
  <Route path='/dashboard/categories' element={<Categories />} />
</Route>
```

---

## 📱 Responsive Breakpoints

```javascript
// Tailwind breakpoints
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## 📚 Main Dependencies

- `react@^18.2.0` - UI framework
- `react-router-dom@^7.7.1` - Client routing
- `react-quill-new@^3.6.0` - Rich text editor
- `tailwindcss@^3.4.17` - CSS framework
- `lucide-react@^0.534.0` - Icons

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect GitHub repository to Vercel
2. Deploy automatically on push

### Deploy to Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`

---

## 📞 Troubleshooting

### Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### CORS Issues
- Ensure backend has CORS enabled

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

---

**Last Updated**: November 23, 2025

[Back to Main README](../README.md)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
