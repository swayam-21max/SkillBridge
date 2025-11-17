// client/src/components/TrainerCourseCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Star, Edit3, Trash2, Tag } from 'lucide-react'; // Added Tag icon

const TrainerCourseCard = ({ course }) => {
  // Destructure with default values
  const { 
    title, 
    price, 
    image, 
    teachingHours = 0,
    enrollmentCount = 0,
    averageRating = 0,
    reviewCount = 0,
    skill, // Access the skill object
    id,
  } = course;

  // Handle cases where skill might be undefined/null
  const categoryName = skill ? skill.name : 'Uncategorized';

  const handleEdit = () => alert(`Edit course ${title} (ID: ${id})`);
  const handleDelete = () => alert(`Delete course ${title} (ID: ${id})`);

  return (
    <motion.div
      className="card course-card h-100"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <img 
        src={image || 'https://via.placeholder.com/300x200.png?text=SkillBridge'} 
        className="card-img-top course-card-img" 
        alt={title} 
      />
      <div className="card-body d-flex flex-column">
        {/* FIX: Category Badge */}
        <div className="mb-2">
           <span className="badge bg-primary-subtle text-primary-emphasis d-inline-flex align-items-center">
              <Tag size={12} className="me-1"/> {categoryName}
           </span>
        </div>

        <h5 className="card-title fw-bold">{title}</h5>
        
        <div className="d-flex justify-content-between text-muted small mb-3">
          <span className="d-flex align-items-center me-3">
            <BookOpen size={16} className="me-1" /> {teachingHours} Hrs
          </span>
          <span className="d-flex align-items-center">
            <Star size={16} className="text-warning me-1" fill="currentColor" /> {averageRating} ({reviewCount})
          </span>
        </div>
        
        <div className="mt-auto pt-3 border-top">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="price fs-4 fw-bold text-success">₹{price}</span>
            <span className="d-flex align-items-center text-primary fw-semibold">
              <Users size={18} className="me-1" /> {enrollmentCount} Enrolled
            </span>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-secondary-custom btn-sm w-50" onClick={handleEdit}>
              <Edit3 size={16} className="me-1" /> Edit
            </button>
            <button className="btn btn-danger btn-sm w-50" onClick={handleDelete}>
              <Trash2 size={16} className="me-1" /> Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TrainerCourseCard;