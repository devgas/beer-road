import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

export default function ChallengeCompletionModal({ challenge, onClose, onSubmit }) {
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [proofImage, setProofImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit({
        proof_image_url: proofImage,
        review,
      });
    } catch (err) {
      toast.error('Failed to complete challenge');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Complete Challenge</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-1">{challenge.title}</h4>
          <p className="text-sm text-gray-600">{challenge.description}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Upload Proof Photo</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 transition-colors text-center"
            >
              {proofImage ? '📷 Photo selected' : '📷 Click to upload photo'}
            </button>
            {proofImage && (
              <img src={proofImage} alt="Proof" className="mt-2 w-full h-48 object-cover rounded-xl" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Rating</label>
            <select
              value={review.rating}
              onChange={(e) => setReview({ ...review, rating: parseInt(e.target.value) })}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Review (optional)</label>
            <textarea
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Share your experience..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !proofImage}
              className="flex-1 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-400 text-white font-medium rounded-lg transition-colors"
            >
              {submitting ? 'Submitting...' : 'Complete Challenge'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
