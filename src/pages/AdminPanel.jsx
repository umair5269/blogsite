// src/pages/AdminPanel.js
import React from 'react';
import { Link } from 'react-router-dom';

function AdminPanel() {
  const adminLinks = [
    {
      name: 'User Management',
      description: 'Manage all registered users, change roles, or delete accounts.',
      to: '/admin/users',
      emoji: '👤',
    },
    {
      name: 'Post Moderation',
      description: 'View and moderate all posts across the site.',
      to: '/admin/posts',
      emoji: '📝',
    },
    {
      name: 'Comment Moderation',
      description: 'Monitor and remove inappropriate comments.',
      to: '/admin/comments',
      emoji: '💬',
    },
    {
      name: 'Analytics Dashboard',
      description: 'See insights on users, posts, and engagement.',
      to: '/admin/analytics',
      emoji: '📊',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">🛠️ Admin Panel</h1>
        <p className="text-center text-gray-600 mb-10">Only accessible by admin users</p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {adminLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 border hover:border-indigo-500"
            >
              <div className="flex items-center mb-2 text-indigo-600 text-3xl">{link.emoji}</div>
              <h2 className="text-xl font-semibold text-gray-800">{link.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
