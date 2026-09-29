import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import { NAV_LINKS, NAV_LINKS_BY_ROLE } from '../lib/constants';
import { useAuth } from '../auth/AuthProvider';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';
import Button from './Button';
import AvatarInitials from './AvatarInitials';
import ProfileMenu from './ProfileMenu';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine nav links based on auth state and role
  const navLinks = isAuthenticated && user
    ? (NAV_LINKS_BY_ROLE[user.role as keyof typeof NAV_LINKS_BY_ROLE] || NAV_LINKS_BY_ROLE.student)
    : NAV_LINKS;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close menus on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setProfileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#070813]/95 backdrop-blur-md transition-colors duration-200 ${
        scrolled 
          ? 'shadow-nav border-b border-gray-100 dark:border-slate-800/90' 
          : 'border-b border-transparent dark:border-slate-900/50'
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <Logo size={36} />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-navy-900 dark:text-white leading-tight">QubitCraft</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">Craft. Compute. Conquer.</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 ml-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => 
                    `text-sm font-medium transition-colors ${
                      isActive 
                        ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80"
              aria-label="Toggle dark mode"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-90 duration-300" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  data-profile-trigger
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 focus:outline-none cursor-pointer"
                  aria-label="Open profile menu"
                >
                  <AvatarInitials name={user.name} size="sm" />
                </button>
                <ProfileMenu
                  user={{ name: user.name, email: user.email }}
                  onLogout={handleLogout}
                  onClose={() => setProfileMenuOpen(false)}
                  isOpen={profileMenuOpen}
                />
              </div>
            ) : (
              <Button href="/signup" variant="primary">
                Get Started
              </Button>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-1.5">
            <button 
              type="button"
              onClick={toggleTheme}
              className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-indigo-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer touch-manipulation"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated && user && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center focus:outline-none cursor-pointer touch-manipulation"
                aria-label="Open user menu"
              >
                <AvatarInitials name={user.name} size="sm" />
              </button>
            )}
            <button 
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 active:scale-95 transition-all cursor-pointer touch-manipulation"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu portal to document.body */}
      {typeof document !== 'undefined' && createPortal(
        <div className={`lg:hidden ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          {/* Backdrop overlay */}
          <div 
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] transition-opacity duration-300 ${
              mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <div 
            data-lenis-prevent
            className={`fixed top-0 right-0 h-[100dvh] max-h-[100dvh] w-[85%] max-w-sm bg-white dark:bg-[#0d0e24] text-slate-900 dark:text-slate-100 z-[1000] shadow-2xl transition-all duration-300 ease-out flex flex-col border-l border-gray-100 dark:border-slate-800 ${
              mobileMenuOpen 
                ? 'translate-x-0 opacity-100 pointer-events-auto visible' 
                : 'translate-x-full opacity-0 pointer-events-none invisible'
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800 h-16 flex-shrink-0">
              <span className="font-bold text-navy-900 dark:text-white text-lg">Menu</span>
              <div className="flex items-center gap-1">
                <button 
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 text-slate-500 dark:text-slate-300 hover:text-indigo-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer touch-manipulation"
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
                </button>
                <button 
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer touch-manipulation"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Authenticated user info in mobile menu */}
            {isAuthenticated && user && (
              <div className="px-4 py-4 border-b border-gray-100 dark:border-slate-800 flex-shrink-0 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="flex items-center gap-3">
                  <AvatarInitials name={user.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive 
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-indigo-600'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {isAuthenticated && (
                <>
                  <NavLink
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        isActive 
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-indigo-600'
                      }`
                    }
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        isActive 
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-indigo-600'
                      }`
                    }
                  >
                    Settings
                  </NavLink>
                  <div className="my-2 border-t border-gray-100 dark:border-slate-800" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 active:bg-red-100 dark:active:bg-red-950/60 transition-colors cursor-pointer text-left touch-manipulation"
                  >
                    <LogOut className="w-5 h-5 shrink-0" />
                    <span>Log Out</span>
                  </button>
                </>
              )}
            </div>
            
            <div className="p-4 pb-8 sm:pb-4 border-t border-gray-100 dark:border-slate-800 flex-shrink-0 bg-white dark:bg-[#0d0e24]">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-base font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] shadow-md shadow-red-500/20 transition-all cursor-pointer touch-manipulation"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Log Out</span>
                </button>
              ) : (
                <Button href="/signup" variant="primary" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

export default Navbar;
