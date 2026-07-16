import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path ? 'text-white font-medium' : 'text-primary-100 hover:text-white';

  const NavItem = ({ to, children, icon }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-colors min-w-[56px] ${
          active ? 'text-white font-medium' : 'text-primary-100 hover:text-white'
        }`}
      >
        {icon}
        <span className="truncate">{children}</span>
      </Link>
    );
  };

  const navItems = [
    { to: '/breweries', label: 'Breweries', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4" /></svg> },
    { to: '/challenges', label: 'Challenges', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { to: '/trips', label: 'Trips', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
  ];

  if (user) {
    navItems.push({ to: '/favorites', label: 'Favorites', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> });
    navItems.push({ to: '/profile', label: 'Profile', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> });
  }

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-primary-600 shadow-lg' : 'bg-primary-500 shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:text-primary-100 transition-colors">
            <span className="text-2xl">🍻</span>
            <span>Beer Road Save</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link to="/breweries" className={`px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/breweries')}`}>
              Breweries
            </Link>
            <Link to="/challenges" className={`px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/challenges')}`}>
              Challenges
            </Link>
            {user && (
              <>
                <Link to="/trips" className={`px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/trips')}`}>
                  Trips
                </Link>
                <Link to="/favorites" className={`px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/favorites')}`}>
                  Favorites
                </Link>
                <Link to="/profile" className={`px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/profile')}`}>
                  Profile
                </Link>
                <div className="w-px h-6 bg-primary-400 mx-2" />
                <span className="text-primary-200 text-sm px-2">{user.name}</span>
                <button
                  onClick={logout}
                  className="ml-1 px-3 py-2 bg-primary-700 hover:bg-primary-800 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-primary-100 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ml-1 px-4 py-2 bg-white text-primary-600 hover:bg-primary-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary-600 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-primary-400/30 animate-fade-in">
            <Link to="/breweries" className="block py-2.5 px-3 rounded-lg hover:bg-primary-600 transition-colors">
              Breweries
            </Link>
            <Link to="/challenges" className="block py-2.5 px-3 rounded-lg hover:bg-primary-600 transition-colors">
              Challenges
            </Link>
          {user ? (
            <>
              <Link to="/trips" className="block py-2.5 px-3 rounded-lg hover:bg-primary-600 transition-colors">Trips</Link>
              <Link to="/favorites" className="block py-2.5 px-3 rounded-lg hover:bg-primary-600 transition-colors">Favorites</Link>
              <Link to="/profile" className="block py-2.5 px-3 rounded-lg hover:bg-primary-600 transition-colors">Profile</Link>
              <div className="pt-2 mt-2 border-t border-primary-400/30">
                <p className="px-3 text-sm text-primary-200 mb-2">{user.name}</p>
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2.5 bg-primary-700 hover:bg-primary-800 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 mt-2 border-t border-primary-400/30 flex flex-col gap-2">
              <Link to="/login" className="block py-2.5 px-3 rounded-lg hover:bg-primary-600 transition-colors font-medium">Login</Link>
              <Link to="/register" className="block py-2.5 px-3 bg-white text-primary-600 rounded-lg text-center font-medium hover:bg-primary-50 transition-colors">Register</Link>
            </div>
          )}
        </div>
      )}

      {/* Mobile bottom navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
        <div className="flex items-center justify-around px-2 py-1 max-w-lg mx-auto">
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} icon={item.icon}>
              {item.label}
            </NavItem>
          ))}
        </div>
      </div>
    </nav>
  );
}
