import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const VoiceAnnouncementToast = ({ 
  message = '',
  isVisible = false,
  type = 'instruction', // 'instruction', 'arrival', 'warning'
  onDismiss,
  autoHide = true,
  duration = 4000
}) => {
  const [isShowing, setIsShowing] = useState(isVisible);

  useEffect(() => {
    setIsShowing(isVisible);
    
    if (isVisible && autoHide) {
      const timer = setTimeout(() => {
        setIsShowing(false);
        onDismiss?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, duration, onDismiss]);

  const getToastConfig = () => {
    switch (type) {
      case 'arrival':
        return {
          icon: 'CheckCircle',
          iconColor: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          textColor: 'text-success'
        };
      case 'warning':
        return {
          icon: 'AlertTriangle',
          iconColor: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          textColor: 'text-warning'
        };
      case 'instruction':
      default:
        return {
          icon: 'Volume2',
          iconColor: 'text-primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          textColor: 'text-primary'
        };
    }
  };

  const config = getToastConfig();

  const handleDismiss = () => {
    setIsShowing(false);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {isShowing && message && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            duration: 0.3 
          }}
          className="fixed top-20 left-4 right-4 z-50 mx-auto max-w-sm"
        >
          <div className={`
            ${config.bgColor} ${config.borderColor} 
            backdrop-blur-medium border rounded-lg shadow-modal p-4
          `}>
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <Icon 
                  name={config.icon} 
                  size={20} 
                  className={config.iconColor}
                />
              </div>
              
              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${config.textColor} leading-relaxed`}>
                  {message}
                </p>
              </div>
              
              {/* Dismiss Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleDismiss}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="X" size={16} />
              </motion.button>
            </div>
            
            {/* Progress Bar for Auto-hide */}
            {autoHide && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-b-lg overflow-hidden"
              >
                <motion.div
                  className={`h-full ${config.textColor.replace('text-', 'bg-')}`}
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: duration / 1000, ease: "linear" }}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceAnnouncementToast;