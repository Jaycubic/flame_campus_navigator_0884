import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const LoadingMessage = ({ message, icon, className = '' }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`flex items-center justify-center space-x-3 ${className}`}
      >
        {icon && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon name={icon} size={24} className="text-primary" />
          </motion.div>
        )}
        <span className="text-lg font-medium text-foreground text-center">
          {message}
        </span>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingMessage;