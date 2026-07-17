import { useState, useEffect } from 'react';
import ChallengeCard from '../components/ChallengeCard';
import ChallengeRoulette from '../components/ChallengeRoulette';
import ChallengeCompletionModal from '../components/ChallengeCompletionModal';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useI18n } from '../context/I18nContext';

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [resultChallenge, setResultChallenge] = useState(null);
  const { user } = useAuth();
  const { t } = useI18n();

  useEffect(() => {
    fetchChallenges();
    if (user) fetchMyChallenges();
  }, [user, selectedCategory]);

  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = selectedCategory ? `/api/challenges?category=${selectedCategory}` : '/api/challenges';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load challenges');
      if (res.ok) {
        const data = await res.json();
        setChallenges(data.data || []);
      }
    } catch (e) {
      console.error('Failed to fetch challenges:', e);
      setChallenges([]);
      setError(t('challengesLoadError'));
    } finally {
      setLoading(false);
    }
  };

  const fetchMyChallenges = async () => {
    try {
      const { data } = await api.get('/challenges/my-challenges');
      setMyChallenges(data.data || []);
    } catch (e) {
      console.error('Failed to fetch my challenges:', e);
    }
  };

  const handleAccept = async (challengeId) => {
    try {
      await api.post(`/challenges/${challengeId}/accept`);
      toast.success('Challenge accepted! 🎉');
      fetchMyChallenges();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to accept challenge');
    }
  };

  const handleSpin = async () => {
    setSpinning(true);
    setResultChallenge(null);
    try {
      const { data } = await api.get('/challenges/random');
      setResultChallenge(data.challenge);
      setSpinning(false);
      await handleAccept(data.challenge.id);
    } catch (e) {
      setSpinning(false);
      toast.error('Failed to get random challenge');
    }
  };

  const categories = ['beginner', 'style', 'social', 'travel'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('challenges')}</h1>
        <p className="mt-1 text-gray-600">{t('challengesSubtitle')}</p>
      </div>

      {/* Roulette Section */}
      <div className="mb-12">
        <ChallengeRoulette
          challenges={challenges}
          onSpin={handleSpin}
          spinning={spinning}
          resultChallenge={resultChallenge}
          loading={loading}
          disabled={Boolean(error)}
        />
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      {/* My Challenges */}
      {myChallenges.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('myChallenges')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myChallenges.map((uc) => (
              <div key={uc.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{uc.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    uc.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {uc.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{uc.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary-600">+{uc.points} points</span>
                  {uc.status === 'pending' && (
                    <CompleteChallengeButton userChallenge={uc} onComplete={fetchMyChallenges} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Challenges */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('allChallenges')}</h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="">{t('allCategories')}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-40 bg-gray-200 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
                    <div className="h-9 bg-gray-200 rounded w-24 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="text-7xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('noChallengesYet')}</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {t('noChallengesHint')}
                </p>
              </div>
            )}
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onAccept={handleAccept}
                accepted={myChallenges.some((uc) => uc.challenge_id === challenge.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CompleteChallengeButton({ userChallenge, onComplete }) {
  const [showModal, setShowModal] = useState(false);
  const { t } = useI18n();

  const handleSubmit = async ({ proof_image_url, review }) => {
    try {
      await api.post(`/challenges/${userChallenge.challenge_id}/complete`, {
        proof_image_url,
        review,
        brewery_id: review?.brewery_id,
      });
      toast.success('Challenge completed! 🎉');
      setShowModal(false);
      onComplete();
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to complete challenge');
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {t('complete')}
      </button>
      {showModal && (
        <ChallengeCompletionModal
          challenge={userChallenge}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
