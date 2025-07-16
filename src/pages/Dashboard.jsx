import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/Authcontext';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const [drafts, setDrafts] = useState(0);
  const [published, setPublished] = useState(0);

  useEffect(() => {
    const fetchUserInfoAndStats = async () => {
      if (!user) return;

      try {
        // Fetch user profile info
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserInfo(docSnap.data());
        }

        // Fetch user's posts
        const postsQuery = query(collection(db, 'posts'), where('authorId', '==', user.uid));
        const snapshot = await getDocs(postsQuery);

        let draftCount = 0;
        let publishedCount = 0;

        snapshot.forEach((doc) => {
          const post = doc.data();
          if (post.status === 'draft') draftCount++;
          if (post.status === 'published') publishedCount++;
        });

        setTotalPosts(snapshot.size);
        setDrafts(draftCount);
        setPublished(publishedCount);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }

      setLoading(false);
    };

    fetchUserInfoAndStats();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 text-center">
        <p className="text-gray-600 text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {/* Welcome Banner */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          Welcome back, {userInfo?.firstName} {userInfo?.lastName} 👋
        </h1>
        <p className="text-gray-600">Email: {user?.email}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-100 text-blue-800 rounded-xl p-5 shadow-sm">
          <p className="text-sm">Total Posts</p>
          <p className="text-3xl font-bold">{totalPosts}</p>
        </div>
        <div className="bg-green-100 text-green-800 rounded-xl p-5 shadow-sm">
          <p className="text-sm">Drafts</p>
          <p className="text-3xl font-bold">{drafts}</p>
        </div>
        <div className="bg-purple-100 text-purple-800 rounded-xl p-5 shadow-sm">
          <p className="text-sm">Published</p>
          <p className="text-3xl font-bold">{published}</p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white shadow-md rounded-xl p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Ready to share something?</h2>
        <p className="text-gray-600 mb-4">Start writing a new blog post now.</p>
        <Link
          to="/create"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create New Post
        </Link>
      </div>
    </div>
  );
}

export default DashboardPage;
