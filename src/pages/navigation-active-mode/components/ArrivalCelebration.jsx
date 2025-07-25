import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ArrivalCelebration = ({ 
  isVisible = false,
  destination,
  onContinue,
  onNavigateAgain,
  onClose
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      // Auto-hide confetti after animation
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const confettiColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  const generateConfetti = () => {
    return Array.from({ length: 20 }, (_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full"
        style={{ 
          backgroundColor: confettiColors[i % confettiColors.length],
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 20}%`
        }}
        initial={{ 
          y: -100, 
          x: 0, 
          rotate: 0,
          opacity: 1,
          scale: 1
        }}
        animate={{ 
          y: window.innerHeight + 100,
          x: (Math.random() - 0.5) * 200,
          rotate: Math.random() * 720,
          opacity: 0,
          scale: 0
        }}
        transition={{ 
          duration: 3,
          delay: Math.random() * 0.5,
          ease: "easeOut"
        }}
      />
    ));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
        >
          {/* Confetti Animation */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              {generateConfetti()}
            </div>
          )}

          {/* Main Content */}
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              delay: 0.2 
            }}
            className="bg-surface rounded-2xl shadow-critical max-w-sm w-full p-6 text-center"
          >
            {/* Success Icon with Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 15,
                delay: 0.5 
              }}
              className="w-20 h-20 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Icon name="CheckCircle" size={40} color="white" />
              </motion.div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-2">
                You've Arrived! 🎉
              </h2>
              <p className="text-muted-foreground mb-1">
                Welcome to your destination
              </p>
              {destination && (
                <p className="text-lg font-medium text-primary">
                  {destination.name}
                </p>
              )}
            </motion.div>

            {/* Destination Details */}
            {destination && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-muted rounded-lg p-4 my-6"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                    <Icon name="MapPin" size={20} color="white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-foreground">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {destination.address || destination.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="space-y-3"
            >
              <Button
                variant="default"
                size="lg"
                fullWidth
                onClick={onContinue}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <Icon name="Map" size={20} className="mr-2" />
                Explore Campus
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={onNavigateAgain}
                  className="text-primary border-primary/20 hover:bg-primary/5"
                >
                  <Icon name="Navigation" size={16} className="mr-2" />
                  Navigate Again
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon name="X" size={16} className="mr-2" />
                  Close
                </Button>
              </div>
            </motion.div>

            {/* Fun Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 pt-4 border-t border-border"
            >
              <p className="text-xs text-muted-foreground">
                🚶‍♂️ Navigation completed successfully
              </p>
              <p className="text-xs text-muted-foreground">
                📍 Welcome to FLAME University campus
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ArrivalCelebration;