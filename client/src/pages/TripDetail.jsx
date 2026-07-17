import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Map from '../components/Map';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../utils/api';

function getTripStartDate(trip) {
  return trip.start_date || trip.startDate || '';
}

function getTripEndDate(trip) {
  return trip.end_date || trip.endDate || '';
}

function getStopName(stop) {
  return stop.brewery_name || stop.name || 'Brewery stop';
}

export default function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '', startDate: '', endDate: '' });
  const [saving, setSaving] = useState(false);
  const [showAddStop, setShowAddStop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchTrip = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/trips/${id}`);
      setTrip(data);
      setEditForm({
        name: data.title || data.name || '',
        description: data.description || '',
        startDate: getTripStartDate(data),
        endDate: getTripEndDate(data),
      });
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const searchBreweries = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/breweries?q=${encodeURIComponent(searchQuery.trim())}&limit=8`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.data || data);
      }
    } catch (e) {
      console.error('Search failed:', e);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchBreweries();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSaveTrip = async () => {
    if (!editForm.name.trim()) {
      toast.error('Trip title is required');
      return;
    }
    if (editForm.endDate && editForm.startDate && new Date(editForm.endDate) < new Date(editForm.startDate)) {
      toast.error('End date must be on or after start date');
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.put(`/trips/${id}`, {
        title: editForm.name.trim(),
        description: editForm.description,
        start_date: editForm.startDate || null,
        end_date: editForm.endDate || null,
      });
      setTrip(data.trip || data);
      setIsEditing(false);
      toast.success('Trip updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update trip');
    } finally {
      setSaving(false);
    }
  };

  const handleAddStop = async (brewery) => {
    try {
      await api.post(`/trips/${id}/stops`, { brewery_id: brewery.id });
      await fetchTrip();
      setShowAddStop(false);
      setSearchQuery('');
      setSearchResults([]);
      toast.success('Stop added!');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to add stop');
    }
  };

  const handleRemoveStop = async (stopId) => {
    try {
      await api.delete(`/trips/${id}/stops/${stopId}`);
      setTrip((prev) => ({
        ...prev,
        stops: prev.stops.filter((s) => s.id !== stopId),
      }));
      toast.success('Stop removed');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to remove stop');
    }
  };

  const handleMoveStop = async (stopId, direction) => {
    const stops = [...(trip.stops || [])];
    const idx = stops.findIndex((s) => s.id === stopId);
    if (idx < 0) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= stops.length) return;
    [stops[idx], stops[newIdx]] = [stops[newIdx], stops[idx]];
    try {
      await api.put(`/trips/${id}/stops/reorder`, { stops: stops.map((s) => s.id) });
      setTrip((prev) => ({ ...prev, stops }));
      toast.success('Stop reordered');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to reorder stops');
    }
  };

  const handleDeleteTrip = async () => {
    try {
      await api.delete(`/trips/${id}`);
      toast.success('Trip deleted');
      navigate('/trips');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete trip');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
        </nav>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4" />
          <div className="h-64 bg-gray-200 rounded-xl" />
          <div className="h-40 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <Link to="/trips" className="hover:text-primary-600 transition-colors">Trips</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-gray-900 font-medium">Trip</span>
        </nav>
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-red-600 text-lg mb-4">{error || 'Trip not found'}</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => window.location.reload()} className="text-primary-600 hover:text-primary-700 font-medium">
              Try again
            </button>
            <Link to="/trips" className="text-primary-600 hover:text-primary-700 font-medium">
              Back to Trips
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const mapBreweries = (trip.stops || []).map((s) => ({
    ...s,
    lat: s.lat ?? s.latitude,
    lng: s.lng ?? s.longitude,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        <Link to="/trips" className="hover:text-primary-600 transition-colors">Trips</Link>
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        <span className="text-gray-900 font-medium truncate">{trip.name || trip.title}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div />
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit Trip'}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
        {isEditing ? (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={editForm.startDate}
                  onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
                <input
                  type="date"
                  value={editForm.endDate}
                  onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                  min={editForm.startDate}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <button
              onClick={handleSaveTrip}
              disabled={saving}
              className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-3">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.name || trip.title}</h1>
                <p className="text-gray-600">
                  {getTripStartDate(trip) && new Date(getTripStartDate(trip)).toLocaleDateString()}
                  {getTripEndDate(trip) && <> — {new Date(getTripEndDate(trip)).toLocaleDateString()}</>}
                </p>
              </div>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800 w-fit">
                {trip.status || 'Planning'}
              </span>
            </div>
            {trip.description && <p className="text-gray-700 leading-relaxed">{trip.description}</p>}
          </>
        )}
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Route Map</h2>
          {user && (
            <button
              onClick={() => setShowAddStop(!showAddStop)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Stop
            </button>
          )}
        </div>

        {showAddStop && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
            <input
              type="text"
              placeholder="Search breweries to add..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
              autoFocus
            />
            {searching && <p className="text-sm text-gray-500">Searching...</p>}
            {searchResults.length > 0 && (
              <div className="max-h-60 overflow-y-auto space-y-2">
                {searchResults.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{b.name}</p>
                      <p className="text-xs text-gray-500">{b.city}{b.state ? `, ${b.state}` : ''}</p>
                    </div>
                    <button
                      onClick={() => handleAddStop(b)}
                      className="text-xs bg-primary-500 text-white px-3 py-1.5 rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
            {searchQuery.trim().length >= 2 && !searching && searchResults.length === 0 && (
              <p className="text-sm text-gray-500">No breweries found.</p>
            )}
          </div>
        )}

        {mapBreweries.length > 0 ? (
          <Map
            breweries={mapBreweries}
            trips={[{ id: trip.id, stops: mapBreweries }]}
            showRoute
            height="400px"
          />
        ) : (
          <div className="bg-gray-50 rounded-xl flex items-center justify-center h-64 text-gray-500">
            Add stops to see the route on the map
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Stops ({trip.stops?.length || 0})</h2>
        {trip.stops && trip.stops.length > 0 ? (
          <div className="space-y-3">
            {trip.stops.map((stop, index) => (
              <div key={stop.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <Link to={`/breweries/${stop.brewery_id || stop.id}`} className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                      {getStopName(stop)}
                    </Link>
                    <p className="text-sm text-gray-500">{stop.city}{stop.state ? `, ${stop.state}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMoveStop(stop.id, -1)}
                    disabled={index === 0}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-600 transition-colors"
                    title="Move up"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleMoveStop(stop.id, 1)}
                    disabled={index === trip.stops.length - 1}
                    className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-600 transition-colors"
                    title="Move down"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleRemoveStop(stop.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                    title="Remove stop"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <div className="text-5xl mb-3">📍</div>
            <p className="text-gray-500 mb-4">No stops yet. Add your first brewery to get started!</p>
            {user && (
              <button
                onClick={() => setShowAddStop(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl transition-all hover:shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Stop
              </button>
            )}
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl">
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">🗑️</div>
              <h3 className="text-lg font-bold text-gray-900">Delete Trip</h3>
            </div>
            <p className="text-gray-600 mb-6 text-center">Are you sure you want to delete this trip? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTrip}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors"
              >
                Delete Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
