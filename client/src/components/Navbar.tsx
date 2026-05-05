import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
            <span>VocalLab AI</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-purple-400 transition">
                  Dashboard
                </Link>
                <Link to="/editor" className="hover:text-purple-400 transition">
                  Editor
                </Link>
                <Link to="/presets" className="hover:text-purple-400 transition">
                  Presets
                </Link>
                <div className="flex items-center space-x-4 border-l border-slate-700 pl-8">
                  <span className="text-sm text-slate-400">{user?.email}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-slate-400 hover:text-red-400 transition"
                  >
                    <FiLogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 hover:bg-slate-800 rounded transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/editor"
                  className="block px-4 py-2 hover:bg-slate-800 rounded transition"
                >
                  Editor
                </Link>
                <Link
                  to="/presets"
                  className="block px-4 py-2 hover:bg-slate-800 rounded transition"
                >
                  Presets
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-slate-800 rounded transition text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/"
                className="block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded transition font-medium"
              >
                Get Started
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
