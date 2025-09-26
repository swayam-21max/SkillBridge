import React from 'react';

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (password) => {
    let score = 0;
    if (password.length > 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = ['Weak', 'Weak', 'Medium', 'Good', 'Strong', 'Very Strong'];
  const color = ['#dc3545', '#dc3545', '#ffc107', '#28a745', '#28a745', '#28a745'][strength];

  const meterStyle = {
    width: `${(strength / 5) * 100}%`,
    backgroundColor: color,
    height: '8px',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  };

  return (
    <div className="mt-2 mb-3"> {/* Added margin-bottom */}
      <div className="progress" style={{ height: '8px' }}>
        <div style={meterStyle}></div>
      </div>
      <small style={{ color: color }}>
        {password.length > 0 && `Strength: ${strengthLabels[strength]}`}
      </small>
    </div>
  );
};

export default PasswordStrengthMeter;