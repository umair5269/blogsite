// src/pages/AdminUsersPage.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (id, newRole) => {
    try {
      await updateDoc(doc(db, 'users', id), { role: newRole });
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      console.error('Error changing role:', err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading users...</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">👥 User Management</h1>
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="p-2 border">{user.firstName || 'N/A'} {user.lastName || ''}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.role || 'user'}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => changeRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Make {user.role === 'admin' ? 'User' : 'Admin'}
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsersPage;
