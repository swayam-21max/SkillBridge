// client/src/components/CourseCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { enrollInCourse } from '../redux/enrollmentSlice';

const CourseCard = ({ course }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Placeholder data until we add these to the schema
  const rating = 4.5;
  const reviews = Math.floor(Math.random() * 1500) + 100; // Random reviews
  const difficulty = 'Beginner';
  const trainerImage = 'https://via.placeholder.com/40';

  const handleEnroll = (e) => {
    e.preventDefault(); // Prevent link navigation
    if (!user) {
      alert('Please log in to enroll in a course.');
      return;
    }
    if (user.role !== 'learner') {
      alert('Only learners can enroll in courses.');
      return;
    }
    
    dispatch(enrollInCourse(course.id))
      .unwrap()
      .then(() => {
        alert('Enrollment successful!');
        // Optionally, you could disable the button or show "Enrolled"
      })
      .catch((error) => {
        alert(`Enrollment failed: ${error.error}`);
      });
  };

  return (
    <motion.div
      className="card course-card h-100"
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <img src={course.image || 'https://via.placeholder.com/300x200.png?text=SkillBridge'} className="card-img-top course-card-img" alt={course.title} />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge bg-primary-subtle text-primary-emphasis rounded-pill">{difficulty}</span>
          <div className="d-flex align-items-center">
            <Star size={16} className="text-warning me-1" fill="currentColor" />
            <span className="fw-bold">{rating}</span>
            <span className="text-muted ms-1">({reviews})</span>
          </div>
        </div>
        <h5 className="card-title mt-1">{course.title}</h5>
        
        {/* We use the trainer name from the backend data */}
        <div className="d-flex align-items-center my-3">
          <img src={trainerImage} alt={course.trainer.name} className="rounded-circle me-2" width="40" height="40" />
          <span className="trainer-name">{course.trainer.name}</span>
        </div>

        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="price">₹{course.price}</span>
          
          {/* If user is a learner, the button enrolls.
            Otherwise, it's just a link to the course page (for trainers/guests).
          */}
          {user && user.role === 'learner' ? (
            <button onClick={handleEnroll} className="btn btn-primary-custom btn-sm">Enroll Now</button>
          ) : (
            <Link to={`/course/${course.id}`} className="btn btn-primary-custom btn-sm">View Details</Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
