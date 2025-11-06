// client/src/components/RatingForm.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitRating } from '../redux/ratingSlice';
import { Star } from 'lucide-react';

const RatingForm = ({ courseId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  
  const dispatch = useDispatch();
  const { submitStatus, submitError } = useSelector((state) => state.ratings);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating.');
      return;
    }
    dispatch(submitRating({ courseId, rating, comment }))
      .unwrap()
      .then(() => {
        setRating(0);
        setComment('');
      })
      .catch((err) => {
        // Error is already handled in the slice, but you could show an alert
      });
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h4 className="card-title">Leave a Review</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Your Rating</label>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={28}
                  className="me-1"
                  style={{ cursor: 'pointer', color: (hoverRating || rating) >= star ? '#ffc107' : '#e4e5e9' }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="comment" className="form-label">Your Review</label>
            <textarea
              id="comment"
              className="form-control"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary-custom" disabled={submitStatus === 'loading'}>
            {submitStatus === 'loading' ? 'Submitting...' : 'Submit Review'}
          </button>
          {submitError && <div className="alert alert-danger mt-3">{submitError}</div>}
        </form>
      </div>
    </div>
  );
};

export default RatingForm;