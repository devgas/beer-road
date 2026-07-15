import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BreweryCard from '../components/BreweryCard';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/favorites');
        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
        }
      } catch (e) {
        console.error('Failed to fetch favorites:', e);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchFavorites();
  }, [user]);

  const removeFavorite = async (breweryId) => {
    try {
      const res = await fetch(`/api/favorites/${breweryId}`, { method: 'DELETE' });
      if (res.ok) {
        setFavorites(prev => prev.filter(f => f.id !== breweryId));
        toast.success('Removed from favorites');
      }
    } catch (err) {
      toast.error('Failed to remove favorite');
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Login to view favorites</h3>
          <p className="text-gray-500 mb-6">Save your favorite breweries and access them anytime.</p>
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Login to your account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        <p className="mt-1 text-gray-600">
          {favorites.length > 0 ? `${favorites.length} saved brewery${favorites.length !== 1 ? 'ies' : ''}` : 'Breweries you love'}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start exploring breweries and save your favorites to build your personal beer bucket list.
          </p>
          <Link
            to="/breweries"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-all hover:shadow-lg"
          >
            Explore Breweries
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((brewery) => (
            <div key={brewery.id} className="relative">
              <BreweryCard brewery={brewery} />
              <button
                onClick={() => removeFavorite(brewery.id)}
                className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
                title="Remove from favorites"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
