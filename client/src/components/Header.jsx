// client/src/components/Header.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice'; // Import the logout action

const Header = () => {
  // --- ADDITION 1: Get user state and Redux/navigation hooks ---
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- ADDITION 2: Handle the logout action ---
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

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
              
              {/* --- ADDITION 3: Conditional rendering based on user state --- */}
              {user ? (
                // If user is logged in, show Profile and Logout
                <>
                  <li className="nav-item"><NavLink className="nav-link mx-2" to="/profile">Profile</NavLink></li>
                  <li className="nav-item ms-lg-3">
                    <button onClick={handleLogout} className="btn btn-secondary-custom">Logout</button>
                  </li>
                </>
              ) : (
                // If user is logged out, show Login and Sign Up
                <li className="nav-item ms-lg-3">
                  <NavLink to="/login" className="btn btn-secondary-custom me-2">Login</NavLink>
                  <NavLink to="/signup" className="btn btn-primary-custom">Sign Up</NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;