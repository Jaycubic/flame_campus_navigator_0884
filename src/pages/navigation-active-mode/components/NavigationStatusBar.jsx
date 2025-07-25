import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const NavigationStatusBar = ({ 
  gpsStatus = 'searching', 
  batteryLevel = 85, 
  signalStrength = 'strong',
  onMinimize 
}) => {
  const getGPSStatusConfig = () => {
    switch (gpsStatus) {
      case 'accurate':
        return {
          icon: 'MapPin',
          color: 'text-success',
          text: 'GPS Active'
        };
      case 'searching':
        return {
          icon: 'Loader2',
          color: 'text-warning',
          text: 'Searching...',
          animate: true
        };
      case 'lost':
        return {
          icon: 'WifiOff',
          color: 'text-error',
          text: 'GPS Lost'
        };
      default:
        return {
          icon: 'MapPin',
          color: 'text-muted-foreground',
          text: 'GPS Inactive'
        };
    }
  };

  const getSignalIcon = () => {
    switch (signalStrength) {
      case 'strong':
        return 'Wifi';
      case 'medium':
        return 'Wifi';
      case 'weak':
        return 'WifiOff';
      default:
        return 'WifiOff';
    }
  };

  const getBatteryIcon = () => {
    if (batteryLevel > 75) return 'Battery';
    if (batteryLevel > 50) return 'Battery';
    if (batteryLevel > 25) return 'Battery';
    return 'BatteryLow';
  };

  const getBatteryColor = () => {
    if (batteryLevel > 25) return 'text-foreground';
    return 'text-error';
  };

  const gpsConfig = getGPSStatusConfig();
  const currentTime = new Date().toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  return (
    <motion.div
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-medium border-b border-border safe-top"
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left: FLAME Logo & GPS Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-md flex items-center justify-center">
              <Icon name="Navigation" size={14} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold text-foreground">FLAME</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Icon 
              name={gpsConfig.icon} 
              size={14} 
              className={`${gpsConfig.color} ${gpsConfig.animate ? 'animate-spin' : ''}`}
            />
            <span className={`text-xs ${gpsConfig.color}`}>
              {gpsConfig.text}
            </span>
          </div>
        </div>

        {/* Center: Current Time */}
        <div className="text-sm font-medium text-foreground font-mono">
          {currentTime}
        </div>

        {/* Right: System Status */}
        <div className="flex items-center space-x-2">
          {/* Signal Strength */}
          <Icon 
            name={getSignalIcon()} 
            size={14} 
            className={signalStrength === 'strong' ? 'text-foreground' : 
                      signalStrength === 'medium' ? 'text-warning' : 'text-error'}
          />
          
          {/* Battery Level */}
          <div className="flex items-center space-x-1">
            <Icon 
              name={getBatteryIcon()} 
              size={14} 
              className={getBatteryColor()}
            />
            <span className={`text-xs font-mono ${getBatteryColor()}`}>
              {batteryLevel}%
            </span>
          </div>
          
          {/* Minimize Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onMinimize}
            className="ml-2 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <Icon name="ChevronUp" size={16} className="text-muted-foreground" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default NavigationStatusBar;