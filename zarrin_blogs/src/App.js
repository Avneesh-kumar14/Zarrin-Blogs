

import './App.css';
import Navbar from './Component/Main Component/Navbar.jsx';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext.jsx';
import Home from './Pages/Home.jsx';
import Footer from './Component/Main Component/Footer.jsx';
import Usercomponent from './Component/Common/Usercontact.jsx'
import Error from './Component/Main Component/Error.jsx';
import Signup from './Component/Common/Signup.jsx';
import BlogPreview from './Component/Main Component/BlogPreview.jsx';
import BlogEditPage from './Component/Main Component/EditBlog.jsx';
import Login from './Component/Common/Loginpage.jsx';
import ForgotPassword from './Component/Common/ForgotPassword.jsx';
import ResetPassword from './Component/Common/ResetPassword.jsx';
import OTPVerify from './Component/Common/OTPVerify.jsx';
import Dashboard from './Component/Main Component/Dashboard.jsx';
import Blog from './Pages/Blog.jsx';
import Contact from './Pages/Contact.jsx';
import About from './Pages/About.jsx';
import AuthenticatedLayout from './Component/AuthenticatedLayout.jsx';
import Posts from './Component/Main Component/Posts.jsx';
import MyBlogs from './Component/Main Component/MyBlogs.jsx';
import Categories from './Component/Main Component/Categories.jsx';
import Search from './Pages/Search.jsx';
import Bookmarks from './Pages/Bookmarks.jsx';
import UserProfile from './Pages/UserProfile.jsx';
import Drafts from './Pages/Drafts.jsx';
import Followers from './Pages/Followers.jsx';
import Following from './Pages/Following.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';
import Notifications from './Pages/Notifications.jsx';
import Settings from './Pages/Settings.jsx';

// ✅ Safe JSON parse helper
const safeJsonParse = (jsonString, fallback = {}) => {
  try {
    if (!jsonString || jsonString === 'undefined') return fallback;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parse error:', error);
    return fallback;
  }
};

function AppWrapper() {
  const location = useLocation();
  const hideFooterAndUser = location.pathname.startsWith("/dashboard");
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id/preview" element={<BlogPreview />} />
        <Route path="/blog/:id/edit" element={<BlogEditPage />} />
        <Route path="/blog/create" element={<Posts />} />
        <Route path="/search" element={<Search />} />
        <Route path="/bookmarks" element={<Bookmarks isAuthenticated={!!localStorage.getItem('token')} />} />
        <Route path="/followers/:userId" element={<Followers />} />
        <Route path="/following/:userId" element={<Following />} />
        <Route path="/profile/:userId" element={<UserProfile currentUser={safeJsonParse(localStorage.getItem('user'))} isAuthenticated={!!localStorage.getItem('token')} />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/verify-otp' element={<OTPVerify />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/admin' element={<AdminDashboard isAuthenticated={!!localStorage.getItem('token')} currentUser={safeJsonParse(localStorage.getItem('user'))} />} />
        <Route path="/*" element={<Error />} />
        <Route path='/dashboard' element={<AuthenticatedLayout />}>
          <Route path='/dashboard/analytics' element={<Dashboard />} />
          <Route path='/dashboard/posts' element={<Posts />} />
          <Route path='/dashboard/myblogs' element={<MyBlogs />} />
          <Route path='/dashboard/categories' element={<Categories />} />
          <Route path='drafts' element={<Drafts />} />
          <Route path='profile' element={<UserProfile currentUser={safeJsonParse(localStorage.getItem('user'))} isAuthenticated={!!localStorage.getItem('token')} />} />
        </Route>
      </Routes>

      {!hideFooterAndUser && <Usercomponent />}
      {!hideFooterAndUser && <Footer />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
