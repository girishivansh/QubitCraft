import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LayoutDashboard, Settings, LogOut } from 'lucide-react';

interface ProfileMenuProps {
  user: { name: string; email: string };
  onLogout: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function ProfileMenu({ user, onLogout, onClose, isOpen }: ProfileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // If clicking inside the avatar trigger button or the profile menu itself, do not close
      if (target.closest('[data-profile-trigger]') || target.closest('[data-profile-menu]')) {
        return;
      }
      if (menuRef.current && menuRef.current.contains(target)) {
        return;
      }
      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      data-profile-menu
      onMouseDown={(e) => e.stopPropagation()}
      className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#0d0e24] rounded-card border border-gray-100 dark:border-slate-800 shadow-card-hover py-2 z-50 animate-fade-in"
    >
      <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800">
        <p className="text-sm font-semibold text-navy-900 dark:text-white">{user.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
      </div>
      <div className="py-1">
        <button
          type="button"
          onClick={() => handleNavigate('/profile')}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
        >
          <User size={16} />
          <span>Profile</span>
        </button>
        <button
          type="button"
          onClick={() => handleNavigate('/dashboard')}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </button>
        <button
          type="button"
          onClick={() => handleNavigate('/settings')}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>
      <div className="border-t border-gray-100 dark:border-slate-800 my-1" />
      <div className="py-1">
        <button
          type="button"
          onClick={handleLogoutClick}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left cursor-pointer"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
