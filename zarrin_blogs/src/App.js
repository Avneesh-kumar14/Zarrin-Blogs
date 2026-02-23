

import './App.css';
import Navbar from './Component/Main Component/Navbar.jsx';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { ChatProvider } from './context/ChatContext.jsx';
import { CallProvider } from './context/CallContext.jsx';
import Home from './Pages/Home.jsx';
import Footer from './Component/Main Component/Footer.jsx';
import Error from './Component/Main Component/Error.jsx';
import Signup from './Component/Common/Signup.jsx';
import BlogPreview from './Component/Main Component/BlogPreview.jsx';
import BlogEditPage from './Component/Main Component/EditBlog.jsx';
import Login from './Component/Common/Loginpage.jsx';
import ForgotPassword from './Component/Common/ForgotPassword.jsx';
import ResetPassword from './Component/Common/ResetPassword.jsx';
import OTPVerify from './Component/Common/OTPVerify.jsx';
import DashboardAnalytics from './Pages/DashboardAnalytics.jsx';
import DashboardCategories from './Pages/DashboardCategories.jsx';
import Blog from './Pages/Blog.jsx';
import Contact from './Pages/Contact.jsx';
import About from './Pages/About.jsx';
import AuthenticatedLayout from './Component/AuthenticatedLayout.jsx';
import Posts from './Component/Main Component/Posts.jsx';
import MyBlogs from './Component/Main Component/MyBlogs.jsx';
import Search from './Pages/Search.jsx';
import Bookmarks from './Pages/Bookmarks.jsx';
import UserProfile from './Pages/UserProfile.jsx';
import Drafts from './Pages/Drafts.jsx';
import Followers from './Pages/Followers.jsx';
import Following from './Pages/Following.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';
import Notifications from './Pages/Notifications.jsx';
import Settings from './Pages/Settings.jsx';
import Chat from './Component/Chat/Chat.jsx';

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
  const hideFooterAndUser = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/chat");
  const token = localStorage.getItem('token');
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
        <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
        <Route path="/profile/:userId" element={<UserProfile currentUser={safeJsonParse(localStorage.getItem('user'))} isAuthenticated={!!localStorage.getItem('token')} />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/chat" element={<Chat userToken={token} />} />
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
          <Route path='/dashboard/analytics' element={<DashboardAnalytics />} />
          <Route path='/dashboard/posts' element={<Posts />} />
          <Route path='/dashboard/myblogs' element={<MyBlogs />} />
          <Route path='/dashboard/categories' element={<DashboardCategories />} />
          <Route path='drafts' element={<Drafts />} />
          <Route path='profile' element={<UserProfile currentUser={safeJsonParse(localStorage.getItem('user'))} isAuthenticated={!!localStorage.getItem('token')} ownProfile={true} />} />
        </Route>
      </Routes>

      {!hideFooterAndUser && <Footer />}
    </>
  );
}

function App() {
  const token = localStorage.getItem('token');
  
  return (
    <ThemeProvider>
      <UserProvider>
        <ChatProvider token={token}>
          <CallProvider>
            <BrowserRouter>
              <AppWrapper />
            </BrowserRouter>
          </CallProvider>
        </ChatProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
