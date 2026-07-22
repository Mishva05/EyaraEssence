import React from 'react';

export default function Spinner({ size = 'medium', className = '' }) {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex justify-center items-center p-6 ${className}`}>
      <div 
        className={`${sizeClasses[size] || sizeClasses.medium} border-brand-rose/20 border-t-brand-rose rounded-full animate-spin`}
      />
    </div>
  );
}
