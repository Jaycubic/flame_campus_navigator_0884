import React from 'react';
import { motion } from 'framer-motion';

const UniversityLogo = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex flex-col items-center ${className}`}
    >
      {/* FLAME University Logo */}
      <motion.div
        className="w-24 h-24 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-lg mb-4"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-white font-bold text-2xl tracking-wider">
          FLAME
        </div>
      </motion.div>
      
      {/* University Name */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          FLAME University
        </h1>
        <p className="text-sm text-muted-foreground">
          Campus Navigator
        </p>
      </div>
    </motion.div>
  );
};

export default UniversityLogo;