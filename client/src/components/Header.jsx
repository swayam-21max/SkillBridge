// client/src/components/Header.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg py-3">
        <div className="container">
          <NavLink className="navbar-brand fs-4" to="/">SkillBridge</NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item"><NavLink className="nav-link mx-2" to="/">Home</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link mx-2" to="/courses">Courses</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link mx-2" to="/skills">Skills</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link mx-2" to="/about">About</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link mx-2" to="/contact">Contact</NavLink></li>
              <li className="nav-item ms-lg-3">
                <NavLink to="/login" className="btn btn-secondary-custom me-2">Login</NavLink>
                <NavLink to="/signup" className="btn btn-primary-custom">Sign Up</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;