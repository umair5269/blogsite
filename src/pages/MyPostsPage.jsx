import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';

function MyPostsPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            const q = query(collection(db, 'posts'), where('authorId', '==', user.uid));
            const snapshot = await getDocs(q);
            const postData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setPosts(postData);
        };

        if (user) fetchPosts();
    }, [user]);

    const handleDelete = async (postId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
        if (!confirmDelete) return;

        try {
            await deleteDoc(doc(db, 'posts', postId));
            setPosts(prev => prev.filter(post => post.id !== postId));
            console.log(`Post ${postId} deleted`);
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete post.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">My Posts</h1>
            {posts.length === 0 ? (
                <p className="text-gray-600">No posts yet.</p>
            ) : (
                <ul className="space-y-4">
                    {posts.map((post) => (
                        <li
                            key={post.id}
                            className="bg-white p-4 rounded-lg shadow flex justify-between items-start"
                        >
                            <div>
                                <Link
                                    to={`/post/${post.id}`}
                                    className="text-xl font-semibold text-blue-600 hover:underline"
                                >
                                    {post.title}
                                </Link>
                                <p className="text-gray-500 text-sm">
                                    Published: {post.createdAt.toDate().toLocaleString()}
                                </p>
                            </div>

                            <div className="flex space-x-3 mt-1">
                                <Link
                                    to={`/edit/${post.id}`}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition flex items-center"
                                >
                                    ✏️ <span className="ml-1">Edit</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this post?')) {
                                            handleDelete(post.id);
                                        }
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium transition flex items-center"
                                >
                                    🗑️ <span className="ml-1">Delete</span>
                                </button>
                            </div>
                        </li>


                    ))}
                </ul>
            )}
        </div>
    );
}

export default MyPostsPage;
