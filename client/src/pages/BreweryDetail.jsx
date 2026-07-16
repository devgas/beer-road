import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Map from '../components/Map';
import ReviewStars from '../components/ReviewStars';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../utils/api';

const BREWERY_IMAGES = [
  '1535958636474', '1535958636475', '1535958636476', '1535958636477', '1535958636478',
  '1535958636479', '1535958636480', '1535958636481', '1535958636482', '1535958636483',
  '1535958636484', '1535958636485', '1535958636486', '1535958636487', '1535958636488',
  '1535958636489', '1535958636490', '1535958636491', '1535958636492', '1535958636493',
];

function getBreweryImageId(breweryId) {
  let hash = 0;
  const str = String(breweryId);
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BREWERY_IMAGES[Math.abs(hash) % BREWERY_IMAGES.length];
}

export default function BreweryDetail() {
  const { id } = useParams();
  const [brewery, setBrewery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [userTrips, setUserTrips] = useState([]);
  const [showTripDropdown, setShowTripDropdown] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { user } = useAuth();
  const imageId = brewery ? getBreweryImageId(brewery.id) : '1535958636474';

  useEffect(() => {
    const fetchBrewery = async () => {
      setLoading(true);
      setError(null);
      setImgError(false);
      try {
        const res = await fetch(`/api/breweries/${id}`);
        if (!res.ok) throw new Error('Brewery not found');
        const data = await res.json();
        setBrewery(data.brewery || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBrewery();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const res = await fetch(`/api/reviews/brewery/${id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.data || []);
        }
      } catch (e) {
        console.error('Failed to fetch reviews:', e);
      } finally {
        setReviewsLoading(false);
      }
    };
    if (id) fetchReviews();
  }, [id]);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const res = await api.get(`/api/favorites/${id}`);
        setIsFavorite(res.ok);
      } catch (e) {
        setIsFavorite(false);
      }
    };
    const fetchUserTrips = async () => {
      try {
        const { data } = await api.get('/api/trips');
        setUserTrips(data.data || []);
      } catch (e) {
        console.error('Failed to fetch trips:', e);
      }
    };
    if (user) {
      checkFavorite();
      fetchUserTrips();
    }
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please login to add favorites');
      return;
    }
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/api/favorites/${id}`);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await api.post(`/api/favorites/${id}`);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to update favorites');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleAddToTrip = async (tripId) => {
    try {
      await api.post(`/api/trips/${tripId}/stops`, {
        breweryId: id,
        name: brewery.name,
        city: brewery.city,
        state: brewery.state,
        latitude: brewery.latitude,
        longitude: brewery.longitude,
      });
      toast.success('Brewery added to trip!');
      setShowTripDropdown(false);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to add to trip');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (submittingReview) return;
    setSubmittingReview(true);
    try {
      await api.post('/api/reviews', {
        breweryId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      const { data } = await api.get(`/api/reviews/brewery/${id}`);
      setReviews(data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link to="/breweries" className="hover:text-primary-600 transition-colors">Breweries</Link>
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

  if (error || !brewery) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link to="/breweries" className="hover:text-primary-600 transition-colors">Breweries</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-gray-900 font-medium">Brewery</span>
        </nav>
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-gray-500 text-lg mb-4">{error || 'Brewery not found'}</p>
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

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : (brewery.rating || 'N/A');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        <Link to="/breweries" className="hover:text-primary-600 transition-colors">Breweries</Link>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        <span className="text-gray-900 font-medium truncate">{brewery.name}</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="relative h-72 md:h-80 bg-gray-100 flex items-center justify-center">
          {!imgError ? (
            <img
              src={`https://images.unsplash.com/photo-${imageId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
              alt={brewery.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-8xl">🍺</span>
          )}
          {brewery.type && (
            <span className="absolute top-6 left-6 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-amber-800 rounded-full text-sm font-semibold shadow-sm">
              {brewery.type}
            </span>
          )}
          {brewery.country && brewery.country !== 'USA' && (
            <span className="absolute top-6 right-6 px-3 py-1.5 bg-primary-500 text-white rounded-full text-sm font-semibold shadow-sm">
              {brewery.country}
            </span>
          )}
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{brewery.name}</h1>
              <p className="text-gray-600 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243A8 8 0 1117.657 16.657z" />
                  <circle cx="12" cy="11" r="1.5" fill="currentColor" />
                </svg>
                {brewery.city}{brewery.state ? `, ${brewery.state}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl">
              <ReviewStars rating={typeof avgRating === 'number' ? avgRating : 0} />
              <span className="text-sm text-gray-600 font-medium">({reviews.length} reviews)</span>
            </div>
          </div>

          {brewery.description && (
            <p className="text-gray-700 leading-relaxed mb-8 text-lg">{brewery.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {brewery.website && (
              <a href={brewery.website} target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors group">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Website</h3>
                <p className="text-primary-600 font-medium truncate group-hover:underline">{brewery.website}</p>
              </a>
            )}
            {brewery.phone && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                <p className="text-gray-900 font-medium">{brewery.phone}</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
              <p className="text-gray-900">{brewery.address || `${brewery.city}, ${brewery.state}`}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {user && (
              <button
                onClick={toggleFavorite}
                disabled={favoriteLoading}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                  isFavorite
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
              </button>
            )}
            {user && userTrips.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowTripDropdown(!showTripDropdown)}
                  className="px-5 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                >
                  + Add to Trip
                </button>
                {showTripDropdown && (
                  <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[220px] overflow-hidden">
                    {userTrips.map((trip) => (
                      <button
                        key={trip.id}
                        onClick={() => handleAddToTrip(trip.id)}
                        className="block w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                      >
                        {trip.name || trip.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {brewery.latitude && brewery.longitude && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              <Map
                breweries={[brewery]}
                center={[brewery.latitude, brewery.longitude]}
                zoom={15}
                selectedBrewery={brewery}
                height="400px"
              />
            </div>
          )}

          <BeersSection breweryId={brewery.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
          {reviewsLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {(review.userName || review.user?.name || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{review.userName || review.user?.name || 'User'}</p>
                      <ReviewStars rating={review.rating} />
                    </div>
                  </div>
                  {review.comment && <p className="text-gray-700 text-sm mt-2 leading-relaxed">{review.comment}</p>}
                  <p className="text-xs text-gray-400 mt-3">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {user && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Comment</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="Share your experience..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium px-4 py-2.5 rounded-lg transition-colors"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BeersSection({ breweryId }) {
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const res = await fetch(`/api/beers/brewery/${breweryId}`);
        if (res.ok) {
          const data = await res.json();
          setBeers(data.data || []);
        }
      } catch (e) {
        console.error('Failed to fetch beers:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchBeers();
  }, [breweryId]);

  if (loading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Beers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 animate-pulse">
              <div className="h-5 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (beers.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Beers</h2>
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
          <div className="text-4xl mb-2">🍻</div>
          <p className="text-gray-500">No beers listed for this brewery yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Beers ({beers.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {beers.map((beer) => (
          <Link
            key={beer.id}
            to={`/beers/${beer.id}`}
            className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{beer.name}</h3>
              <span className="text-2xl">🍺</span>
            </div>
            {beer.style && (
              <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-medium mb-2">
                {beer.style}
              </span>
            )}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              {beer.abv && <span>ABV: {beer.abv}%</span>}
              {beer.ibu && <span>IBU: {beer.ibu}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
