// client/src/pages/TrainerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { PlusCircle, BookOpen, UserCheck, LayoutDashboard, Star, TrendingUp, DollarSign } from 'lucide-react'; 
import CountUp from 'react-countup'; 
import CreateCourseModal from '../components/CreateCourseModal'; 
import Loader from '../components/Loader';
import TrainerCourseCard from '../components/TrainerCourseCard'; // NEW IMPORT
import { fetchTrainerCourses } from '../redux/coursesSlice'; // NEW IMPORT


const TrainerDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const { 
        trainerCourses, 
        trainerStatus 
    } = useSelector((state) => state.courses); 
    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Fetch courses when the component mounts or user state changes
    useEffect(() => {
        if (user && user.role === 'trainer' && trainerStatus === 'idle') {
            dispatch(fetchTrainerCourses());
        }
    }, [user, trainerStatus, dispatch]);


    if (!user || user.role !== 'trainer') {
        return <div className="text-center p-5"><p>Access Denied: Trainers only.</p></div>;
    }
    
    // --- CALCULATE KEY STATS ---
    const totalEnrollments = trainerCourses.reduce((sum, course) => sum + course.enrollmentCount, 0);
    const totalCourses = trainerCourses.length;
    const totalRatingSum = trainerCourses.reduce((sum, course) => sum + course.averageRating, 0);
    const overallAvgRating = totalCourses > 0 ? (totalRatingSum / totalCourses).toFixed(1) : 0;
    const totalTeachingHours = trainerCourses.reduce((sum, course) => sum + (course.teachingHours || 0), 0);
    // --------------------------

    return (
        <div className="trainer-dashboard-page" style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '3rem 0' }}>
            <div className="container">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }}
                >
                    {/* Trainer Profile Section */}
                    <header className="d-flex justify-content-between align-items-center mb-5 p-4 rounded-3" style={{ background: 'linear-gradient(90deg, #1d4ed8, #2563eb)', color: 'white' }}>
                        <div>
                            <h1 className="fw-bold d-flex align-items-center"><LayoutDashboard className="me-3" size={32} />Trainer Dashboard</h1>
                            <p className="lead mb-0">Welcome back, {user.name}. Role: Expert Trainer. (Years of Exp: 5+)</p>
                        </div>
                        <button className="btn btn-light fw-bold px-4 py-2" onClick={() => setIsModalOpen(true)}>
                            <PlusCircle size={20} className="me-2" /> Create New Course
                        </button>
                    </header>

                    {/* Stats Section */}
                    <div className="row g-4 mb-5">
                        <div className="col-md-3">
                            <div className="card shadow-sm p-4 h-100">
                                <BookOpen size={32} className="text-primary mb-3" />
                                <h3 className="fw-bold"><CountUp end={totalCourses} duration={2} /></h3>
                                <p className="text-muted mb-0">Courses Created</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card shadow-sm p-4 h-100">
                                <UserCheck size={32} className="text-success mb-3" />
                                <h3 className="fw-bold"><CountUp end={totalEnrollments} duration={2} /></h3>
                                <p className="text-muted mb-0">Total Enrollments</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card shadow-sm p-4 h-100">
                                <Star size={32} className="text-warning mb-3" fill="currentColor" />
                                <h3 className="fw-bold"><CountUp end={overallAvgRating} decimals={1} duration={2} /></h3>
                                <p className="text-muted mb-0">Average Course Rating</p>
                            </div>
                        </div>
                         <div className="col-md-3">
                            <div className="card shadow-sm p-4 h-100">
                                <DollarSign size={32} className="text-info mb-3" />
                                <h3 className="fw-bold"><CountUp end={totalTeachingHours} duration={2} /></h3>
                                <p className="text-muted mb-0">Total Teaching Hours</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Analytics Section (Placeholder for Charts) */}
                    <h2 className="fw-bold mb-4">Course Analytics</h2>
                    <div className="card shadow-sm p-4 mb-5">
                        <h4 className="fw-semibold">Enrollment Growth Analysis (Visualization Placeholder)</h4>
                        <p className="text-muted">A dynamic line chart showing enrollment growth over the last 6 months would typically be implemented here using libraries like Chart.js.</p>
                        <div className="d-flex align-items-center justify-content-center bg-light p-3 rounded-2">
                           <TrendingUp size={36} className="text-success me-3" />
                           <p className="mb-0 fs-5 fw-bold text-success">Enrollment is up 15% this month! (Mock Data)</p>
                        </div>
                    </div>


                    {/* Courses Section */}
                    <h2 className="fw-bold mb-4">My Published Courses ({totalCourses})</h2>
                    {trainerStatus === 'loading' ? (
                        <div className="text-center py-5"><Loader /></div>
                    ) : trainerCourses.length === 0 ? (
                        <div className="card shadow-sm p-4 text-center">
                            <p className="lead text-muted mb-0">You have not published any courses yet.</p>
                            <p>Click "Create New Course" to get started.</p>
                        </div>
                    ) : (
                         <div className="row g-4">
                            {trainerCourses.map((course) => (
                                <div className="col-lg-4 col-md-6" key={course.id}>
                                    <TrainerCourseCard course={course} />
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
            
            {/* Modal for Creating Course */}
            <CreateCourseModal 
                isOpen={isModalOpen} 
                onClose={() => { 
                    setIsModalOpen(false); 
                    // Refetch courses to update the list immediately after modal closes
                    if (user) {
                        dispatch(fetchTrainerCourses()); 
                    }
                }} 
            />
        </div>
    );
};

export default TrainerDashboard;