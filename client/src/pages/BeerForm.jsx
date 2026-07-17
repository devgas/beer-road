import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const EMPTY = {
  brewery_id: '',
  name: '',
  style: '',
  abv: '',
  ibu: '',
  description: '',
  image_url: '',
};

const STYLE_OPTIONS = ['IPA', 'Pale Ale', 'Stout', 'Porter', 'Pilsner', 'Lager', 'Saison', 'Farmhouse Ale', 'Sour', 'Wheat', 'Witbier', 'Maibock', 'Old Ale'];

export default function BeerForm() {
  const { id, breweryId } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useI18n();

  const [form, setForm] = useState({ ...EMPTY, brewery_id: breweryId || '' });
  const [breweries, setBreweries] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const load = async () => {
      try {
        const [breweriesRes, beerRes] = await Promise.all([
          api.get('/breweries?limit=100'),
          isEdit ? api.get(`/beers/${id}`) : Promise.resolve(null),
        ]);
        setBreweries(breweriesRes.data?.data || []);

        if (beerRes) {
          const b = beerRes.beer || beerRes;
          setForm({
            brewery_id: b.brewery_id ?? '',
            name: b.name || '',
            style: b.style || '',
            abv: b.abv ?? '',
            ibu: b.ibu ?? '',
            description: b.description || '',
            image_url: b.image_url || '',
          });
        }
      } catch {
        toast.error('Could not load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit, user, navigate]);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brewery_id) {
      toast.error('Please select a brewery');
      return;
    }
    if (!form.name.trim()) {
      toast.error('Beer name is required');
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/beers/${id}`, form);
        toast.success('Beer updated');
      } else {
        await api.post('/beers', form);
        toast.success('Beer created');
      }
      navigate(`/breweries/${form.brewery_id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to save beer');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 bg-gray-200 rounded w-40 animate-pulse mb-6" />
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />)}</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/breweries" className="hover:text-primary-600 transition-colors">Breweries</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        <span className="text-gray-900 font-medium">{isEdit ? 'Edit Beer' : 'Add Beer'}</span>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">{isEdit ? t('editBeer') : t('addBeer')}</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('brewery')} *</label>
          <select value={form.brewery_id} onChange={(e) => update('brewery_id', e.target.value)} disabled={Boolean(breweryId)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
            <option value="">{t('selectBrewery')}</option>
            {breweries.map((b) => (
              <option key={b.id} value={b.id}>{b.name}{b.city ? `, ${b.city}` : ''}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('beerName')} *</label>
            <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('style')}</label>
            <select value={form.style} onChange={(e) => update('style', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
              <option value="">{t('selectStyle')}</option>
              {STYLE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ABV (%)</label>
            <input type="number" step="0.1" min="0" value={form.abv} onChange={(e) => update('abv', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">IBU</label>
            <input type="number" step="1" min="0" value={form.ibu} onChange={(e) => update('ibu', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('imageUrl')}</label>
          <input type="text" value={form.image_url} onChange={(e) => update('image_url', e.target.value)} placeholder="/images/beer-ipa.jpg" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
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
