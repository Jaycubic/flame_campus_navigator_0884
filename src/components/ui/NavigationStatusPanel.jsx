import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NavigationStatusPanel = ({ 
  isNavigating = false, 
  destination = null, 
  distance = null, 
  estimatedTime = null, 
  currentStep = null,
  onStopNavigation,
  onTogglePanel 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isNavigating && distance) {
      // Calculate progress based on distance (mock calculation)
      const totalDistance = 1000; // meters
      const currentProgress = Math.max(0, Math.min(100, ((totalDistance - distance) / totalDistance) * 100));
      setProgress(currentProgress);
    }
  }, [distance, isNavigating]);

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
    onTogglePanel?.(!isExpanded);
  };

  const handleStopNavigation = () => {
    onStopNavigation?.();
  };

  const formatDistance = (dist) => {
    if (!dist) return '--';
    if (dist < 1000) {
      return `${Math.round(dist)}m`;
    }
    return `${(dist / 1000).toFixed(1)}km`;
  };

  const formatTime = (time) => {
    if (!time) return '--';
    if (time < 60) {
      return `${Math.round(time)}s`;
    }
    return `${Math.round(time / 60)}min`;
  };

  if (!isNavigating) {
    return null;
  }

  return (
    <div className={`navigation-panel ${isExpanded ? 'navigation-panel-expanded' : 'navigation-panel-collapsed'}`}>
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button
          onClick={togglePanel}
          className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
        >
          <Icon 
            name={isExpanded ? "ChevronDown" : "ChevronUp"} 
            size={20} 
            className="transition-transform duration-200"
          />
          <span className="font-medium">Navigation Active</span>
        </button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStopNavigation}
          className="text-error hover:text-error hover:bg-error/10"
        >
          <Icon name="X" size={16} className="mr-1" />
          Stop
        </Button>
      </div>

      {/* Panel Content */}
      {isExpanded && (
        <div className="p-4 space-y-4 animate-slide-up">
          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Destination Info */}
          {destination && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Icon name="MapPin" size={20} color="white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{destination.name}</h3>
                <p className="text-sm text-muted-foreground">{destination.address}</p>
              </div>
            </div>
          )}

          {/* Distance and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-foreground font-mono">
                {formatDistance(distance)}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Distance
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-foreground font-mono">
                {formatTime(estimatedTime)}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                ETA
              </div>
            </div>
          </div>

          {/* Current Step */}
          {currentStep && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name={currentStep.icon || "ArrowRight"} size={16} color="white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {currentStep.instruction}
                  </p>
                  {currentStep.distance && (
                    <p className="text-xs text-muted-foreground mt-1">
                      in {formatDistance(currentStep.distance)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                // Toggle voice guidance
                console.log('Toggle voice guidance');
              }}
            >
              <Icon name="Volume2" size={16} className="mr-2" />
              Voice
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                // Show route overview
                console.log('Show route overview');
              }}
            >
              <Icon name="Route" size={16} className="mr-2" />
              Overview
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                // Share location
                console.log('Share location');
              }}
            >
              <Icon name="Share" size={16} className="mr-2" />
              Share
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationStatusPanel;