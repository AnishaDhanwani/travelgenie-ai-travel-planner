import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Sparkles, User as UserIcon, LogOut, Menu, X, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-teal-700 flex items-center justify-center text-white shadow-md shadow-teal-900/10 transition-transform group-hover:scale-105">
              <Compass className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Travel<span className="text-teal-600">Genie</span>
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 rounded-md border border-teal-200/60">
                AI Planner
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'text-teal-700 bg-teal-50/70 font-semibold' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/explore') ? 'text-teal-700 bg-teal-50/70 font-semibold' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              Explore
            </Link>
            <Link
              to="/my-trips"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/my-trips') ? 'text-teal-700 bg-teal-50/70 font-semibold' : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              My Trips
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/my-trips"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-700 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="text-sm font-semibold text-slate-700 hover:text-teal-700 px-3 py-2 transition"
              >
                Sign In
              </Link>
            )}

            <button
              onClick={() => navigate('/plan')}
              className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white transition-all duration-200 bg-slate-900 rounded-xl hover:bg-slate-800 shadow-sm hover:shadow active:scale-95 group"
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-teal-400 group-hover:rotate-12 transition-transform" />
              <span>Start Planning</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => navigate('/plan')}
              className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 rounded-lg"
            >
              Plan
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            Explore
          </Link>
          <Link
            to="/my-trips"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100"
          >
            My Trips
          </Link>
          <div className="pt-2 border-t border-slate-200">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
              >
                Log Out ({user?.name})
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-semibold text-teal-700 hover:bg-teal-50 rounded-md"
              >
                Sign In / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

