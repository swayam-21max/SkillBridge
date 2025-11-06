// client/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Award, BookOpen, Edit, UserCheck } from 'lucide-react';
import EnrolledCourseCard from '../components/EnrolledCourseCard';
import Loader from '../components/Loader';
import './ProfilePage.css';

// THIS IS THE FIX:
// Renamed 'fetchUserEnrollments' to the correct 'fetchEnrollments'
import { fetchEnrollments } from '../redux/enrollmentSlice';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const { items: enrolledCourses, status: enrollmentStatus } = useSelector((state) => state.enrollments);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('enrolled');

  // Fetch enrollments when the component loads
  useEffect(() => {
    // Only fetch if we are logged in and haven't fetched yet
    if (user && enrollmentStatus === 'idle') {
      // Dispatch the correctly named function
      dispatch(fetchEnrollments()); 
    }
  }, [dispatch, user, enrollmentStatus]);

  if (!user) {
    return <div className="text-center p-5"><Loader /></div>;
  }

  // Render function for enrolled courses
  const renderEnrolledCourses = () => {
    if (enrollmentStatus === 'loading') {
      return <div className="text-center"><Loader /></div>;
    }

    if (enrollmentStatus === 'succeeded' && enrolledCourses.length === 0) {
      return <div className="text-center"><p>You are not enrolled in any courses yet.</p></div>;
    }

    return (
      <div className="row g-4">
        {enrolledCourses.map(enrollment => (
          <div className="col-md-4" key={enrollment.id}>
            {/* Pass the whole enrollment object */}
            <EnrolledCourseCard enrollment={enrollment} /> 
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="profile-page-container">
      {/* Profile Header */}
      <header className="profile-header">
        <div className="container text-center">
          <img src="https://via.placeholder.com/150" alt={user.name} className="profile-picture mb-3" />
          <h1 className="display-5 fw-bold">{user.name}</h1>
          <p className="lead text-white-50">{user.role === 'trainer' ? 'Expert Trainer' : 'Aspiring Learner'}</p>
          <div className="row mt-4">
            <div className="col-md-3"><div className="profile-stats-card"><span className="stat-value">{enrolledCourses.length}</span><br/><span className="stat-label">Courses Enrolled</span></div></div>
            <div className="col-md-3"><div className="profile-stats-card"><span className="stat-value">0</span><br/><span className="stat-label">Skills Mastered</span></div></div>
            <div className="col-md-3"><div className="profile-stats-card"><span className="stat-value">0</span><br/><span className="stat-label">Achievements</span></div></div>
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
              {renderEnrolledCourses()}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;