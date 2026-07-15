import { Link } from 'react-router-dom';

export default function TripCard({ trip }) {
  const stopsCount = trip.stops?.length || 0;
  const startDate = trip.startDate ? new Date(trip.startDate) : null;
  const endDate = trip.endDate ? new Date(trip.endDate) : null;

  const formatDate = (date) => {
    if (!date) return null;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const dateRange = startDate || endDate
    ? `${formatDate(startDate) || '...'} → ${formatDate(endDate) || '...'}`
    : 'No dates set';

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="group block bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-amber-200 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
            {trip.name || trip.title}
          </h3>
          {trip.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{trip.description}</p>
          )}
        </div>
        {trip.status && (
          <span className="ml-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 whitespace-nowrap">
            {trip.status}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{dateRange}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-medium text-primary-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243A8 8 0 1117.657 16.657z" />
            <circle cx="12" cy="11" r="1.5" fill="currentColor" />
          </svg>
          <span>{stopsCount} stop{stopsCount !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </Link>
  );
}
