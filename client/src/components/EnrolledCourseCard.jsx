// client/src/components/EnrolledCourseCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const EnrolledCourseCard = ({ course }) => {
  return (
    <motion.div 
      className="card enrolled-course-card h-100"
      whileHover={{ y: -5 }}
    >
      <img src={course.image} className="card-img-top" alt={course.title} style={{ height: '180px', objectFit: 'cover' }}/>
      <div className="card-body">
        <h5 className="card-title fw-bold">{course.title}</h5>
        <p className="card-text text-muted mb-2">by {course.trainer}</p>
        <div className="progress" style={{ height: '8px' }}>
          <div 
            className="progress-bar" 
            role="progressbar" 
            style={{ width: `${course.progress}%` }} 
            aria-valuenow={course.progress} 
            aria-valuemin="0" 
            aria-valuemax="100"
          ></div>
        </div>
        <small className="text-muted">{course.progress}% Complete</small>
      </div>
      <div className="card-footer bg-white border-0 pb-3">
        <a href="#" className="btn btn-primary-custom w-100">Resume</a>
      </div>
    </motion.div>
  );
};

export default EnrolledCourseCard;