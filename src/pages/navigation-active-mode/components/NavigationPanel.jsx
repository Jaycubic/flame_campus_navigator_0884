import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NavigationPanel = ({ 
  destination,
  distance = 0,
  estimatedTime = 0,
  currentStep,
  isNavigating = true,
  onCancelNavigation,
  onToggleVoice,
  voiceEnabled = true
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (distance && destination?.totalDistance) {
      const progressPercent = Math.max(0, Math.min(100, 
        ((destination.totalDistance - distance) / destination.totalDistance) * 100
      ));
      setProgress(progressPercent);
    }
  }, [distance, destination]);

  const formatDistance = (dist) => {
    if (dist < 1000) {
      return `${Math.round(dist)}m`;
    }
    return `${(dist / 1000).toFixed(1)}km`;
  };

  const formatTime = (time) => {
    if (time < 60) {
      return `${Math.round(time)}s`;
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.round(time % 60);
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  };

  const getStepIcon = (instruction) => {
    if (instruction?.includes('left')) return 'ArrowLeft';
    if (instruction?.includes('right')) return 'ArrowRight';
    if (instruction?.includes('straight')) return 'ArrowUp';
    if (instruction?.includes('arrive')) return 'MapPin';
    return 'ArrowUp';
  };

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isNavigating) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border shadow-critical safe-bottom"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={togglePanel}
          className="flex items-center space-x-2 text-foreground"
        >
          <Icon 
            name={isExpanded ? "ChevronDown" : "ChevronUp"} 
            size={20} 
            className="transition-transform duration-200"
          />
          <span className="font-medium">Navigation Active</span>
        </motion.button>
        
        <div className="flex items-center space-x-2">
          {/* Voice Toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onToggleVoice}
            className={`p-2 rounded-full transition-colors ${
              voiceEnabled 
                ? 'bg-primary/10 text-primary' :'bg-muted text-muted-foreground'
            }`}
          >
            <Icon name={voiceEnabled ? "Volume2" : "VolumeX"} size={16} />
          </motion.button>
          
          {/* Cancel Navigation */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelNavigation}
            className="text-error hover:text-error hover:bg-error/10"
          >
            <Icon name="X" size={16} className="mr-1" />
            Cancel
          </Button>
        </div>
      </div>

      {/* Panel Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div 
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>

              {/* Destination Info */}
              {destination && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="MapPin" size={20} color="white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {destination.address || destination.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Distance and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-foreground font-mono">
                    {formatDistance(distance)}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Remaining
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-foreground font-mono">
                    {formatTime(estimatedTime)}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    ETA
                  </div>
                </div>
              </div>

              {/* Current Step */}
              {currentStep && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-primary/5 border border-primary/20 rounded-lg p-4"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon 
                        name={getStepIcon(currentStep.instruction)} 
                        size={20} 
                        color="white" 
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground leading-relaxed">
                        {currentStep.instruction}
                      </p>
                      {currentStep.distance && (
                        <p className="text-xs text-muted-foreground mt-1">
                          in {formatDistance(currentStep.distance)}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Large Cancel Button for Easy Access */}
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={onCancelNavigation}
                className="mt-4 border-error/20 text-error hover:bg-error/5 hover:border-error/30"
              >
                <Icon name="Square" size={20} className="mr-2" />
                Stop Navigation
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NavigationPanel;