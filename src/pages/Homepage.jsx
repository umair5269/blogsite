// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublishedPosts = async () => {
      try {
        const q = query(
          collection(db, 'posts'),
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const postData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postData);
      } catch (err) {
        console.error('Error fetching published posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedPosts();
  }, []);

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const otherPosts = posts.length > 1 ? posts.slice(1) : [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Discover Stories, Ideas, and Expertise
          </h1>
          <p className="text-lg text-indigo-100 mb-8">
            Dive into a world of fresh content from writers around the globe. Start reading or create your own post today.
          </p>
          <Link
            to="/create"
            className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
          >
            Write a Post
          </Link>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden md:flex">
              <div className="md:w-1/2 p-6">
                <h3 className="text-2xl font-semibold mb-3">{featuredPost.title}</h3>
                <p className="text-gray-700 mb-4">
                  {featuredPost.content?.slice(0, 180)}...
                </p>
                <Link
                  to={`/post/${featuredPost.id}`}
                  className="inline-block text-indigo-600 hover:underline font-medium"
                >
                  Continue reading →
                </Link>
              </div>
              <div className="md:w-1/2 bg-indigo-100 hidden md:block">
                <div className="h-full w-full flex items-center justify-center text-indigo-400 text-4xl font-bold">
                  📘
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Other Posts */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Latest Posts</h2>
          {loading ? (
            <p>Loading posts...</p>
          ) : otherPosts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map(post => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl shadow hover:shadow-md transition p-4"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {post.content?.slice(0, 100)}...
                  </p>
                  <Link
                    to={`/post/${post.id}`}
                    className="text-indigo-600 hover:underline text-sm font-medium"
                  >
                    Read more →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default HomePage;
