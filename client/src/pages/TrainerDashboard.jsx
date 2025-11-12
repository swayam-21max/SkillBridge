// client/src/pages/TrainerDashboard.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { PlusCircle, BookOpen, UserCheck, LayoutDashboard } from 'lucide-react';
import CreateCourseModal from '../components/CreateCourseModal'; // We will create this next
import Loader from '../components/Loader';
// Assuming we fetch the trainer's courses here later

const TrainerDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    // Placeholder data (replace with state later)
    const coursesCreated = 3; 
    const totalEnrollments = 45;
    const avgRating = 4.7;
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    if (!user || user.role !== 'trainer') {
        // Prevent learners/unauthorized access
        return <div className="text-center p-5"><p>Access Denied: Trainers only.</p></div>;
    }
    
    return (
        <div className="trainer-dashboard-page" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '3rem 0' }}>
            <div className="container">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }}
                >
                    <header className="d-flex justify-content-between align-items-center mb-5 p-4 rounded-3" style={{ background: 'linear-gradient(90deg, #1d4ed8, #2563eb)', color: 'white' }}>
                        <div>
                            <h1 className="fw-bold d-flex align-items-center"><LayoutDashboard className="me-3" size={32} />Trainer Dashboard</h1>
                            <p className="lead mb-0">Welcome back, {user.name}. Manage your courses and track your impact.</p>
                        </div>
                        <button className="btn btn-light fw-bold px-4 py-2" onClick={() => setIsModalOpen(true)}>
                            <PlusCircle size={20} className="me-2" /> Create New Course
                        </button>
                    </header>

                    {/* Stats Section */}
                    <div className="row g-4 mb-5">
                        <div className="col-md-4">
                            <div className="card shadow-sm p-4 h-100">
                                <BookOpen size={32} className="text-primary mb-3" />
                                <h3 className="fw-bold">{coursesCreated}</h3>
                                <p className="text-muted">Courses Created</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow-sm p-4 h-100">
                                <UserCheck size={32} className="text-success mb-3" />
                                <h3 className="fw-bold">{totalEnrollments}</h3>
                                <p className="text-muted">Total Enrollments</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card shadow-sm p-4 h-100">
                                <Star size={32} className="text-warning mb-3" fill="currentColor" />
                                <h3 className="fw-bold">{avgRating}</h3>
                                <p className="text-muted">Average Course Rating</p>
                            </div>
                        </div>
                    </div>

                    {/* Course Listing (Placeholder) */}
                    <h2 className="fw-bold mb-4">My Published Courses</h2>
                    <div className="card shadow-sm p-4 text-center">
                        <p className="lead text-muted">Course management list will appear here.</p>
                        <p>Click "Create New Course" to get started.</p>
                    </div>
                </motion.div>
            </div>
            
            {/* Modal for Creating Course */}
            <CreateCourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default TrainerDashboard;