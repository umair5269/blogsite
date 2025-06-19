import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import Homepage from './pages/Homepage';
import PrivateRoute from './components/Privateroute';
import DashboardPage from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';
import CreatePostPage from './pages/CreatePostPage';
import MyPostsPage from './pages/MyPostsPage';
import PostDetailPage from './pages/PostDetailsPage';
import PostEditPage from './pages/PostEditPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminPostsPage from './pages/AdminPostsPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPanel /> </AdminRoute>} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/myposts" element={<MyPostsPage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="/edit/:id" element={<PostEditPage />} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          <Route path="/admin/posts" element={<AdminRoute><AdminPostsPage /></AdminRoute>} />
        
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
