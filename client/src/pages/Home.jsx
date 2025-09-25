// client/src/pages/HomePage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import CourseCard from '../components/CourseCard';
import './HomePage.css';

// --- Data for the page ---

const featuredCourses = [
    { id: 1, title: 'Modern React with Hooks', trainer: 'Anjali Sharma', price: '₹499', image: 'https://images.unsplash.com/photo-1579403124614-197f69d8187b?q=80&w=1740&auto=format&fit=crop' },
    { id: 2, title: 'Advanced Node.js and Express', trainer: 'Vikram Singh', price: '₹799', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1740&auto=format&fit=crop' },
    { id: 3, title: 'UI/UX Design Fundamentals', trainer: 'Riya Mehta', price: '₹399', image: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=1742&auto=format&fit=crop' },
    { id: 4, title: 'Data Science with Python', trainer: 'Arjun Desai', price: '₹999', image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1740&auto=format&fit=crop' },
];

const testimonials = [
    { id: 1, name: 'Priya Sharma', role: 'Software Engineer', quote: 'SkillBridge has completely transformed my career. The courses are practical and the instructors are top-notch.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500' },
    { id: 2, name: 'Rahul Verma', role: 'Aspiring Developer', quote: "I went from a complete beginner to getting my first developer job in 6 months. I couldn't have done it without SkillBridge.", image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500' },
    { id: 3, name: 'Sneha Patel', role: 'Product Designer', quote: "The UI/UX course was phenomenal. It gave me the confidence and the portfolio I needed to land my dream job.", image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500' },
];

const HomePage = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start">
              <motion.h1 className="display-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                Bridge Your Skills to Success
              </motion.h1>
              <motion.p className="lead fs-5 my-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
                Learn from top trainers and grow your career with in-demand skills.
              </motion.p>
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
                <a href="/courses" className="btn btn-primary-custom me-2">Explore Courses</a>
                <a href="/become-trainer" className="btn btn-secondary-custom">Become a Trainer</a>
              </motion.div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
               <img src="https://plus.unsplash.com/premium_vector-1711987474646-9491260b0395?q=80&w=970&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Learning Illustration" className="hero-illustration img-fluid"/>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="search-bar-section">
          <div className="container">
              <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <input type="text" className="form-control search-input" placeholder="Search for courses or skills..." />
                  </div>
              </div>
          </div>
      </section>

      {/* Featured Courses */}
      <section className="py-5" style={{backgroundColor: '#F9FAFB'}}>
          <div className="container">
              <h2 className="text-center fw-bold mb-5">Featured Courses</h2>
              <div className="row g-4">
                  {featuredCourses.map(course => (
                      <div className="col-lg-3 col-md-6" key={course.id}>
                          <CourseCard course={course} />
                      </div>
                  ))}
              </div>
          </div>
      </section>
      
      {/* Testimonials */}
       <section className="testimonials-section py-5">
            <div className="container">
                <h2 className="text-center fw-bold mb-5">Trusted by Learners Worldwide</h2>
                <div className="row g-4">
                  {testimonials.map((testimonial, index) => (
                    <motion.div 
                      className="col-lg-4" 
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      viewport={{ once: true }}
                    >
                      <div className="card testimonial-card h-100">
                        <div className="card-body text-center">
                          <img src={testimonial.image} alt={testimonial.name} className="testimonial-img mb-3"/>
                          <p className="text-muted fst-italic">"{testimonial.quote}"</p>
                          <h5 className="mt-4 mb-0">{testimonial.name}</h5>
                          <small>{testimonial.role}</small>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
            </div>
       </section>

    </motion.div>
  );
};

export default HomePage;