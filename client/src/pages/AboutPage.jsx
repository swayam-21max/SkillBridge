// client/src/pages/AboutPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { BookOpen, Zap, HeartHandshake, Gem } from 'lucide-react';
import TestimonialSlider from '../components/TestimonialSlider';
import FAQ from '../components/FAQ';
import './AboutPage.css';
import swayamProfileImage from '../assets/Swayam Pro.png'; // Your image import

// Reusable component for sections to reduce repetition
const AnimatedSection = ({ children, className }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.section
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.section>
  );
};

const AboutPage = () => {
  // --- Data for the page ---
  const teamMembers = [
    { name: 'Swayam Kataria', role: 'Founder & CEO', image: swayamProfileImage },
    { name: 'Diya Mehta', role: 'Chief Technology Officer', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1740&auto=format&fit=crop' },
    { name: 'Rohan Desai', role: 'Head of Learning', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop' },
    { name: 'Priya Patel', role: 'Community Manager', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop' },
  ];
  const testimonials = [
    { id: 1, name: 'Priya Sharma', quote: 'SkillBridge has completely transformed my career.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500' },
    { id: 2, name: 'Rahul Verma', quote: "I went from a complete beginner to getting my first developer job in 6 months.", image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500' },
    { id: 3, name: 'Sneha Patel', quote: "The UI/UX course was phenomenal and helped me land my dream job.", image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500' },
  ];
  const faqData = [
    { id: 1, question: 'Is SkillBridge suitable for complete beginners?', answer: 'Absolutely! Many of our courses are designed specifically for beginners with no prior experience. Each course page specifies the required skill level.' },
    { id: 2, question: 'Can I get a refund if I am not satisfied?', answer: 'Yes, we offer a 30-day money-back guarantee on all our courses. Your satisfaction is our priority.' },
    { id: 3, question: 'Can I become a trainer on SkillBridge?', answer: 'We are always looking for passionate experts to join our platform. Please visit the "Become a Trainer" section to learn more about the application process.' },
  ];

  return (
    <div className="about-page">
      {/* 1. Hero Section */}
      <section className="about-hero text-center">
        <div className="container">
          <motion.h1 
            className="display-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Empowering Learners. Connecting Educators. Bridging Skills to Opportunities.
          </motion.h1>
          <motion.p 
            className="lead text-muted my-4 mx-auto" style={{ maxWidth: '700px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            SkillBridge is a dynamic platform designed to bring learners and trainers together, making skill development accessible, engaging, and personalized for everyone.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/courses" className="btn btn-primary-custom me-2">Start Learning</Link>
            <Link to="/signup" className="btn btn-secondary-custom">Become a Trainer</Link>
          </motion.div>
        </div>
      </section>

      {/* 2. Our Mission */}
      <AnimatedSection className="mission-section">
        <div className="container">
          <div className="row align-items/center">
            <div className="col-lg-6">
              <h2 className="fw-bold mb-4">Why SkillBridge Exists</h2>
              <p className="text-muted">Our mission is to make quality education accessible to everyone, everywhere, closing the gap between learning and real-world application. We help trainers share their expertise globally and empower learners to achieve their career goals.</p>
              <p className="mission-quote mt-4">We believe skills are the true currency of the future.</p>
            </div>
            <div className="col-lg-6 text-center">
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/mission-and-vision-8067424-6423945.png" alt="Mission Illustration" className="img-fluid"/>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* 3. Our Story (Timeline) */}
      <AnimatedSection className="journey-section">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Our Journey So Far</h2>
          <div className="timeline">
            <div className="timeline-container left">
              <div className="timeline-content">
                <h5 className="fw-bold">2023: The Idea</h5>
                <p className="text-muted">SkillBridge was born from a simple idea: to connect passionate local trainers with eager learners in our community.</p>
              </div>
            </div>
            <div className="timeline-container right">
              <div className="timeline-content">
                <h5 className="fw-bold">2024: Beta Launch</h5>
                <p className="text-muted">We launched our beta platform with 100 foundational courses, quickly growing to over 1,000 active learners.</p>
              </div>
            </div>
            <div className="timeline-container left">
              <div className="timeline-content">
                <h5 className="fw-bold">2025: Global Expansion</h5>
                <p className="text-muted">Breaking geographical barriers, we expanded worldwide, welcoming over 50,000 users and 2,000 trainers.</p>
              </div>
            </div>
             <div className="timeline-container right">
              <div className="timeline-content">
                <h5 className="fw-bold">The Future: AI-Powered Learning</h5>
                <p className="text-muted">Our next chapter involves leveraging AI to create truly personalized learning paths and experiences for everyone.</p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
      
      {/* 4. Our Impact (Stats) */}
      <AnimatedSection className="impact-section text-center">
        <div className="container">
          <h2 className="fw-bold mb-5">Growing Together, Growing Stronger</h2>
          <div className="row">
            <div className="col-md-3"><h3 className="stat-number"><CountUp end={50000} duration={3} suffix="+" /></h3><p>Learners Connected</p></div>
            <div className="col-md-3"><h3 className="stat-number"><CountUp end={10000} duration={3} suffix="+" /></h3><p>Courses Completed</p></div>
            <div className="col-md-3"><h3 className="stat-number"><CountUp end={2000} duration={3} suffix="+" /></h3><p>Trainers Worldwide</p></div>
            <div className="col-md-3"><h3 className="stat-number"><CountUp end={100} duration={3} suffix="+" /></h3><p>Corporate Partners</p></div>
          </div>
        </div>
      </AnimatedSection>

      {/* 5. Core Values */}
      <AnimatedSection className="values-section text-center">
        <div className="container">
          <h2 className="fw-bold mb-5">What We Stand For</h2>
          <div className="row g-4">
            <div className="col-md-3"><div className="value-card h-100"><BookOpen size={48} className="value-icon mb-3"/><h5 className="fw-bold">Accessibility</h5><p className="text-muted">Learning without barriers for everyone.</p></div></div>
            <div className="col-md-3"><div className="value-card h-100"><Zap size={48} className="value-icon mb-3"/><h5 className="fw-bold">Innovation</h5><p className="text-muted">Future-ready education with cutting-edge tools.</p></div></div>
            <div className="col-md-3"><div className="value-card h-100"><HeartHandshake size={48} className="value-icon mb-3"/><h5 className="fw-bold">Community</h5><p className="text-muted">Building strong learner-trainer connections.</p></div></div>
            <div className="col-md-3"><div className="value-card h-100"><Gem size={48} className="value-icon mb-3"/><h5 className="fw-bold">Excellence</h5><p className="text-muted">Delivering high-quality courses and experiences.</p></div></div>
          </div>
        </div>
      </AnimatedSection>
      
      {/* 6. Meet the Team */}
      <AnimatedSection className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-5">The People Behind SkillBridge</h2>
          <div className="row g-4 justify-content-center">
            {teamMembers.map((member) => (
              <div key={member.name} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm">
                  <img src={member.image} alt={member.name} className="card-img-top" style={{ height: '250px', objectFit: 'cover' }} />
                  <div className="card-body">
                    <h5 className="fw-bold">{member.name}</h5>
                    <p className="text-muted">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* 7. Testimonials Slider Section */}
      <AnimatedSection className="testimonials-slider-section">
        <div className="container text-center">
          <h2 className="fw-bold mb-5">Loved by Learners and Trainers</h2>
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </AnimatedSection>

      {/* 8. FAQ Section */}
      <AnimatedSection className="faq-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="text-center fw-bold mb-5">Frequently Asked Questions</h2>
              <FAQ faqData={faqData} />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* 9. Join Our Team (Careers) Section */}
      <AnimatedSection>
        <div className="container my-5">
          <div className="careers-section text-center p-5">
            <h2 className="fw-bold">Join Our Team</h2>
            <p className="my-3">We're always looking for talented individuals to help us build the future of education. <br/> If you're passionate about learning and technology, we'd love to hear from you.</p>
            <Link to="/careers" className="btn btn-light fw-bold">View Open Positions</Link>
          </div>
        </div>
      </AnimatedSection>

      {/* 10. Final CTA */}
      <AnimatedSection className="cta-section text-center">
        <div className="container">
          <h2 className="fw-bold">Your Journey Starts Here</h2>
          <p className="text-muted my-3">Whether you're here to learn or teach, SkillBridge is your gateway to growth.</p>
          <Link to="/signup" className="btn btn-primary-custom">Join Our Community</Link>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default AboutPage;