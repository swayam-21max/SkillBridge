// client/src/components/FormInput.jsx
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // A popular icon library, let's add it!

const FormInput = ({ label, type, name, value, onChange, error }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const isPasswordField = type === 'password';

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label fw-semibold">{label}</label>
      <div className="input-group">
        <input
          type={isPasswordField ? (isPasswordVisible ? 'text' : 'password') : type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`form-control ${error ? 'is-invalid' : ''}`}
        />
        {isPasswordField && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={togglePasswordVisibility}
          >
            {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
};

export default FormInput;