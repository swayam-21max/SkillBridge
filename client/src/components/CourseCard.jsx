// client/src/components/CourseCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const CourseCard = ({ course }) => {
  return (
    <motion.div
      className="card course-card h-100"
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <img src={course.image} className="card-img-top course-card-img" alt={course.title} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{course.title}</h5>
        <p className="trainer-name mb-2">{course.trainer}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="price">{course.price}</span>
          <a href="#" className="btn btn-primary-custom btn-sm">Enroll Now</a>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;