import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import AvatarInitials from '../components/AvatarInitials';
import { LEARNER_TYPES, LEARNING_GOALS, LEARNING_PREFERENCES } from '../config/onboarding';
import { LogOut, Edit2, Check, X } from 'lucide-react';

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveName = async () => {
    if (editNameValue.trim() && editNameValue !== user.name) {
      setIsSaving(true);
      await updateProfile({ name: editNameValue.trim() });
      setIsSaving(false);
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setEditNameValue(user.name);
    setIsEditingName(false);
  };

  const learnerTypeLabel = LEARNER_TYPES.find((t) => t.id === user.learnerType)?.label || 'Not set';
  
  const skillLevelLabel = user.skillLevel 
    ? user.skillLevel.charAt(0).toUpperCase() + user.skillLevel.slice(1) 
    : 'Not set';

  const userGoals = (user.goals || [])
    .map((gId) => LEARNING_GOALS.find((g) => g.id === gId)?.label)
    .filter(Boolean) as string[];

  const userPrefs = (user.learningPreferences || [])
    .map((pId) => LEARNING_PREFERENCES.find((p) => p.id === pId)?.label)
    .filter(Boolean) as string[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Header Card */}
      <div className="bg-white dark:bg-[#0d0e24] rounded-card border border-gray-100 dark:border-slate-800 shadow-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 w-full">
          <AvatarInitials name={user.name} size="lg" />
          <div className="flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editNameValue}
                  onChange={(e) => setEditNameValue(e.target.value)}
                  className="text-2xl font-bold text-navy-900 dark:text-white bg-white dark:bg-[#070813] border border-indigo-300 dark:border-indigo-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
                <button 
                  onClick={handleSaveName} 
                  disabled={isSaving}
                  className="p-1.5 rounded-full text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/40 transition-colors disabled:opacity-50"
                >
                  <Check className="h-5 w-5" />
                </button>
                <button 
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-navy-900 dark:text-white">{user.name}</h1>
                <button 
                  onClick={() => setIsEditingName(true)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            )}
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 capitalize mt-2">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Learning Profile Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-navy-900 dark:text-white">Learning Profile</h2>
          <button 
            onClick={() => navigate('/onboarding')}
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-white dark:bg-[#0d0e24] border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-[12px] shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
          >
            Update Learning Preferences
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#0d0e24] rounded-card border border-gray-100 dark:border-slate-800 shadow-card p-6">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Learner Type</h3>
            <p className="text-base font-semibold text-navy-900 dark:text-white">{learnerTypeLabel}</p>
          </div>
          <div className="bg-white dark:bg-[#0d0e24] rounded-card border border-gray-100 dark:border-slate-800 shadow-card p-6">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Skill Level</h3>
            <p className="text-base font-semibold text-navy-900 dark:text-white">{skillLevelLabel}</p>
          </div>
          
          <div className="bg-white dark:bg-[#0d0e24] rounded-card border border-gray-100 dark:border-slate-800 shadow-card p-6 md:col-span-2">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Goals</h3>
            {userGoals.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userGoals.map((goal, idx) => (
                  <span key={idx} className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60">
                    {goal}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No goals selected.</p>
            )}
          </div>

          <div className="bg-white dark:bg-[#0d0e24] rounded-card border border-gray-100 dark:border-slate-800 shadow-card p-6 md:col-span-2">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Learning Preferences</h3>
            {userPrefs.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userPrefs.map((pref, idx) => (
                  <span key={idx} className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60">
                    {pref}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No preferences selected.</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-navy-900 dark:text-white mb-6">Your Progress</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-[#0d0e24] rounded-card border border-gray-100 dark:border-slate-800 shadow-card p-5 text-center">
            <p className="text-2xl font-bold text-navy-900 dark:text-white">{user.xp.toLocaleString()}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">XP</p>
          </div>
          <div className="bg-white dark:bg-[#0d0e24] rounded-card border border-gray-100 dark:border-slate-800 shadow-card p-5 text-center">
            <p className="text-2xl font-bold text-navy-900 dark:text-white">{user.streak} days</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Current Streak</p>
          </div>
          <div className="bg-white dark:bg-[#0d0e24] rounded-card border border-gray-100 dark:border-slate-800 shadow-card p-5 text-center">
            <p className="text-2xl font-bold text-navy-900 dark:text-white">{user.lessonsCompleted}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Lessons</p>
          </div>
          <div className="bg-white dark:bg-[#0d0e24] rounded-card border border-gray-100 dark:border-slate-800 shadow-card p-5 text-center">
            <p className="text-2xl font-bold text-navy-900 dark:text-white">{user.circuitsBuilt}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Circuits</p>
          </div>
          <div className="bg-white dark:bg-[#0d0e24] rounded-card border border-gray-100 dark:border-slate-800 shadow-card p-5 text-center">
            <p className="text-2xl font-bold text-navy-900 dark:text-white">{user.challengesCompleted}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Challenges</p>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="mt-12 flex justify-start">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>

    </div>
  );
}
