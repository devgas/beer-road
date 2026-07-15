import { Link } from 'react-router-dom';

export default function BreweryCard({ brewery }) {
  const ratingValue = typeof brewery.rating === 'number' ? brewery.rating : parseFloat(brewery.rating) || 0;

  return (
    <Link
      to={`/breweries/${brewery.id}`}
      className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-amber-200 transition-all duration-300"
    >
      <div className="relative h-52 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-7xl group-hover:scale-110 transition-transform duration-300">🍺</span>
        {brewery.type && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-amber-800 rounded-full text-xs font-semibold shadow-sm">
            {brewery.type}
          </span>
        )}
        {brewery.country && brewery.country !== 'USA' && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-primary-500 text-white rounded-full text-xs font-semibold shadow-sm">
            {brewery.country}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
          {brewery.name}
        </h3>
        <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243A8 8 0 1117.657 16.657z" />
            <circle cx="12" cy="11" r="1.5" fill="currentColor" />
          </svg>
          {brewery.city}{brewery.state ? `, ${brewery.state}` : ''}
        </p>
        <div className="flex items-center justify-between">
          {ratingValue > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex text-amber-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.round(ratingValue) ? '★' : '☆'}</span>
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">{ratingValue.toFixed(1)}</span>
            </div>
          )}
          <span className="text-xs text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
