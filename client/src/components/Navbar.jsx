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
      </div>
    </nav>
  );
}
