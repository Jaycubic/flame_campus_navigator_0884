import React from 'react';
import { motion } from 'framer-motion';

const ProgressIndicator = ({ progress = 0, className = '' }) => {
  return (
    <div className={`w-full max-w-sm ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">Loading Progress</span>
        <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;