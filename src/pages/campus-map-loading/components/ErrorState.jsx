import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ErrorState = ({ 
  error, 
  onRetry, 
  onTroubleshoot,
  className = '' 
}) => {
  const getErrorConfig = () => {
    switch (error.type) {
      case 'network':
        return {
          icon: 'WifiOff',
          title: 'Network Connection Error',
          message: 'Unable to load campus map. Please check your internet connection and try again.',
          showTroubleshoot: true
        };
      case 'svg_load':
        return {
          icon: 'MapOff',
          title: 'Map Loading Failed',
          message: 'The campus map could not be loaded from the server. This might be a temporary issue.',
          showTroubleshoot: true
        };
      case 'gps':
        return {
          icon: 'MapPin',
          title: 'GPS Services Unavailable',
          message: 'Location services are not available on this device or browser.',
          showTroubleshoot: false
        };
      default:
        return {
          icon: 'AlertTriangle',
          title: 'Loading Error',
          message: 'An unexpected error occurred while loading the campus navigator.',
          showTroubleshoot: true
        };
    }
  };

  const config = getErrorConfig();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`text-center max-w-md mx-auto ${className}`}
    >
      {/* Error Icon */}
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name={config.icon} size={32} className="text-error" />
      </div>

      {/* Error Title */}
      <h2 className="text-xl font-semibold text-foreground mb-2">
        {config.title}
      </h2>

      {/* Error Message */}
      <p className="text-muted-foreground mb-6 leading-relaxed">
        {config.message}
      </p>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="default"
          onClick={onRetry}
          className="w-full"
          iconName="RefreshCw"
          iconPosition="left"
        >
          Try Again
        </Button>

        {config.showTroubleshoot && (
          <Button
            variant="outline"
            onClick={onTroubleshoot}
            className="w-full"
            iconName="HelpCircle"
            iconPosition="left"
          >
            Troubleshooting Tips
          </Button>
        )}
      </div>

      {/* Additional Help Text */}
      <p className="text-xs text-muted-foreground mt-4">
        If the problem persists, please contact campus IT support.
      </p>
    </motion.div>
  );
};

export default ErrorState;