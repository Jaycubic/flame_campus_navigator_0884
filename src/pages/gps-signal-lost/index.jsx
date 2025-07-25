import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import GPSStatusIndicator from '../../components/ui/GPSStatusIndicator';
import Icon from '../../components/AppIcon';
import GPSStatusDisplay from './components/GPSStatusDisplay';
import TroubleshootingGuide from './components/TroubleshootingGuide';
import CampusMapOverlay from './components/CampusMapOverlay';
import ActionButtons from './components/ActionButtons';

const GPSSignalLost = () => {
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);
  const [signalStrength, setSignalStrength] = useState(0);
  const [lastKnownPosition, setLastKnownPosition] = useState({
    lat: 18.5226207,
    lng: 73.7307949,
    accuracy: 25,
    location: "Near Academic Block A, FLAME University",
    timestamp: new Date().toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    })
  });
  const [retryAttempts, setRetryAttempts] = useState(0);

  useEffect(() => {
    // Simulate signal strength monitoring
    const signalInterval = setInterval(() => {
      const randomStrength = Math.floor(Math.random() * 30); // Weak signal simulation
      setSignalStrength(randomStrength);
      
      // Auto-recovery simulation (10% chance every 3 seconds)
      if (randomStrength > 60 && Math.random() > 0.9) {
        handleGPSRecovery();
      }
    }, 3000);

    return () => clearInterval(signalInterval);
  }, []);

  const handleGPSRecovery = () => {
    // Simulate successful GPS recovery
    setTimeout(() => {
      navigate('/navigation-active-mode');
    }, 1000);
  };

  const handleRetryGPS = async () => {
    setIsRetrying(true);
    setRetryAttempts(prev => prev + 1);

    try {
      // Attempt to get current position
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

      // Success - update position and navigate
      setLastKnownPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        location: "Current Location",
        timestamp: new Date().toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit',
          timeZone: 'Asia/Kolkata'
        })
      });

      setSignalStrength(85);
      
      setTimeout(() => {
        navigate('/navigation-active-mode');
      }, 1500);

    } catch (error) {
      console.error('GPS retry failed:', error);
      setSignalStrength(Math.floor(Math.random() * 20));
    } finally {
      setTimeout(() => {
        setIsRetrying(false);
      }, 2000);
    }
  };

  const handleContinueWithoutGPS = () => {
    navigate('/campus-map-navigation');
  };

  const handleManualNavigation = () => {
    navigate('/campus-map-navigation');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <GPSStatusIndicator />
      
      {/* Main Content */}
      <main className="pt-16 pb-6 px-4 space-y-6">
        {/* Hero Section */}
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="WifiOff" size={40} className="text-error" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            GPS Signal Lost
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            We're having trouble connecting to GPS satellites. Don't worry - 
            we can help you get back on track.
          </p>
        </div>

        {/* GPS Status Display */}
        <GPSStatusDisplay
          lastKnownPosition={lastKnownPosition}
          signalStrength={signalStrength}
          onRetry={handleRetryGPS}
        />

        {/* Campus Map Overlay */}
        <CampusMapOverlay
          lastKnownPosition={lastKnownPosition}
          onManualNavigation={handleManualNavigation}
        />

        {/* Action Buttons */}
        <ActionButtons
          onRetryGPS={handleRetryGPS}
          onContinueWithoutGPS={handleContinueWithoutGPS}
          isRetrying={isRetrying}
        />

        {/* Troubleshooting Guide */}
        <TroubleshootingGuide />

        {/* Status Bar */}
        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                signalStrength > 50 ? 'bg-success' : 
                signalStrength > 20 ? 'bg-warning' : 'bg-error'
              } animate-pulse`} />
              <span className="text-muted-foreground">
                System Status: {signalStrength > 50 ? 'Searching' : 'GPS Unavailable'}
              </span>
            </div>
            <span className="text-muted-foreground">
              Attempts: {retryAttempts}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GPSSignalLost;