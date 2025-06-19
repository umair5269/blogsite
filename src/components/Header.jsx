import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Header() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-blue-600">
            DevJournal
          </Link>

          {/* Hamburger Icon (Mobile) */}
          <button
            className="md:hidden text-gray-700 text-2xl focus:outline-none"
            onClick={toggleMenu}
          >
            ☰
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 text-gray-700 font-medium">
            <Link to="/">Home</Link>

            {user && <Link to="/dashboard">Dashboard</Link>}
            {role === 'admin' && <Link to="/admin">Admin</Link>}

            {user && (
              <>
                <Link to="/create" className="hover:text-blue-500">Create Post</Link>
                <Link to="/myposts" className="hover:text-blue-500">My Posts</Link>
              </>
            )}

            {!user ? (
              <>
                <Link to="/login">Login</Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {menuOpen && (
        <div className="md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 p-6">
          <button
            onClick={toggleMenu}
            className="text-2xl absolute top-4 right-4 text-gray-600"
          >
            ✕
          </button>

          <nav className="flex flex-col gap-4 mt-12 text-gray-700 font-medium">
            <Link to="/" onClick={toggleMenu}>Home</Link>

            {user && <Link to="/dashboard" onClick={toggleMenu}>Dashboard</Link>}
            {role === 'admin' && <Link to="/admin" onClick={toggleMenu}>Admin</Link>}

            {user && (
              <>
                <Link to="/create" onClick={toggleMenu}>Create Post</Link>
                <Link to="/myposts" onClick={toggleMenu}>My Posts</Link>
              </>
            )}

            {!user ? (
              <>
                <Link to="/login" onClick={toggleMenu}>Login</Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-center"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  toggleMenu();
                  handleLogout();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-left"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </>
  );
}

export default Header;
