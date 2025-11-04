// client/src/components/CourseCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Star, BarChart2 } from 'lucide-react';

const CourseCard = ({ course }) => {
  // Placeholder data until we have it from the backend
  const rating = 4.5;
  const reviews = 1234;
  const difficulty = 'Beginner';
  const trainerImage = 'https://via.placeholder.com/40';

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
        <div className="d-flex align-items-center my-3">
          <img src={trainerImage} alt={course.trainer.name} className="rounded-circle me-2" width="40" height="40" />
          <span className="trainer-name">{course.trainer.name}</span>
        </div>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="price">₹{course.price}</span>
          <a href="#" className="btn btn-primary-custom btn-sm">Enroll Now</a>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;