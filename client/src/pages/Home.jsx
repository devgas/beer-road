import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BreweryCard from '../components/BreweryCard';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';

export default function Home() {
  const [featuredBreweries, setFeaturedBreweries] = useState([]);
  const [stats, setStats] = useState({ breweries: 0, trips: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useI18n();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/breweries?limit=6');
        if (res.ok) {
          const data = await res.json();
          setFeaturedBreweries(data.data || data);
        }
      } catch (e) {
        console.error('Failed to fetch featured breweries:', e);
      }

      try {
        const statsRes = await fetch('/api/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        } else {
          setStats({ breweries: 0, trips: 0, users: 0 });
        }
      } catch (e) {
        setStats({ breweries: 0, trips: 0, users: 0 });
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('search')?.trim();
    if (query) {
      navigate(`/breweries?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/breweries');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-amber-900/80 to-gray-900/90 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1535958636474-b021ee887b13?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-primary-100 mb-6">
              <span>🍻</span>
              <span>{t('homeBadge')}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Beer Road Save
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              {t('homeSubtitle')}
            </p>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl">
              <input
                type="text"
                name="search"
                placeholder={t('searchBreweriesPlaceholder')}
                className="flex-1 px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 shadow-lg"
              />
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-400 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all hover:shadow-lg whitespace-nowrap"
              >
                {t('searchBreweries')}
              </button>
            </form>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-300">
              <span>{t('tryLabel')}</span>
              {['Portland', 'Denver', 'San Diego', 'Asheville'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => navigate(`/breweries?q=${encodeURIComponent(city)}`)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Breweries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('featuredBreweries')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('featuredSubtitle')}
          </p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-52 bg-gray-200 animate-pulse" />
                <div className="p-5">
                  <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBreweries.map((brewery) => (
              <BreweryCard key={brewery.id} brewery={brewery} />
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link
            to="/breweries"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-primary-500 hover:text-primary-600 transition-colors"
          >
            {t('viewAllBreweries')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-gray-50 to-amber-50/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('joinCommunity')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('communitySubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: stats.breweries || '10,000+', label: t('breweries'), icon: '🍺' },
              { value: stats.trips || '5,000+', label: t('roadTripsPlanned'), icon: '🗺️' },
              { value: stats.users || '20,000+', label: t('beerLovers'), icon: '👋' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <p className="text-4xl font-bold text-primary-500 mb-2">{stat.value}</p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-500 to-amber-500 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('readyJourney')}
          </h2>
          <p className="text-primary-100 mb-10 max-w-2xl mx-auto text-lg">
            {t('readyJourneyText')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/breweries"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all hover:shadow-lg"
            >
              {t('findBreweries')}
            </Link>
            <Link
              to={user ? '/trips' : '/register'}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              {user ? t('myTrips') : t('getStarted')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
