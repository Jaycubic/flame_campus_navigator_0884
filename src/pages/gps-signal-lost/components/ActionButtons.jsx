import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActionButtons = ({ onRetryGPS, onContinueWithoutGPS, isRetrying }) => {
  const navigate = useNavigate();

  const handleRetryGPS = () => {
    onRetryGPS();
  };

  const handleContinueWithoutGPS = () => {
    onContinueWithoutGPS();
    navigate('/campus-map-navigation');
  };

  const handleGoToSettings = () => {
    navigate('/location-permission-setup');
  };

  const handleBackToMap = () => {
    navigate('/campus-map-navigation');
  };

  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <div className="space-y-3">
        <Button
          variant="default"
          fullWidth
          loading={isRetrying}
          iconName="RefreshCw"
          iconPosition="left"
          onClick={handleRetryGPS}
          className="h-12"
        >
          {isRetrying ? 'Searching for GPS Signal...' : 'Retry GPS Connection'}
        </Button>

        <Button
          variant="outline"
          fullWidth
          iconName="Map"
          iconPosition="left"
          onClick={handleContinueWithoutGPS}
          className="h-12"
        >
          Continue Without GPS
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="ghost"
          iconName="Settings"
          iconPosition="left"
          onClick={handleGoToSettings}
          className="h-10"
        >
          Location Settings
        </Button>

        <Button
          variant="ghost"
          iconName="ArrowLeft"
          iconPosition="left"
          onClick={handleBackToMap}
          className="h-10"
        >
          Back to Map
        </Button>
      </div>

      {/* Emergency Contact */}
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Phone" size={20} className="text-accent mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-foreground mb-1">Need Help?</h4>
            <p className="text-sm text-muted-foreground mb-3">
              If you're lost on campus, contact FLAME University security for assistance.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="tel:+912067913000"
                className="flex items-center space-x-2 text-sm text-accent hover:text-accent/80 transition-colors"
              >
                <Icon name="Phone" size={16} />
                <span>+91 20 6791 3000</span>
              </a>
              <a
                href="mailto:security@flame.edu.in"
                className="flex items-center space-x-2 text-sm text-accent hover:text-accent/80 transition-colors"
              >
                <Icon name="Mail" size={16} />
                <span>Email Security</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          GPS issues are usually temporary and resolve within a few minutes
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated: {new Date().toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: 'Asia/Kolkata'
          })}
        </p>
      </div>
    </div>
  );
};

export default ActionButtons;