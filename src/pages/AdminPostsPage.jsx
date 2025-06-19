// src/pages/AdminPostsPage.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'posts'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const deletePost = async (postId) => {
    const confirm = window.confirm('Are you sure you want to delete this post?');
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'posts', postId));
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading posts...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🗂️ Moderate Posts</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts found.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map(post => (
            <li key={post.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800">{post.title}</h2>
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
              <p className="text-sm text-gray-600">By: {post.authorName || 'Unknown'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminPostsPage;
