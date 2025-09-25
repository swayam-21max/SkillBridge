// client/src/components/Button.jsx
import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};

export default Button;