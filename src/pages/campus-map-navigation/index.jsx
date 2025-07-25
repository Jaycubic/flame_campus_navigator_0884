import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import GPSStatusIndicator from '../../components/ui/GPSStatusIndicator';
import CampusMapViewer from './components/CampusMapViewer';
import MapControls from './components/MapControls';
import DestinationPanel from './components/DestinationPanel';
import NavigationStatusBar from './components/NavigationStatusBar';
import VoiceGuidance from './components/VoiceGuidance';

const CampusMapNavigation = () => {
  const navigate = useNavigate();
  
  // Location and GPS state
  const [userLocation, setUserLocation] = useState(null);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [watchId, setWatchId] = useState(null);
  
  // Map state
  const [zoom, setZoom] = useState(1);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(null);
  
  // Navigation state
  const [isNavigating, setIsNavigating] = useState(false);
  const [hasArrived, setHasArrived] = useState(false);

  // Calculate distance between two GPS coordinates
  const calculateDistance = useCallback((lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }, []);

  // Update distance when user location or destination changes
  useEffect(() => {
    if (userLocation && destination) {
      const dist = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        destination.lat, 
        destination.lng
      );
      setDistance(dist);
    } else {
      setDistance(null);
    }
  }, [userLocation, destination, calculateDistance]);

  // Initialize GPS tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      navigate('/location-permission-setup');
      return;
    }

    const handleSuccess = (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      setUserLocation({ lat: latitude, lng: longitude });
      setGpsAccuracy(accuracy);
      setLocationError(null);
    };

    const handleError = (error) => {
      console.error('GPS Error:', error);
      setLocationError(error.message);
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          navigate('/location-permission-setup');
          break;
        case error.POSITION_UNAVAILABLE:
        case error.TIMEOUT:
          navigate('/gps-signal-lost');
          break;
        default:
          break;
      }
    };

    // Start watching position
    const id = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );

    setWatchId(id);

    // Cleanup
    return () => {
      if (id) {
        navigator.geolocation.clearWatch(id);
      }
    };
  }, [navigate]);

  // Handle map click for destination selection
  const handleMapClick = useCallback((gpsCoords, pixelCoords) => {
    if (isNavigating) return;
    
    setDestination({
      lat: gpsCoords.lat,
      lng: gpsCoords.lng,
      name: 'Selected Location',
      pixel: pixelCoords
    });
  }, [isNavigating]);

  // Enhanced map control handlers with improved zoom steps
  const handleZoomIn = useCallback(() => {
    setZoom(prev => {
      const step = prev < 1 ? 0.1 : prev < 2 ? 0.2 : 0.3;
      return Math.min(prev + step, 4);
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => {
      const step = prev <= 1 ? 0.1 : prev <= 2 ? 0.2 : 0.3;
      return Math.max(prev - step, 0.3);
    });
  }, []);

  const handleRecenter = useCallback(() => {
    if (userLocation) {
      setZoom(1.5); // Optimal zoom level for campus navigation
      // Reset pan offset would be handled in CampusMapViewer
    }
  }, [userLocation]);

  // New handler for fitting map to show both user and destination
  const handleFitToBounds = useCallback(() => {
    if (userLocation && destination) {
      // Calculate optimal zoom and center to show both points
      setZoom(1.2);
    }
  }, [userLocation, destination]);

  // Navigation handlers
  const handleStartNavigation = useCallback(() => {
    if (!userLocation || !destination) return;
    
    setIsNavigating(true);
    setHasArrived(false);
    navigate('/navigation-active-mode');
  }, [userLocation, destination, navigate]);

  const handleCancelNavigation = useCallback(() => {
    setIsNavigating(false);
    setHasArrived(false);
  }, []);

  const handleClearDestination = useCallback(() => {
    setDestination(null);
    setDistance(null);
    setIsNavigating(false);
    setHasArrived(false);
  }, []);

  const handleArrival = useCallback(() => {
    setHasArrived(true);
    setIsNavigating(false);
    
    // Show arrival notification
    setTimeout(() => {
      setHasArrived(false);
      setDestination(null);
    }, 5000);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header />
      
      {/* GPS Status Indicator */}
      <GPSStatusIndicator />
      
      {/* Navigation Status Bar */}
      <NavigationStatusBar
        userLocation={userLocation}
        gpsAccuracy={gpsAccuracy}
        isNavigating={isNavigating}
        destination={destination}
        distance={distance}
      />
      
      {/* Voice Guidance */}
      <VoiceGuidance
        isNavigating={isNavigating}
        destination={destination}
        distance={distance}
        userLocation={userLocation}
        onArrival={handleArrival}
      />

      {/* Main Map Container */}
      <motion.div 
        className="flex-1 relative mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CampusMapViewer
          userLocation={userLocation}
          destination={destination}
          onMapClick={handleMapClick}
          zoom={zoom}
          onZoomChange={setZoom}
          isNavigating={isNavigating}
        />
        
        {/* Enhanced Map Controls with new zoom limits */}
        <MapControls
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onRecenter={handleRecenter}
          onFitToBounds={handleFitToBounds}
          userLocation={userLocation}
          maxZoom={4}
          minZoom={0.3}
        />
      </motion.div>

      {/* Destination Panel */}
      <DestinationPanel
        userLocation={userLocation}
        destination={destination}
        distance={distance}
        onStartNavigation={handleStartNavigation}
        onClearDestination={handleClearDestination}
        isNavigating={isNavigating}
        onCancelNavigation={handleCancelNavigation}
      />

      {/* Arrival Notification */}
      {hasArrived && (
        <motion.div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-surface rounded-lg shadow-critical p-6 mx-4 text-center max-w-sm"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
              >
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              You've Arrived!
            </h3>
            <p className="text-muted-foreground">
              You have reached your destination at {destination?.name || 'the selected location'}.
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Loading State */}
      {!userLocation && !locationError && (
        <motion.div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Acquiring GPS Location
            </h3>
            <p className="text-muted-foreground">
              Please wait while we determine your position...
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CampusMapNavigation;