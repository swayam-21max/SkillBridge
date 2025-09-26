// client/src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
// THE FIX IS ON THIS LINE 👇
import { loginUser } from '../redux/authSlice'; 
import FormInput from '../components/FormInput';
import './LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isFormValid, setIsFormValid] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error: apiError, user } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  useEffect(() => {
    const isEmailValid = formData.email && /\S+@\S+\.\S+/.test(formData.email);
    const isPasswordValid = formData.password;
    setIsFormValid(isEmailValid && isPasswordValid);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const resultAction = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(resultAction)) {
      navigate('/profile');
    }
  };

  return (
    <motion.div
      className="login-page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="card login-card">
        <div className="row g-0">
          <div className="col-lg-6">
            <div className="login-form-section">
              <h2 className="text-center fw-bold mb-2">Welcome Back!</h2>
              <p className="text-center text-muted mb-4">Log in to continue your learning journey.</p>
              
              {apiError && <div className="alert alert-danger">{apiError}</div>}
              
              <form onSubmit={handleSubmit} noValidate>
                <FormInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <FormInput
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="d-flex justify-content-end mb-3">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>
                <motion.button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-2 fs-5"
                  whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                  whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? 'Logging In...' : 'Log In'}
                </motion.button>
              </form>
              <p className="text-center text-muted mt-4">
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </div>
          </div>
          <div className="col-lg-6 d-none d-lg-block login-illustration-section">
            <img 
              src="https://cdni.iconscout.com/illustration/premium/thumb/login-3305943-2757111.png" 
              alt="Login Illustration" 
              className="login-illustration" 
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;