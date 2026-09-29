import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, User, Shield, Sparkles, LogOut, Check, ArrowRight } from 'lucide-react';

export default function Settings() {
  const { user, logout, updateProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    setSuccessMessage('');
    const res = await updateProfile({ name: name.trim() });
    setIsSaving(false);

    if (res.success) {
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-navy-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account preferences, appearance, and learning journey.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <div className="bg-white dark:bg-[#0d0e24] rounded-card border border-gray-100 dark:border-slate-800 shadow-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-navy-900 dark:text-white">Appearance</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Customize how QubitCraft looks on your device</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <button
              onClick={() => { if (isDark) toggleTheme(); }}
              className={`p-4 rounded-xl border-2 flex items-center justify-between text-left transition-all ${
                !isDark
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                  : 'border-gray-200 dark:border-slate-800 hover:border-slate-700 bg-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className={`w-5 h-5 ${!isDark ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div>
                  <p className="text-sm font-semibold text-navy-900 dark:text-white">Light Mode</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Clean, crisp white interface</p>
                </div>
              </div>
              {!isDark && (
                <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </button>

            <button
              onClick={() => { if (!isDark) toggleTheme(); }}
              className={`p-4 rounded-xl border-2 flex items-center justify-between text-left transition-all ${
                isDark
                  ? 'border-indigo-500 bg-indigo-950/40 shadow-sm'
                  : 'border-gray-200 dark:border-slate-800 hover:border-slate-300 bg-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-slate-400'}`} />
                <div>
                  <p className="text-sm font-semibold text-navy-900 dark:text-white">Dark Mode</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Deep quantum dark aesthetics</p>
                </div>
              </div>
              {isDark && (
                <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white dark:bg-[#0d0e24] rounded-card border border-gray-100 dark:border-slate-800 shadow-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-navy-900 dark:text-white">Profile Information</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Update your account name and email</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md mt-4">
            {successMessage && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-[#070813] text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full h-10 px-3.5 rounded-lg border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Email address is managed by your account provider.</p>
            </div>

            <button
              type="submit"
              disabled={isSaving || name.trim() === user.name}
              className="h-10 px-5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Learning Journey Customization */}
        <div className="bg-white dark:bg-[#0d0e24] rounded-card border border-gray-100 dark:border-slate-800 shadow-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-navy-900 dark:text-white">Learning Preferences</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Update your goals, learner type, and recommended curriculum</p>
              </div>
            </div>
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              <span>Retake Onboarding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Security & Logout */}
        <div className="bg-white dark:bg-[#0d0e24] rounded-card border border-gray-100 dark:border-slate-800 shadow-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-navy-900 dark:text-white">Account Session</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as {user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
