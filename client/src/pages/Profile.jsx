import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, logout } = useAuth();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ trips: 0, favorites: 0, reviews: 0 });

  useEffect(() => {
    if (user) setName(user.name || '');
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tripsRes, favRes, reviewsRes] = await Promise.all([
          fetch('/api/trips'),
          fetch('/api/favorites'),
          fetch('/api/reviews'),
        ]);
        const trips = tripsRes.ok ? await tripsRes.json() : [];
        const favs = favRes.ok ? await favRes.json() : [];
        const reviews = reviewsRes.ok ? await reviewsRes.json() : [];
        setStats({
          trips: trips.trips?.length || trips.length || 0,
          favorites: favs.length || 0,
          reviews: Array.isArray(reviews) ? reviews.length : 0,
        });
      } catch (e) {
        console.error('Failed to fetch stats:', e);
      }
    };
    fetchStats();
  }, []);

  const handleSaveName = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <p className="text-gray-500">Please login to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-20 h-20 bg-primary-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <button
              onClick={logout}
              className="mt-4 w-full px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500"
                />
              </div>
              <button
                onClick={handleSaveName}
                disabled={saving || name === user.name}
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-primary-500">{stats.trips}</p>
                <p className="text-sm text-gray-600">Trips</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-primary-500">{stats.favorites}</p>
                <p className="text-sm text-gray-600">Favorites</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-primary-500">{stats.reviews}</p>
                <p className="text-sm text-gray-600">Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
