import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const NavigationStatusBar = ({ 
  userLocation, 
  gpsAccuracy, 
  isNavigating, 
  destination,
  distance 
}) => {
  const [gpsStatus, setGpsStatus] = useState('searching');
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update GPS status based on accuracy
  useEffect(() => {
    if (!userLocation) {
      setGpsStatus('lost');
    } else if (gpsAccuracy <= 10) {
      setGpsStatus('accurate');
    } else if (gpsAccuracy <= 50) {
      setGpsStatus('searching');
    } else {
      setGpsStatus('poor');
    }
  }, [userLocation, gpsAccuracy]);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get battery level (if supported)
  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        setBatteryLevel(Math.round(battery.level * 100));
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }
  }, []);

  const getGpsStatusConfig = () => {
    switch (gpsStatus) {
      case 'accurate':
        return {
          icon: 'MapPin',
          color: 'text-success',
          text: 'GPS Active',
          bgColor: 'bg-success/10'
        };
      case 'searching':
        return {
          icon: 'Loader2',
          color: 'text-warning',
          text: 'Searching...',
          bgColor: 'bg-warning/10',
          animate: true
        };
      case 'poor':
        return {
          icon: 'AlertTriangle',
          color: 'text-warning',
          text: 'Poor Signal',
          bgColor: 'bg-warning/10'
        };
      case 'lost':
        return {
          icon: 'WifiOff',
          color: 'text-error',
          text: 'GPS Lost',
          bgColor: 'bg-error/10'
        };
      default:
        return {
          icon: 'MapPin',
          color: 'text-muted-foreground',
          text: 'GPS Inactive',
          bgColor: 'bg-muted'
        };
    }
  };

  const gpsConfig = getGpsStatusConfig();

  return (
    <motion.div
      className="fixed top-16 left-0 right-0 z-10 bg-surface/95 backdrop-blur-medium border-b border-border safe-top"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left: GPS Status */}
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-2 ${gpsConfig.bgColor} rounded-full px-3 py-1`}>
            <Icon 
              name={gpsConfig.icon} 
              size={14} 
              className={`${gpsConfig.color} ${gpsConfig.animate ? 'animate-spin' : ''}`}
            />
            <span className={`text-xs font-medium ${gpsConfig.color}`}>
              {gpsConfig.text}
            </span>
            {gpsAccuracy && gpsStatus !== 'lost' && (
              <span className="text-xs text-muted-foreground">
                ±{Math.round(gpsAccuracy)}m
              </span>
            )}
          </div>
        </div>

        {/* Center: Navigation Status */}
        {isNavigating && destination && (
          <motion.div
            className="flex items-center space-x-2 bg-primary/10 rounded-full px-3 py-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon name="Navigation" size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary">
              Navigating
            </span>
            {distance && (
              <span className="text-xs text-muted-foreground">
                {distance < 1000 ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`}
              </span>
            )}
          </motion.div>
        )}

        {/* Right: System Status */}
        <div className="flex items-center space-x-2">
          {/* Battery Level */}
          {batteryLevel !== null && (
            <div className="flex items-center space-x-1">
              <Icon 
                name={batteryLevel > 20 ? "Battery" : "BatteryLow"} 
                size={14} 
                className={batteryLevel > 20 ? "text-muted-foreground" : "text-warning"}
              />
              <span className="text-xs text-muted-foreground">
                {batteryLevel}%
              </span>
            </div>
          )}

          {/* Current Time */}
          <div className="text-xs font-mono text-muted-foreground">
            {currentTime.toLocaleTimeString('en-IN', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            })}
          </div>

          {/* Network Status */}
          <Icon 
            name={navigator.onLine ? "Wifi" : "WifiOff"} 
            size={14} 
            className={navigator.onLine ? "text-success" : "text-error"}
          />
        </div>
      </div>

      {/* Navigation Progress Bar */}
      {isNavigating && distance && (
        <motion.div
          className="h-1 bg-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.max(10, 100 - (distance / 10))}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default NavigationStatusBar;