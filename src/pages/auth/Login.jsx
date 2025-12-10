import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, signInWithGoogle } from '../../services/authService';
import { FaArrowLeft, FaGoogle } from 'react-icons/fa';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('donor');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await loginUser(formData.email, formData.password);
      localStorage.setItem('userRole', selectedRole);
      navigate(`/${selectedRole}/dashboard`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await signInWithGoogle(selectedRole);
      localStorage.setItem('userRole', selectedRole);
      navigate(`/${selectedRole}/dashboard`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-green-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <button onClick={() => navigate('/')} className="flex items-center text-primary mb-6 hover:opacity-70">
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-gray-600 mb-6">Login to your FoodConnect account</p>

        {error && <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4">{error}</div>}

        {/* Role Selection */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Login as:</p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setSelectedRole('donor')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                selectedRole === 'donor'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🍱 Donor
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('receiver')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                selectedRole === 'receiver'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              👥 Receiver
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-600">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="btn btn-secondary w-full flex items-center justify-center gap-2"
        >
          <FaGoogle /> Sign in with Google
        </button>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account? <a href="/signup" className="text-primary font-semibold hover:underline">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
