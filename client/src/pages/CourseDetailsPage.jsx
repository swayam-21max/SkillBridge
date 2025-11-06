// client/src/pages/CourseDetailsPage.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById, clearSelectedCourse } from '../redux/coursesSlice';
import { fetchRatingsByCourseId, clearRatings } from '../redux/ratingSlice';
import { Star } from 'lucide-react';
import RatingForm from '../components/RatingForm';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // Get Course Details
  const { selectedCourse: course, selectedStatus } = useSelector((state) => state.courses);
  // Get Ratings
  const { items: ratings, status: ratingsStatus } = useSelector((state) => state.ratings);
  // Get User and Enrollment status
  const { user } = useSelector((state) => state.auth);
  const { items: enrollments } = useSelector((state) => state.enrollments);

  // Check if the current user is enrolled in THIS course
  const isEnrolled = user && enrollments.some(e => e.courseId === parseInt(id) && e.learnerId === user.id);

  useEffect(() => {
    // Fetch course details and ratings when component mounts
    dispatch(fetchCourseById(id));
    dispatch(fetchRatingsByCourseId(id));

    // Clear the data when component unmounts
    return () => {
      dispatch(clearSelectedCourse());
      dispatch(clearRatings());
    };
  }, [id, dispatch]);

  if (selectedStatus === 'loading' || !course) {
    return <div>Loading course details...</div>; // Replace with Loader component
  }

  // Calculate average rating
  const totalRatings = ratings.length;
  const avgRating = totalRatings > 0 
    ? (ratings.reduce((acc, r) => acc + r.rating, 0) / totalRatings).toFixed(1)
    : "Not Rated";

  return (
    <div className="container my-5">
      <div className="row">
        {/* Main Content */}
        <div className="col-lg-8">
          <h1 className="fw-bold">{course.title}</h1>
          <p className="lead">{course.description}</p>
          <div className="d-flex align-items-center mb-3">
            <span className="fw-bold fs-5 me-2">{avgRating}</span>
            <Star size={20} className="text-warning me-1" fill="currentColor" />
            <span className="text-muted">({totalRatings} ratings)</span>
            <span className="mx-2">|</span>
            <span className="text-muted">Taught by {course.trainer.name}</span>
          </div>

          <hr className="my-4" />

          {/* Ratings & Reviews Section */}
          <h2 className="fw-bold mb-4">Reviews</h2>
          
          {/* Show Rating Form ONLY if user is enrolled */}
          {user && user.role === 'learner' && isEnrolled && (
            <RatingForm courseId={id} />
          )}

          {/* List of Ratings */}
          <div className="ratings-list">
            {ratingsStatus === 'loading' && <div>Loading reviews...</div>}
            {ratingsStatus === 'succeeded' && ratings.length === 0 && (
              <p>Be the first to review this course!</p>
            )}
            {ratingsStatus === 'succeeded' && ratings.map(rating => (
              <div className="card mb-3" key={rating.id}>
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h5 className="card-title">{rating.learner.name}</h5>
                    <div>
                      {[...Array(rating.rating)].map((_, i) => (
                        <Star key={i} size={16} className="text-warning" fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="card-text text-muted">{rating.comment}</p>
                  <small className="text-muted">
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="card shadow-sm" style={{ position: 'sticky', top: '2rem' }}>
            <img src={course.image} alt={course.title} className="card-img-top" />
            <div className="card-body">
              <h2 className="fw-bold">₹{course.price}</h2>
              {/* Show different buttons based on user status */}
              {user && user.role === 'learner' ? (
                isEnrolled ? (
                  <button className="btn btn-secondary-custom w-100" disabled>Enrolled</button>
                ) : (
                  <button className="btn btn-primary-custom w-100">Enroll Now</button> // We can wire this up later
                )
              ) : user && user.role === 'trainer' ? (
                 <button className="btn btn-secondary-custom w-100" disabled>You are the trainer</button>
              ) : (
                <button className="btn btn-primary-custom w-100">Enroll Now</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;