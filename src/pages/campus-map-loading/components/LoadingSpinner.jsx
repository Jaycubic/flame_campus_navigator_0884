import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 48, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-secondary rounded-full"
        style={{ width: size, height: size }}
        animate={{ rotate: -360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default LoadingSpinner;