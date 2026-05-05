import React, { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  isLogin?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin = true }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await authAPI.login(email, password);
        if (response.data) {
          login(response.data.token, response.data.user);
          navigate('/dashboard');
        }
      } else {
        const response = await authAPI.register(email, password, name);
        if (response.data) {
          login(response.data.token, response.data.user);
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-slate-800 rounded-lg border border-slate-700">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isLogin ? 'Login to VocalLab' : 'Create Account'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-purple-500 transition"
              placeholder="John Doe"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-3 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-purple-500 transition"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-purple-500 transition"
              placeholder="••••••••"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-white transition"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {!isLogin && (
            <p className="text-xs text-slate-400 mt-1">Min 8 characters</p>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition"
        >
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-4">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <a
          href={isLogin ? '/register' : '/login'}
          className="text-purple-400 hover:text-purple-300 transition"
        >
          {isLogin ? 'Sign up' : 'Login'}
        </a>
      </p>
    </div>
  );
};

export default AuthForm;
