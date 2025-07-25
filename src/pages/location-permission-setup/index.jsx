import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import LocationIllustration from './components/LocationIllustration';
import PermissionBenefits from './components/PermissionBenefits';
import PermissionStatus from './components/PermissionStatus';
import TroubleshootingGuide from './components/TroubleshootingGuide';
import PrivacyInfo from './components/PrivacyInfo';

const LocationPermissionSetup = () => {
  const navigate = useNavigate();
  const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'prompt', 'granted', 'denied', 'blocked', 'unavailable'
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedInitialPermission, setHasCheckedInitialPermission] = useState(false);

  // Check initial permission status
  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    if (!navigator.geolocation) {
      setPermissionStatus('unavailable');
      setHasCheckedInitialPermission(true);
      return;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      setPermissionStatus(permission.state);
      setHasCheckedInitialPermission(true);
      
      // If already granted, redirect to campus map
      if (permission.state === 'granted') {
        setTimeout(() => {
          navigate('/campus-map-navigation');
        }, 1500);
      }
    } catch (error) {
      console.error('Permission check failed:', error);
      setPermissionStatus('prompt');
      setHasCheckedInitialPermission(true);
    }
  };

  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      setPermissionStatus('unavailable');
      return;
    }

    setIsLoading(true);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });

      console.log('Location permission granted:', position);
      setPermissionStatus('granted');
      
      // Redirect to campus map after success
      setTimeout(() => {
        navigate('/campus-map-navigation');
      }, 2000);
      
    } catch (error) {
      console.error('Location permission error:', error);
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setPermissionStatus('denied');
          break;
        case error.POSITION_UNAVAILABLE:
          setPermissionStatus('unavailable');
          break;
        case error.TIMEOUT:
          setPermissionStatus('denied');
          break;
        default:
          setPermissionStatus('denied');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryPermission = () => {
    setPermissionStatus('prompt');
    requestLocationPermission();
  };

  const handleOpenBrowserSettings = () => {
    // Show browser-specific instructions
    const userAgent = navigator.userAgent.toLowerCase();
    let instructions = '';
    
    if (userAgent.includes('chrome')) {
      instructions = 'Click the location icon in your address bar and select "Always allow"';
    } else if (userAgent.includes('firefox')) {
      instructions = 'Click the shield icon and select "Turn off Blocking for This Site"';
    } else if (userAgent.includes('safari')) {
      instructions = 'Go to Safari > Preferences > Websites > Location and allow this site';
    } else {
      instructions = 'Please check your browser settings to enable location access';
    }
    
    alert(instructions);
  };

  const handleSkipForNow = () => {
    navigate('/campus-map-navigation');
  };

  const handleLearnMore = () => {
    // Scroll to privacy section or expand it
    const privacySection = document.getElementById('privacy-info');
    if (privacySection) {
      privacySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!hasCheckedInitialPermission) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon name="Loader2" size={32} className="text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Checking location permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 pb-8">
        <div className="max-w-md mx-auto px-4">
          {/* FLAME Logo */}
          <div className="text-center mb-8 pt-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <Icon name="Navigation" size={24} color="white" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-foreground">FLAME</h1>
                <p className="text-sm text-muted-foreground">Campus Navigator</p>
              </div>
            </div>
          </div>

          {/* Location Illustration */}
          <LocationIllustration />

          {/* Main Content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Enable Location Access
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Get the most out of your campus navigation experience with real-time positioning and turn-by-turn guidance.
            </p>
          </div>

          {/* Permission Status */}
          {(permissionStatus === 'denied' || permissionStatus === 'blocked' || permissionStatus === 'unavailable') && (
            <PermissionStatus
              status={permissionStatus}
              onRetry={handleRetryPermission}
              onOpenSettings={handleOpenBrowserSettings}
            />
          )}

          {/* Success State */}
          {permissionStatus === 'granted' && (
            <div className="p-6 bg-success/10 border border-success/20 rounded-lg mb-6 text-center">
              <Icon name="CheckCircle" size={32} className="text-success mx-auto mb-3" />
              <h3 className="font-medium text-foreground mb-2">Location Access Enabled!</h3>
              <p className="text-sm text-muted-foreground">
                Redirecting you to the campus map...
              </p>
            </div>
          )}

          {/* Benefits */}
          {permissionStatus === 'prompt' && (
            <PermissionBenefits />
          )}

          {/* Action Buttons */}
          {permissionStatus === 'prompt' && (
            <div className="space-y-4 mb-8">
              <Button
                variant="default"
                size="lg"
                fullWidth
                loading={isLoading}
                onClick={requestLocationPermission}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium py-4 text-lg shadow-lg"
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                    Requesting Access...
                  </>
                ) : (
                  <>
                    <Icon name="MapPin" size={20} className="mr-2" />
                    Enable Location Access
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                fullWidth
                onClick={handleSkipForNow}
                className="text-muted-foreground hover:text-foreground"
              >
                Skip for now
              </Button>
            </div>
          )}

          {/* Learn More Button */}
          {permissionStatus === 'prompt' && (
            <div className="text-center mb-8">
              <Button
                variant="link"
                onClick={handleLearnMore}
                className="text-primary hover:text-primary/80"
              >
                <Icon name="Info" size={16} className="mr-2" />
                Learn more about privacy
              </Button>
            </div>
          )}

          {/* Privacy Information */}
          <div id="privacy-info">
            <PrivacyInfo />
          </div>

          {/* Troubleshooting Guide */}
          {(permissionStatus === 'denied' || permissionStatus === 'blocked') && (
            <TroubleshootingGuide />
          )}

          {/* Footer */}
          <div className="text-center pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} FLAME University. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Your privacy and security are our top priorities.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LocationPermissionSetup;