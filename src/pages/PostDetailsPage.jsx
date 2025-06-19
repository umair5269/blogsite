import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, addDoc, getDocs, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function PostDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
  const fetchPost = async () => {
    try {
      const docRef = doc(db, 'posts', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      } else {
        setPost(null);
      }
    } catch (err) {
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
    if (authUser) {
      const userDoc = await getDoc(doc(db, 'users', authUser.uid));
      setUser({
        ...authUser,
        role: userDoc.data()?.role || 'user',
      });
    } else {
      setUser(null);
    }

    // Only call fetchPost after user state is handled
    fetchPost();
    fetchComments(); // Also restore this if it was removed
  });

  return () => unsubscribe();
}, [id]);
const fetchComments = async () => {
  try {
    const commentsRef = collection(db, 'posts', id, 'comments');
    const snapshot = await getDocs(commentsRef);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setComments(data);
  } catch (err) {
    console.error('Error fetching comments:', err);
  }
};



  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;

    try {
      const newComment = {
        text: commentInput,
        authorId: user.uid,
        authorName: user.email,
        createdAt: serverTimestamp(),
      };

      const commentsRef = collection(db, 'posts', id, 'comments');
      const docRef = await addDoc(commentsRef, newComment);

      setComments(prev => [...prev, { id: docRef.id, ...newComment }]);
      setCommentInput('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, 'posts', id, 'comments', commentId));
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading post...</p>;
  if (!post) return <p className="text-center mt-10">Post not found.</p>;

  const formattedDate = post.createdAt?.toDate().toLocaleDateString() || 'Unknown Date';

  return (
    <article className="max-w-3xl mx-auto px-6 py-12 bg-white rounded-xl shadow-lg">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-indigo-600 hover:underline text-sm"
      >
        ← Back to Posts
      </button>

      <h1 className="text-4xl font-bold text-gray-900 mb-3">{post.title}</h1>

      <div className="flex items-center text-sm text-gray-500 mb-6">
        <span>🖋️ {post.authorName || 'Unknown Author'}</span>
        <span className="mx-2">•</span>
        <span>{formattedDate}</span>
      </div>

      <div
        className="prose prose-lg max-w-none text-gray-800 mb-10"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">💬 Comments</h2>

        {comments.length === 0 ? (
          <p className="text-gray-500 mb-4">No comments yet. Be the first to comment!</p>
        ) : (
          <ul className="space-y-4 mb-6">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-start"
              >
                <div>
                  <p className="text-gray-800">{comment.text}</p>
                  <p className="text-sm text-gray-500 mt-1">— {comment.authorName || 'Anonymous'}</p>
                </div>

                {(user?.uid === comment.authorId || user?.uid === post.authorId || user?.role === 'admin') && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-sm text-red-500 hover:underline flex items-center float-right"
                  >
                    🗑️ <span className="ml-1">Delete</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        {user ? (
          <div className="mt-4">
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              rows={3}
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button
              onClick={handleCommentSubmit}
              className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-700 float-right"
            >
              Post Comment
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">You must be logged in to post comments.</p>
        )}
      </section>
    </article>
  );
}

export default PostDetailsPage;
