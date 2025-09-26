// client/src/pages/SignupPage.jsx
import React, { useState, useEffect } from 'react'; // ADDITION: useEffect
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../redux/authSlice'; // Corrected Path
import FormInput from '../components/FormInput';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'; // ADDITION: Import Meter
import './SignupPage.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'learner',
  });
  const [errors, setErrors] = useState({});
  
  // --- ADDITION 1: State for real-time form validation ---
  const [isFormValid, setIsFormValid] = useState(false);

  // --- Redux & Navigation Hooks (Your code is correct) ---
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error: apiError } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  // --- ADDITION 2: useEffect to validate form on every change ---
  useEffect(() => {
    const formErrors = validateForm();
    const allFieldsFilled = formData.fullName && formData.email && formData.password && formData.confirmPassword;
    setIsFormValid(Object.keys(formErrors).length === 0 && allFieldsFilled);
  }, [formData]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) { // Use the state to check validity
      setErrors(validateForm()); // Show errors if trying to submit an invalid form
      return;
    }
    
    setErrors({});
    const userData = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };
    
    const resultAction = await dispatch(signupUser(userData));
    
    if (signupUser.fulfilled.match(resultAction)) {
      alert('Signup successful! Please log in.');
      navigate('/login');
    }
  };

  return (
    <motion.div
      className="signup-page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="card signup-card">
        <div className="row g-0">
          <div className="col-lg-6">
            <div className="signup-form-section">
              <h2 className="text-center fw-bold mb-4">Create Your Account</h2>
              
              {apiError && <div className="alert alert-danger">{apiError}</div>}

              <form onSubmit={handleSubmit} noValidate>
                <FormInput
                  label="Full Name" type="text" name="fullName"
                  value={formData.fullName} onChange={handleChange} error={errors.fullName}
                />
                <FormInput
                  label="Email Address" type="email" name="email"
                  value={formData.email} onChange={handleChange} error={errors.email}
                />
                <FormInput
                  label="Password" type="password" name="password"
                  value={formData.password} onChange={handleChange} error={errors.password}
                />
                
                {/* --- ADDITION 3: Password Strength Meter --- */}
                <PasswordStrengthMeter password={formData.password} />

                <FormInput
                  label="Confirm Password" type="password" name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword}
                />

                <div className="mb-3">
                  <label className="form-label fw-semibold">I am a...</label>
                  <div className="row role-selector">
                    <div className="col-6">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="role" id="learner" value="learner" checked={formData.role === 'learner'} onChange={handleChange} />
                        <label className="form-check-label" htmlFor="learner">Learner</label>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-check">
                        <input className="form-check-input" type="radio" name="role" id="trainer" value="trainer" checked={formData.role === 'trainer'} onChange={handleChange} />
                        <label className="form-check-label" htmlFor="trainer">Trainer</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- ADDITION 4: Terms of Service & Privacy Policy --- */}
                <div className="text-center text-muted small mb-3">
                  By creating an account, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
                </div>

                <motion.button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-2 fs-5"
                  whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                  whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                  disabled={!isFormValid || isLoading} // MODIFICATION: Button is now disabled based on real-time validation
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </motion.button>
              </form>
              
              {/* --- ADDITION 5: Social Logins --- */}
              <div className="social-login-divider">OR</div>
              <button className="btn btn-outline-secondary btn-social">
                Sign Up with Google
              </button>
              
              <p className="text-center text-muted mt-3">
                Already have an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
          <div className="col-lg-6 d-none d-lg-block signup-illustration-section">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/user-login-4268415-3551762.png" alt="Signup Illustration" className="signup-illustration"/>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SignupPage;