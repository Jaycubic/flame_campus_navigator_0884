import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const GPSStatusIndicator = () => {
  const [gpsStatus, setGpsStatus] = useState('searching'); // 'accurate', 'searching', 'lost'
  const [accuracy, setAccuracy] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let watchId;
    
    const handleSuccess = (position) => {
      const acc = position.coords.accuracy;
      setAccuracy(acc);
      
      if (acc <= 10) {
        setGpsStatus('accurate');
      } else if (acc <= 50) {
        setGpsStatus('searching');
      } else {
        setGpsStatus('lost');
      }
    };

    const handleError = (error) => {
      console.error('GPS Error:', error);
      setGpsStatus('lost');
      setAccuracy(null);
    };

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000
        }
      );
    } else {
      setGpsStatus('lost');
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const getStatusConfig = () => {
    switch (gpsStatus) {
      case 'accurate':
        return {
          icon: 'MapPin',
          color: 'text-success',
          bgColor: 'bg-success/10',
          text: 'GPS Active',
          subtext: accuracy ? `±${Math.round(accuracy)}m` : null
        };
      case 'searching':
        return {
          icon: 'Loader2',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          text: 'Searching...',
          subtext: accuracy ? `±${Math.round(accuracy)}m` : null,
          animate: true
        };
      case 'lost':
        return {
          icon: 'WifiOff',
          color: 'text-error',
          bgColor: 'bg-error/10',
          text: 'GPS Lost',
          subtext: 'Check location settings'
        };
      default:
        return {
          icon: 'MapPin',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          text: 'GPS Inactive',
          subtext: null
        };
    }
  };

  const config = getStatusConfig();

  const handleClick = () => {
    if (gpsStatus === 'lost') {
      // Attempt to re-acquire GPS
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setAccuracy(position.coords.accuracy);
            setGpsStatus(position.coords.accuracy <= 10 ? 'accurate' : 'searching');
          },
          () => setGpsStatus('lost'),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 5000); // Show again after 5 seconds
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="gps-status-indicator">
      <div 
        className={`flex items-center gap-2 ${config.bgColor} rounded-full px-3 py-2 cursor-pointer transition-all duration-200 hover:scale-105`}
        onClick={handleClick}
      >
        <Icon 
          name={config.icon} 
          size={16} 
          className={`${config.color} ${config.animate ? 'animate-spin' : ''}`}
        />
        <div className="flex flex-col">
          <span className={`text-xs font-medium ${config.color}`}>
            {config.text}
          </span>
          {config.subtext && (
            <span className="text-xs text-muted-foreground leading-none">
              {config.subtext}
            </span>
          )}
        </div>
        
        {/* Dismiss button for non-critical states */}
        {gpsStatus !== 'lost' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDismiss();
            }}
            className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={12} />
          </button>
        )}
      </div>
      
      {/* Pulse animation for searching state */}
      {gpsStatus === 'searching' && (
        <div className="absolute inset-0 rounded-full bg-warning/20 animate-pulse-gps pointer-events-none" />
      )}
    </div>
  );
};

export default GPSStatusIndicator;