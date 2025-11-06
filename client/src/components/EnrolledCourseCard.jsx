// client/src/components/EnrolledCourseCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
// --- 1. IMPORT Link ---
import { Link } from 'react-router-dom';

// Note: I'm renaming this prop back to 'enrollment' to match the Profile page
const EnrolledCourseCard = ({ enrollment }) => {
  // Get the course and progress/status from the enrollment object
  const { course, status } = enrollment;
  const progress = status === 'completed' ? 100 : 30; // Placeholder progress

  return (
    <motion.div 
      className="card enrolled-course-card h-100"
      whileHover={{ y: -5 }}
    >
      <img src={course.image} className="card-img-top" alt={course.title} style={{ height: '180px', objectFit: 'cover' }}/>
      <div className="card-body">
        <h5 className="card-title fw-bold">{course.title}</h5>
        <p className="card-text text-muted mb-2">by {course.trainer.name}</p>
        <div className="progress" style={{ height: '8px' }}>
          <div 
            className="progress-bar" 
            role="progressbar" 
            style={{ width: `${progress}%` }} 
            aria-valuenow={progress} 
            aria-valuemin="0" 
            aria-valuemax="100"
          ></div>
        </div>
        <small className="text-muted">{progress}% Complete</small>
      </div>
      <div className="card-footer bg-white border-0 pb-3">
        {/* --- 2. THE FIX ---
            Replaced the <a href="#"> tag with a <Link>
            that points to the correct Course Details route.
        */}
        <Link to={`/course/${course.id}`} className="btn btn-primary-custom w-100">
          Resume
        </Link>
      </div>
    </motion.div>
  );
};

export default EnrolledCourseCard;