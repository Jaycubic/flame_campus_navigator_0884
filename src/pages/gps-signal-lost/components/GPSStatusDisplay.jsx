import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const GPSStatusDisplay = ({ lastKnownPosition, signalStrength, onRetry }) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      await onRetry();
    } catch (error) {
      console.error('GPS retry failed:', error);
    } finally {
      setTimeout(() => {
        setIsRetrying(false);
      }, 2000);
    }
  };

  const getSignalStrengthColor = () => {
    if (signalStrength >= 70) return 'text-success';
    if (signalStrength >= 40) return 'text-warning';
    return 'text-error';
  };

  const getSignalStrengthText = () => {
    if (signalStrength >= 70) return 'Strong';
    if (signalStrength >= 40) return 'Weak';
    return 'No Signal';
  };

  return (
    <div className="bg-surface rounded-lg p-6 space-y-4">
      {/* GPS Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
            <Icon name="WifiOff" size={24} className="text-error" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">GPS Signal Lost</h3>
            <p className="text-sm text-muted-foreground">
              Last update: {lastKnownPosition?.timestamp || 'Unknown'}
            </p>
          </div>
        </div>
        
        {/* Signal Strength Indicator */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={`w-1 h-4 rounded-full ${
                  bar <= (signalStrength / 25) 
                    ? getSignalStrengthColor() 
                    : 'bg-muted'
                }`}
                style={{ 
                  height: `${8 + (bar * 4)}px`,
                  backgroundColor: bar <= (signalStrength / 25) 
                    ? undefined 
                    : 'var(--color-muted)'
                }}
              />
            ))}
          </div>
          <span className={`text-xs font-medium ${getSignalStrengthColor()}`}>
            {getSignalStrengthText()}
          </span>
        </div>
      </div>

      {/* Last Known Position */}
      {lastKnownPosition && (
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="MapPin" size={20} className="text-primary mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-1">Last Known Position</h4>
              <p className="text-sm text-muted-foreground mb-2">
                {lastKnownPosition.location}
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Accuracy:</span>
                  <span className="ml-1 font-medium text-foreground">
                    ±{lastKnownPosition.accuracy}m
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Coordinates:</span>
                  <span className="ml-1 font-mono text-foreground">
                    {lastKnownPosition.lat}, {lastKnownPosition.lng}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Retry Information */}
      {retryCount > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Icon name="RotateCcw" size={16} className="text-warning" />
            <span className="text-sm text-warning">
              Retry attempt {retryCount} - Searching for GPS signal...
            </span>
          </div>
        </div>
      )}

      {/* Retry Button */}
      <button
        onClick={handleRetry}
        disabled={isRetrying}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
          isRetrying
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          {isRetrying ? (
            <>
              <Icon name="Loader2" size={20} className="animate-spin" />
              <span>Searching for GPS...</span>
            </>
          ) : (
            <>
              <Icon name="RefreshCw" size={20} />
              <span>Retry GPS Connection</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};

export default GPSStatusDisplay;