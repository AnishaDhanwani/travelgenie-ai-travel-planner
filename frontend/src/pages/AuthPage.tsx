import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, Sparkles, Lock, Mail, User, ArrowRight } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, name);
      } else {
        await signup(email, password, name);
      }
      navigate('/my-trips');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await login('traveler@travelgenie.ai', 'Alex Traveler');
      navigate('/my-trips');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-10 max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-900 to-teal-700 flex items-center justify-center text-white mx-auto shadow-md shadow-teal-900/10">
            <Compass className="w-6 h-6 text-teal-300" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-500">
            {isLogin
              ? 'Sign in to access your saved travel itineraries'
              : 'Join TravelGenie to start saving personalized AI itineraries'}
          </p>
        </div>

        {/* Demo Login Button */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-teal-50 hover:bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>Quick Demo Login (1-Click)</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-slate-400 font-bold shrink-0">
            Or with email
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Traveler"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center justify-center space-x-1.5"
          >
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Toggle Login / Signup */}
        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="font-bold text-teal-700 hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="font-bold text-teal-700 hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

