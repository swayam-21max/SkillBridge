// client/src/pages/SignupPage.jsx
import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, verifyOtp, resetSignupState } from '../redux/authSlice'; // Corrected Path & new actions
import FormInput from '../components/FormInput';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'; 
import Loader from '../components/Loader';
import './SignupPage.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'learner',
  });
  const [otp, setOtp] = useState(''); // New state for OTP
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Destructure new state properties
  const { isLoading, error: apiError, user, signupStatus, otpEmail } = useSelector((state) => state.auth);

  // Clear signup status on unmount to reset form
  useEffect(() => {
    return () => {
      dispatch(resetSignupState());
    };
  }, [dispatch]);

  // Redirect learner immediately
  useEffect(() => {
    if (user && user.role === 'learner') {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  useEffect(() => {
    const formErrors = validateForm();
    const allFieldsFilled = formData.fullName && formData.email && formData.password && formData.confirmPassword;
    setIsFormValid(Object.keys(formErrors).length === 0 && allFieldsFilled);
  }, [formData]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (signupStatus === 'otp_pending') {
        // --- OTP SUBMISSION ---
        if (!otp || otp.length !== 6) {
            setErrors({ otp: 'OTP must be 6 digits' });
            return;
        }
        
        const resultAction = await dispatch(verifyOtp({ email: otpEmail, otp }));
        if (verifyOtp.fulfilled.match(resultAction)) {
          alert('Trainer Verification successful! Redirecting to your dashboard.');
          navigate('/trainer/dashboard'); // Redirect to new trainer dashboard
        }
        return;
    }

    // --- INITIAL SIGNUP SUBMISSION ---
    if (!isFormValid) { 
      setErrors(validateForm());
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
        if (userData.role === 'learner') {
            alert('Learner Signup successful! Welcome.');
            navigate('/profile');
        } 
        // Trainer flow handles itself by moving to OTP state
    }
  };
  
  // --- Conditional Render: OTP Verification Form ---
  if (signupStatus === 'otp_pending') {
    return (
        <motion.div
            className="signup-page-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="card signup-card shadow-lg p-5">
                <h2 className="text-center fw-bold mb-4">Verify Your Account</h2>
                {apiError && <div className="alert alert-danger">{apiError}</div>}
                <div className="alert alert-info text-center">
                    A verification code has been sent to **{otpEmail}** (Check console for mock OTP).
                    Please enter it below to complete your Trainer registration.
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <FormInput
                        label="Verification Code (OTP)" type="text" name="otp"
                        value={otp} onChange={handleOtpChange} error={errors.otp}
                    />
                    <motion.button
                        type="submit"
                        className="btn btn-primary-custom w-100 py-2 fs-5 mt-3"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading || otp.length !== 6}
                    >
                        {isLoading ? <Loader /> : 'Verify & Complete'}
                    </motion.button>
                </form>
                <p className="text-center text-muted mt-3">
                  Did not receive the code? <Link onClick={() => { /* Implement Resend Logic Here */ }}>Resend OTP</Link>
                </p>
            </div>
        </motion.div>
    );
  }


  // --- Default Render: Signup Form ---
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

                <div className="text-center text-muted small mb-3">
                  By creating an account, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
                </div>

                <motion.button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-2 fs-5"
                  whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                  whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                  disabled={!isFormValid || isLoading} 
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </motion.button>
              </form>
              
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