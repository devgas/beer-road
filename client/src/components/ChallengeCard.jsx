import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const CHALLENGE_IMAGES = [
  '1535958636474', '1535958636475', '1535958636476', '1535958636477', '1535958636478',
  '1535958636479', '1535958636480', '1535958636481', '1535958636482', '1535958636483',
  '1535958636484', '1535958636485', '1535958636486', '1535958636487', '1535958636488',
  '1535958636489', '1535958636490', '1535958636491', '1535958636492', '1535958636493',
];

function getChallengeImageId(challengeId) {
  let hash = 0;
  const str = String(challengeId);
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CHALLENGE_IMAGES[Math.abs(hash) % CHALLENGE_IMAGES.length];
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
};

export default function ChallengeCard({ challenge, onAccept, accepted }) {
  const [imgError, setImgError] = useState(false);
  const imageId = useMemo(() => getChallengeImageId(challenge.id), [challenge.id]);
  const imageUrl = `https://images.unsplash.com/photo-${imageId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`;

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
            <span className="text-sm text-green-600 font-medium">✓ Accepted</span>
          ) : (
            <button
              onClick={() => onAccept(challenge.id)}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Accept
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
