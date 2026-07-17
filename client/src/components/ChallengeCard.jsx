import { useState } from 'react';
import { challengeImageUrl } from '../utils/media';
import { useI18n } from '../context/I18nContext';

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
};

export default function ChallengeCard({ challenge, onAccept, accepted }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = challengeImageUrl(challenge);
  const { t } = useI18n();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-40 bg-gray-100">
        {!imgError ? (
          <img
            src={imageUrl}
            alt={challenge.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🎯</div>
        )}
        <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[challenge.difficulty] || difficultyColors.medium}`}>
          {challenge.difficulty}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{challenge.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{challenge.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
              +{challenge.points} points
            </span>
            {challenge.category && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                {challenge.category}
              </span>
            )}
          </div>

          {accepted ? (
            <span className="text-sm text-green-600 font-medium">✓ {t('accepted')}</span>
          ) : (
            <button
              onClick={() => onAccept(challenge.id)}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {t('accept')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
