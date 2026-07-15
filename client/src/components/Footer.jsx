import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-primary-400 transition-colors">
              <span className="text-2xl">🍻</span>
              <span>Beer Road Save</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400 max-w-md">
              Discover, save, and plan your perfect brewery road trip. Explore thousands of breweries worldwide and create unforgettable craft beer adventures.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Explore</h3>
            <ul className="space-y-2.5">
              <li><Link to="/breweries" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Breweries</Link></li>
              <li><Link to="/trips" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Road Trips</Link></li>
              <li><Link to="/favorites" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Favorites</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Account</h3>
            <ul className="space-y-2.5">
              <li><Link to="/login" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Login</Link></li>
              <li><Link to="/register" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Register</Link></li>
              <li><Link to="/profile" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Profile</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Beer Road Save. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">About</a>
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
