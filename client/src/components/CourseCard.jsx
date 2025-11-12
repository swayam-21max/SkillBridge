// client/src/components/CourseCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { enrollInCourse } from '../redux/enrollmentSlice';
import toast from 'react-hot-toast'; // Assume toast library is added

const CourseCard = ({ course }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // --- UPDATED: Use actual data from the course object ---
  const { 
    id, 
    title, 
    price, 
    image, 
    trainer, 
    averageRating = 0, // Default to 0 if not rated
    reviewCount = 0,    // Default to 0 if no reviews
    difficulty = 'N/A' // Use the calculated difficulty
  } = course;
  // -----------------------------------------------------
  
  const trainerImage = 'https://via.placeholder.com/40';

  const handleEnroll = (e) => {
    e.preventDefault(); // Prevent link navigation
    if (!user) {
      // Use toast instead of alert
      toast.error('Please log in to enroll in a course.');
      return;
    }
    if (user.role !== 'learner') {
      toast.error('Only learners can enroll in courses.');
      return;
    }
    
    dispatch(enrollInCourse(id))
      .unwrap()
      .then(() => {
        toast.success(`Successfully enrolled in ${title}!`);
      })
      .catch((error) => {
        toast.error(`Enrollment failed: ${error.error}`);
      });
  };

  return (
    <motion.div
      className="card course-card h-100"
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <img 
        src={image || 'https://via.placeholder.com/300x200.png?text=SkillBridge'} 
        className="card-img-top course-card-img" 
        alt={title} 
      />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2">
          {/* UPDATED: Use real difficulty */}
          <span className={`badge rounded-pill ${difficulty === 'Beginner' ? 'bg-success-subtle text-success-emphasis' : difficulty === 'Advanced' ? 'bg-danger-subtle text-danger-emphasis' : 'bg-info-subtle text-info-emphasis'}`}>{difficulty}</span>
          <div className="d-flex align-items-center">
            {/* UPDATED: Use real rating data */}
            <Star size={16} className="text-warning me-1" fill="currentColor" />
            <span className="fw-bold">{averageRating || 'N/A'}</span>
            <span className="text-muted ms-1">({reviewCount})</span>
          </div>
        </div>
        <h5 className="card-title mt-1">{title}</h5>
        
        <div className="d-flex align-items-center my-3">
          <img src={trainerImage} alt={trainer.name} className="rounded-circle me-2" width="40" height="40" />
          <span className="trainer-name">{trainer.name}</span>
        </div>

        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="price">₹{price}</span>
          
          {user && user.role === 'learner' ? (
            <button onClick={handleEnroll} className="btn btn-primary-custom btn-sm">Enroll Now</button>
          ) : (
            <Link to={`/course/${id}`} className="btn btn-primary-custom btn-sm">View Details</Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;