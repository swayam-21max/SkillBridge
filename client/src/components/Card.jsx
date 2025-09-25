// client/src/components/Card.jsx
import React from 'react';

const Card = ({ children, className }) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;