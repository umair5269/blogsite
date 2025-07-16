import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/Authcontext';

function PostEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const postRef = doc(db, 'posts', id);
      const docSnap = await getDoc(postRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.authorId !== user.uid) {
          alert('Unauthorized');
          navigate('/');
          return;
        }
        setTitle(data.title);
        setContent(data.content);
      } else {
        alert('Post not found');
        navigate('/');
      }
      setLoading(false);
    };

    if (user) fetchPost();
  }, [id, user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const postRef = doc(db, 'posts', id);
      await updateDoc(postRef, {
        title,
        content,
        updatedAt: new Date(),
      });
      alert('Post updated!');
      navigate('/myposts');
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update post.');
    }
  };

  if (loading) return <p>Loading post...</p>;

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded h-40"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Update Post
        </button>
      </form>
    </div>
  );
}

export default PostEditPage;
