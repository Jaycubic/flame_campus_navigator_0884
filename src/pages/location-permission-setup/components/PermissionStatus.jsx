import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PermissionStatus = ({ status, onRetry, onOpenSettings }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'denied':
        return {
          icon: 'XCircle',
          iconColor: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          title: 'Location Access Denied',
          message: 'You can still use the app, but navigation features will be limited. You can enable location access anytime in your browser settings.',
          showRetry: true,
          showSettings: true
        };
      case 'blocked':
        return {
          icon: 'ShieldX',
          iconColor: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          title: 'Location Access Blocked',
          message: 'Location access has been permanently blocked. Please enable it in your browser settings to use navigation features.',
          showRetry: false,
          showSettings: true
        };
      case 'unavailable':
        return {
          icon: 'WifiOff',
          iconColor: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          title: 'Location Services Unavailable',
          message: 'Your device or browser does not support location services. Please try using a different browser or device.',
          showRetry: true,
          showSettings: false
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  
  if (!config) return null;

  return (
    <div className={`p-6 rounded-lg border ${config.bgColor} ${config.borderColor} mb-6`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Icon name={config.icon} size={24} className={config.iconColor} />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-foreground mb-2">{config.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{config.message}</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {config.showRetry && (
              <Button
                variant="outline"
                onClick={onRetry}
                className="flex-1 sm:flex-none"
              >
                <Icon name="RotateCcw" size={16} className="mr-2" />
                Try Again
              </Button>
            )}
            {config.showSettings && (
              <Button
                variant="ghost"
                onClick={onOpenSettings}
                className="flex-1 sm:flex-none text-primary hover:text-primary"
              >
                <Icon name="Settings" size={16} className="mr-2" />
                Browser Settings
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionStatus;