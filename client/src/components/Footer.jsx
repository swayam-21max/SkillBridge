// client/src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">SkillBridge</h5>
            <p>Bridge your skills to success.</p>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">Connect</h5>
            {/* Replace with your actual social media links */}
            <div>
              <a href="https://github.com/swayam-21max" className="me-3">LinkedIn</a>
              <a href="#" className="me-3">GitHub</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <small>&copy; {new Date().getFullYear()} SkillBridge. All Rights Reserved.</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;