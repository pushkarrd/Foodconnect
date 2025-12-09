import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import { auth } from '../services/firebase';
import { FaBars, FaTimes, FaSignOutAlt, FaHome } from 'react-icons/fa';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-2xl">🍱</span>
          <span className="font-bold text-xl">FoodConnect</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {!user ? (
            <>
              <button onClick={() => navigate('/login')} className="hover:bg-green-600 px-4 py-2 rounded">
                Login
              </button>
              <button onClick={() => navigate('/signup')} className="bg-white text-primary px-4 py-2 rounded font-semibold hover:bg-gray-100">
                Sign Up
              </button>
            </>
          ) : (
            <>
              <span className="text-green-100">{user.displayName || user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:bg-green-600 px-4 py-2 rounded"
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 right-0 bg-green-600 text-white w-full md:hidden">
            <div className="flex flex-col p-4 space-y-2">
              {!user ? (
                <>
                  <button onClick={() => { navigate('/login'); setIsOpen(false); }} className="text-left py-2">
                    Login
                  </button>
                  <button onClick={() => { navigate('/signup'); setIsOpen(false); }} className="text-left py-2">
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <span className="py-2">{user.displayName || user.email}</span>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-left py-2 flex items-center gap-2">
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
