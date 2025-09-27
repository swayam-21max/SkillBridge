// client/src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Award, BookOpen, Edit, UserCheck } from 'lucide-react';
import EnrolledCourseCard from '../components/EnrolledCourseCard';
import './ProfilePage.css';

// Placeholder Data
const enrolledCourses = [
  { id: 1, title: 'Modern React with Hooks', trainer: 'Anjali Sharma', progress: 75, image: 'https://images.unsplash.com/photo-1579403124614-197f69d8187b?q=80&w=1740&auto=format&fit=crop' },
  { id: 2, title: 'Advanced Node.js and Express', trainer: 'Vikram Singh', progress: 30, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1740&auto=format&fit=crop' },
];

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('enrolled');

  if (!user) {
    return <div>Loading...</div>; // Or a proper loader component
  }

  return (
    <div className="profile-page-container">
      {/* Profile Header */}
      <header className="profile-header">
        <div className="container text-center">
          <img src="https://via.placeholder.com/150" alt={user.name} className="profile-picture mb-3" />
          <h1 className="display-5 fw-bold">{user.name}</h1>
          <p className="lead text-white-50">{user.role === 'trainer' ? 'Expert Trainer' : 'Aspiring Learner'}</p>
          <div className="row mt-4">
            <div className="col-md-3"><div className="profile-stats-card"><span className="stat-value">12</span><br/><span className="stat-label">Courses Enrolled</span></div></div>
            <div className="col-md-3"><div className="profile-stats-card"><span className="stat-value">5</span><br/><span className="stat-label">Skills Mastered</span></div></div>
            <div className="col-md-3"><div className="profile-stats-card"><span className="stat-value">8</span><br/><span className="stat-label">Achievements</span></div></div>
            <div className="col-md-3"><div className="profile-stats-card"><button className="btn btn-light"><Edit size={16} className="me-2"/> Edit Profile</button></div></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container my-5">
        <ul className="nav nav-tabs profile-nav mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'enrolled' ? 'active' : ''}`} onClick={() => setActiveTab('enrolled')}>My Enrolled Courses</button>
          </li>
          {/* Add more tabs for Skills, Achievements, Settings etc. */}
        </ul>

        {/* Tab Content */}
        <div>
          {activeTab === 'enrolled' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="row g-4">
                {enrolledCourses.map(course => (
                  <div className="col-md-4" key={course.id}>
                    <EnrolledCourseCard course={course} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;