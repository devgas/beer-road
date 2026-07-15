import { Link } from 'react-router-dom';

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800',
};

export default function ChallengeCard({ challenge, onAccept, accepted }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900">{challenge.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[challenge.difficulty] || difficultyColors.medium}`}>
          {challenge.difficulty}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">{challenge.description}</p>

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
  );
}
