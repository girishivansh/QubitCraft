import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, LayoutDashboard, Settings, LogOut } from 'lucide-react';

interface ProfileMenuProps {
  user: { name: string; email: string };
  onLogout: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function ProfileMenu({ user, onLogout, onClose, isOpen }: ProfileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
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

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-card border border-gray-100 shadow-card-hover py-2 z-50 animate-fade-in"
    >
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-navy-900">{user.name}</p>
        <p className="text-xs text-slate-500 truncate">{user.email}</p>
      </div>
      <div className="py-1">
        <Link
          to="/profile"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          onClick={onClose}
        >
          <User size={16} />
          <span>Profile</span>
        </Link>
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          onClick={onClose}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          onClick={onClose}
        >
          <Settings size={16} />
          <span>Settings</span>
        </Link>
      </div>
      <div className="border-t border-gray-100 my-1" />
      <div className="py-1">
        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
