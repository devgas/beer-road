import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ChallengeRoulette({ challenges, onSpin, spinning, resultChallenge }) {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSpin = async () => {
    if (challenges.length === 0) {
      toast.error('No challenges available');
      return;
    }

    setIsAnimating(true);
    setSelectedChallenge(null);

    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * challenges.length);
      setSelectedChallenge(challenges[randomIndex]);
      counter++;
      if (counter > 20) {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * challenges.length);
        setSelectedChallenge(challenges[finalIndex]);
        setIsAnimating(false);
        onSpin();
      }
    }, 100);
  };

  const displayChallenge = resultChallenge || selectedChallenge;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">🎰 Challenge Roulette</h2>
      <p className="text-gray-600 mb-6">Spin the wheel and get a random challenge!</p>

      <div className="relative w-48 h-48 mx-auto mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-6xl">🎲</span>
        </div>
      </div>

      {displayChallenge && !spinning && !isAnimating && (
        <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-sm font-medium text-amber-800 mb-1">Your Challenge:</p>
          <h3 className="text-lg font-bold text-gray-900">{displayChallenge.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{displayChallenge.description}</p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
              {displayChallenge.difficulty}
            </span>
            <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
              +{displayChallenge.points} points
            </span>
          </div>
        </div>
      )}

      <button
        onClick={handleSpin}
        disabled={spinning || isAnimating}
        className="px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-semibold rounded-xl transition-all hover:shadow-lg disabled:opacity-50"
      >
        {spinning || isAnimating ? 'Spinning...' : 'Spin for Challenge'}
      </button>
    </div>
  );
}
