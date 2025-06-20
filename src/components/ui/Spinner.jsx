// src/components/ui/Spinner.jsx
import React from 'react';

const Spinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  return (
    <div className={`animate-spin rounded-full ${sizes[size]} border-b-2 border-blue-500`} />
  );
};

export default Spinner;