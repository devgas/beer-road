import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewStars from '../components/ReviewStars';

export default function BeerDetail() {
  const { id } = useParams();
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBeer = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/beers/${id}`);
        if (!res.ok) throw new Error('Beer not found');
        const data = await res.json();
        setBeer(data.beer || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBeer();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="h-10 bg-gray-200 rounded w-3/4" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !beer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🍺</div>
          <p className="text-gray-500 text-lg mb-4">{error || 'Beer not found'}</p>
          <Link to="/breweries" className="text-primary-600 hover:text-primary-700 font-medium">
            Back to Breweries
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Link to={`/breweries/${beer.brewery_id}`} className="text-primary-600 hover:text-primary-700 font-medium mb-4 inline-flex items-center gap-1 group">
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Brewery
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-64 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-50 flex items-center justify-center">
          <span className="text-8xl">🍺</span>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{beer.name}</h1>
              {beer.style && (
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                  {beer.style}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              {beer.abv && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-500">{beer.abv}%</p>
                  <p className="text-xs text-gray-500">ABV</p>
                </div>
              )}
              {beer.ibu && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-500">{beer.ibu}</p>
                  <p className="text-xs text-gray-500">IBU</p>
                </div>
              )}
            </div>
          </div>

          {beer.description && (
            <p className="text-gray-700 leading-relaxed mb-8 text-lg">{beer.description}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {beer.style && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Style</h3>
                <p className="text-gray-900 font-medium">{beer.style}</p>
              </div>
            )}
            {beer.abv && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">ABV</h3>
                <p className="text-gray-900 font-medium">{beer.abv}%</p>
              </div>
            )}
            {beer.ibu && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">IBU</h3>
                <p className="text-gray-900 font-medium">{beer.ibu}</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Brewery ID</h3>
              <p className="text-gray-900 font-medium">#{beer.brewery_id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
