import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import NavigationStatusBar from './components/NavigationStatusBar';
import ActiveNavigationMap from './components/ActiveNavigationMap';
import NavigationPanel from './components/NavigationPanel';
import VoiceAnnouncementToast from './components/VoiceAnnouncementToast';
import ArrivalCelebration from './components/ArrivalCelebration';

const NavigationActiveMode = () => {
  const navigate = useNavigate();
  const watchIdRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // Navigation state
  const [isNavigating, setIsNavigating] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [gpsStatus, setGpsStatus] = useState('searching');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hasArrived, setHasArrived] = useState(false);

  // Voice announcement state
  const [voiceMessage, setVoiceMessage] = useState('');
  const [showVoiceToast, setShowVoiceToast] = useState(false);
  const [voiceType, setVoiceType] = useState('instruction');

  // Mock destination data
  const [destination] = useState({
    id: 'library',
    name: 'FLAME University Library',
    address: 'Academic Block A, Ground Floor',
    description: 'Central Library and Study Area',
    lat: 18.5245123,
    lng: 73.7298456,
    totalDistance: 850
  });

  // Mock route data
  const [route] = useState([
    { x: 1245.5, y: 2156.3 },
    { x: 1456.2, y: 2089.7 },
    { x: 1678.9, y: 1923.4 },
    { x: 1834.6, y: 1756.8 },
    { x: 1987.3, y: 1634.2 }
  ]);

  // Navigation metrics
  const [distance, setDistance] = useState(850);
  const [estimatedTime, setEstimatedTime] = useState(420);
  const [currentStep, setCurrentStep] = useState({
    instruction: "Head northeast towards Academic Block A",
    distance: 125,
    icon: "ArrowUpRight"
  });

  // Mock GPS location tracking
  useEffect(() => {
    const startLocationTracking = () => {
      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy
            };
            
            setUserLocation(newLocation);
            setHeading(position.coords.heading || 0);
            
            // Update GPS status based on accuracy
            if (position.coords.accuracy <= 10) {
              setGpsStatus('accurate');
            } else if (position.coords.accuracy <= 50) {
              setGpsStatus('searching');
            } else {
              setGpsStatus('lost');
            }

            // Calculate distance to destination
            const distanceToDestination = calculateDistance(
              newLocation.lat, 
              newLocation.lng,
              destination.lat,
              destination.lng
            );
            
            setDistance(distanceToDestination);
            setEstimatedTime(Math.round(distanceToDestination / 1.4)); // ~1.4 m/s walking speed

            // Check if arrived (within 10 meters)
            if (distanceToDestination <= 10 && !hasArrived) {
              handleArrival();
            }

            // Update navigation instructions
            updateNavigationInstructions(distanceToDestination);
          },
          (error) => {
            console.error('GPS Error:', error);
            setGpsStatus('lost');
            
            // Use mock location for demo
            setUserLocation({
              lat: 18.5251234,
              lng: 73.7285678,
              accuracy: 5
            });
            setGpsStatus('accurate');
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000
          }
        );
      } else {
        // Fallback to mock location
        setUserLocation({
          lat: 18.5251234,
          lng: 73.7285678,
          accuracy: 5
        });
        setGpsStatus('accurate');
      }
    };

    startLocationTracking();

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [destination, hasArrived]);

  // Calculate distance between two GPS coordinates
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // Update navigation instructions based on distance
  const updateNavigationInstructions = (distanceToDestination) => {
    if (distanceToDestination <= 50) {
      setCurrentStep({
        instruction: "You are approaching your destination",
        distance: Math.round(distanceToDestination),
        icon: "MapPin"
      });
    } else if (distanceToDestination <= 100) {
      setCurrentStep({
        instruction: "Continue straight towards the library entrance",
        distance: Math.round(distanceToDestination),
        icon: "ArrowUp"
      });
    } else if (distanceToDestination <= 200) {
      setCurrentStep({
        instruction: "Turn right at the next pathway",
        distance: Math.round(distanceToDestination - 150),
        icon: "ArrowRight"
      });
    }
  };

  // Handle arrival at destination
  const handleArrival = () => {
    setHasArrived(true);
    setIsNavigating(false);
    
    // Voice announcement
    const arrivalMessage = "You have arrived at your destination";
    announceVoice(arrivalMessage, 'arrival');
  };

  // Voice announcement function
  const announceVoice = (message, type = 'instruction') => {
    if (!voiceEnabled) return;

    setVoiceMessage(message);
    setVoiceType(type);
    setShowVoiceToast(true);

    // Use Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      speechSynthesis.speak(utterance);
    }
  };

  // Handle navigation cancellation
  const handleCancelNavigation = () => {
    setIsNavigating(false);
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    navigate('/campus-map-navigation');
  };

  // Handle voice toggle
  const handleToggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      announceVoice("Voice guidance enabled", 'instruction');
    }
  };

  // Handle arrival celebration actions
  const handleContinueExploring = () => {
    setHasArrived(false);
    navigate('/campus-map-navigation');
  };

  const handleNavigateAgain = () => {
    setHasArrived(false);
    navigate('/campus-map-navigation');
  };

  const handleCloseArrival = () => {
    setHasArrived(false);
    navigate('/campus-map-navigation');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Status Bar */}
      <NavigationStatusBar
        gpsStatus={gpsStatus}
        batteryLevel={87}
        signalStrength="strong"
        onMinimize={() => navigate('/campus-map-navigation')}
      />

      {/* Main Map Container */}
      <div className="pt-14 h-screen">
        <ActiveNavigationMap
          userLocation={userLocation}
          destination={destination}
          route={route}
          heading={heading}
          onMapInteraction={(action, data) => {
            console.log('Map interaction:', action, data);
          }}
        />
      </div>

      {/* Navigation Panel */}
      <AnimatePresence>
        {isNavigating && (
          <NavigationPanel
            destination={destination}
            distance={distance}
            estimatedTime={estimatedTime}
            currentStep={currentStep}
            isNavigating={isNavigating}
            onCancelNavigation={handleCancelNavigation}
            onToggleVoice={handleToggleVoice}
            voiceEnabled={voiceEnabled}
          />
        )}
      </AnimatePresence>

      {/* Voice Announcement Toast */}
      <VoiceAnnouncementToast
        message={voiceMessage}
        isVisible={showVoiceToast}
        type={voiceType}
        onDismiss={() => setShowVoiceToast(false)}
        autoHide={true}
        duration={4000}
      />

      {/* Arrival Celebration */}
      <ArrivalCelebration
        isVisible={hasArrived}
        destination={destination}
        onContinue={handleContinueExploring}
        onNavigateAgain={handleNavigateAgain}
        onClose={handleCloseArrival}
      />
    </div>
  );
};

export default NavigationActiveMode;