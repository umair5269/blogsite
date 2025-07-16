import React, { useState } from 'react';
import { useAuth } from '../context/Authcontext';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import RichTextEditor from '../components/RichTextEditor';

function CreatePostPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // HTML or plain text

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    try {
      await addDoc(collection(db, 'posts'), {
        title,
        content,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        createdAt: Timestamp.now(),
        status: 'published',
      });

      navigate('/myposts');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Post Title"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div>
          <RichTextEditor onChange={setContent} />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Publish
        </button>
      </form>
    </div>
  );
}

export default CreatePostPage;
