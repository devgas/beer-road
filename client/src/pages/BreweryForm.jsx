import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const EMPTY = {
  name: '',
  type: '',
  country: 'USA',
  city: '',
  state: '',
  address: '',
  website: '',
  phone: '',
  description: '',
  lat: '',
  lng: '',
};

export default function BreweryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useI18n();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isEdit) return;
    const fetchBrewery = async () => {
      try {
        const res = await fetch(`/api/breweries/${id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        const b = data.brewery || data;
        setForm({
          name: b.name || '',
          type: b.type || '',
          country: b.country || 'USA',
          city: b.city || '',
          state: b.state || '',
          address: b.address || '',
          website: b.website || '',
          phone: b.phone || '',
          description: b.description || '',
          lat: b.lat ?? '',
          lng: b.lng ?? '',
        });
      } catch {
        toast.error('Brewery not found');
        navigate('/breweries');
      } finally {
        setLoading(false);
      }
    };
    fetchBrewery();
  }, [id, isEdit, user, navigate]);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Brewery name is required');
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/breweries/${id}`, form);
        toast.success('Brewery updated');
        navigate(`/breweries/${id}`);
      } else {
        const { data } = await api.post('/breweries', form);
        toast.success('Brewery created');
        navigate(`/breweries/${data.brewery?.id || ''}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to save brewery');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/breweries" className="hover:text-primary-600 transition-colors">Breweries</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        <span className="text-gray-900 font-medium">{isEdit ? 'Edit Brewery' : 'Add Brewery'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">{isEdit ? t('editBrewery') : t('addBrewery')}</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('breweryName')} *</label>
          <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('type')}</label>
            <input type="text" value={form.type} onChange={(e) => update('type', e.target.value)} placeholder="Micro, Regional, Sour, Farmhouse..." className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('country')}</label>
            <input type="text" value={form.country} onChange={(e) => update('country', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('city')}</label>
            <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('state')}</label>
            <input type="text" value={form.state} onChange={(e) => update('state', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('address')}</label>
            <input type="text" value={form.address} onChange={(e) => update('address', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('website')}</label>
            <input type="url" value={form.website} onChange={(e) => update('website', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('phone')}</label>
            <input type="text" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Latitude</label>
              <input type="number" step="any" value={form.lat} onChange={(e) => update('lat', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Longitude</label>
              <input type="number" step="any" value={form.lng} onChange={(e) => update('lng', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('description')}</label>
          <textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
            {saving ? t('saving') : isEdit ? t('update') : t('create')}
          </button>
          <Link to="/breweries" className="px-4 py-2.5 text-gray-600 hover:text-gray-900 font-medium transition-colors">{t('cancel')}</Link>
        </div>
      </form>
    </div>
  );
}
