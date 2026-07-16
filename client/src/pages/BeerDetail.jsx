import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReviewStars from '../components/ReviewStars';

const BEER_IMAGES = {
  'ipa': '1559522206-15f3b7b88a7c',
  'stout': '1559522206-15f3b7b88a7c',
  'pilsner': '1559522206-15f3b7b88a7c',
  'lager': '1559522206-15f3b7b88a7c',
  'ale': '1559522206-15f3b7b88a7c',
  'porter': '1559522206-15f3b7b88a7c',
  'wheat': '1559522206-15f3b7b88a7c',
  'sour': '1559522206-15f3b7b88a7c',
  'belgian': '1559522206-15f3b7b88a7c',
  'default': '1535958636474',
};

function getBeerImageId(style) {
  if (!style) return BEER_IMAGES['default'];
  const key = style.toLowerCase();
  if (BEER_IMAGES[key]) return BEER_IMAGES[key];
  for (const k of Object.keys(BEER_IMAGES)) {
    if (k !== 'default' && key.includes(k)) return BEER_IMAGES[k];
  }
  return BEER_IMAGES['default'];
}

export default function BeerDetail() {
  const { id } = useParams();
  const [beer, setBeer] = useState(null);
  const [brewery, setBrewery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

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

  useEffect(() => {
    const fetchBrewery = async () => {
      if (!beer?.brewery_id) return;
      try {
        const res = await fetch(`/api/breweries/${beer.brewery_id}`);
        if (res.ok) {
          const data = await res.json();
          setBrewery(data.brewery || data);
        }
      } catch (err) {
        console.error('Failed to fetch brewery:', err);
      }
    };
    fetchBrewery();
  }, [beer]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-gray-900 font-medium">Loading...</span>
        </nav>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link to="/breweries" className="hover:text-primary-600 transition-colors">Breweries</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-gray-900 font-medium">Beer</span>
        </nav>
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">🍺</div>
          <p className="text-gray-500 text-lg mb-4">{error || 'Beer not found'}</p>
          <button onClick={() => window.location.reload()} className="text-primary-600 hover:text-primary-700 font-medium mr-4">
            Try again
          </button>
          <Link to="/breweries" className="text-primary-600 hover:text-primary-700 font-medium">
            Back to Breweries
          </Link>
        </div>
      </div>
    );
  }

  const beerImageId = getBeerImageId(beer.style);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        <Link to={`/breweries/${beer.brewery_id}`} className="hover:text-primary-600 transition-colors">Brewery</Link>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        <span className="text-gray-900 font-medium truncate">{beer.name}</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-64 bg-gray-100 flex items-center justify-center">
          {!imgError ? (
            <img
              src={`https://images.unsplash.com/photo-${beerImageId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
              alt={beer.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-8xl">🍺</span>
          )}
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
              <h3 className="text-sm font-medium text-gray-500 mb-1">Brewery</h3>
              {brewery ? (
                <Link to={`/breweries/${brewery.id}`} className="text-primary-600 hover:text-primary-700 font-medium">
                  {brewery.name}
                </Link>
              ) : (
                <p className="text-gray-900 font-medium">#{beer.brewery_id}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
