import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import BreweryCard from '../components/BreweryCard';
import { COUNTRIES } from '../utils/constants';

export default function Breweries() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resultCount, setResultCount] = useState(0);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [types, setTypes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchQuery = searchParams.get('q') || '';
  const cityFilter = searchParams.get('city') || '';
  const stateFilter = searchParams.get('state') || '';
  const typeFilter = searchParams.get('type') || '';
  const countryFilter = searchParams.get('country') || '';

  const fetchFilters = useCallback(async () => {
    try {
      const [citiesRes, statesRes, typesRes] = await Promise.all([
        fetch('/api/breweries/filters/cities').then(r => r.ok ? r.json() : []),
        fetch('/api/breweries/filters/states').then(r => r.ok ? r.json() : []),
        fetch('/api/breweries/filters/types').then(r => r.ok ? r.json() : []),
      ]);
      setCities(citiesRes);
      setStates(statesRes);
      setTypes(typesRes);
    } catch (e) {
      console.error('Failed to fetch filters:', e);
    }
  }, []);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  useEffect(() => {
    const fetchBreweries = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (cityFilter) params.set('city', cityFilter);
        if (stateFilter) params.set('state', stateFilter);
        if (typeFilter) params.set('type', typeFilter);
        if (countryFilter) params.set('country', countryFilter);
        params.set('page', page.toString());
        params.set('limit', '12');

        const res = await fetch(`/api/breweries?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch breweries');
        const data = await res.json();
        setBreweries(data.data || []);
        setResultCount(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBreweries();
  }, [searchQuery, cityFilter, stateFilter, typeFilter, countryFilter, page]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setPage(1);
    setSearchParams(newParams);
  };

  const handleSearchChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      newParams.set('q', value.trim());
    } else {
      newParams.delete('q');
    }
    setPage(1);
    setSearchParams(newParams);
  };

  const clearFilters = () => setSearchParams({});

  const activeFiltersCount = [searchQuery, cityFilter, stateFilter, typeFilter, countryFilter].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Breweries</h1>
        <p className="mt-1 text-gray-600">
          {resultCount > 0 ? `Found ${resultCount} brewery${resultCount !== 1 ? 'ies' : ''}` : 'Discover craft breweries near you'}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Filters</h2>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear all ({activeFiltersCount})
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Search</label>
            <input
              type="text"
              placeholder="Search by name, city, or state..."
              defaultValue={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Country</label>
            <select
              value={countryFilter}
              onChange={(e) => updateFilter('country', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
            >
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">City</label>
            <select
              value={cityFilter}
              onChange={(e) => updateFilter('city', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
            >
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">State</label>
            <select
              value={stateFilter}
              onChange={(e) => updateFilter('state', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
            >
              <option value="">All States</option>
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => updateFilter('type', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
            >
              <option value="">All Types</option>
              {types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          {breweries.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <div className="text-6xl mb-4">🍺</div>
              <p className="text-gray-500 text-lg mb-4">No breweries found matching your criteria.</p>
              <button
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {breweries.map((brewery) => (
                  <BreweryCard key={brewery.id} brewery={brewery} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-5 py-2.5 border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-5 py-2.5 border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
