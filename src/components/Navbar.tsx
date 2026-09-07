import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, LogOut } from 'lucide-react';
import { NAV_LINKS, NAV_LINKS_BY_ROLE } from '../lib/constants';
import { useAuth } from '../auth/AuthProvider';
import Logo from './Logo';
import Button from './Button';
import AvatarInitials from './AvatarInitials';
import ProfileMenu from './ProfileMenu';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
        scrolled ? 'shadow-nav border-b border-gray-100' : ''
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <Logo size={36} />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-navy-900 leading-tight">QubitCraft</span>
                <span className="text-xs text-slate-400 hidden sm:block">Craft. Compute. Conquer.</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 ml-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => 
                    `text-sm transition-colors ${
                      isActive 
                        ? 'text-indigo-600 font-medium' 
                        : 'text-slate-600 hover:text-indigo-600'
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
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-slate-500 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-50"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 focus:outline-none"
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

          <div className="lg:hidden flex items-center gap-3">
            {isAuthenticated && user && (
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="relative"
                aria-label="Open profile menu"
              >
                <AvatarInitials name={user.name} size="sm" />
                <ProfileMenu
                  user={{ name: user.name, email: user.email }}
                  onLogout={handleLogout}
                  onClose={() => setProfileMenuOpen(false)}
                  isOpen={profileMenuOpen}
                />
              </button>
            )}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-600 hover:text-indigo-600"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 z-50 lg:hidden transition-opacity ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />
      {/* Mobile menu drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 h-16">
          <span className="font-bold text-navy-900 text-lg">Menu</span>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-slate-500 hover:text-indigo-600 rounded-full hover:bg-slate-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Authenticated user info in mobile menu */}
        {isAuthenticated && user && (
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <AvatarInitials name={user.name} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated && (
            <NavLink
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => 
                `block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                }`
              }
            >
              Profile
            </NavLink>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-100">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[12px] text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <Button href="/signup" variant="primary" className="w-full" onClick={() => setMobileMenuOpen(false)}>
              Get Started
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
