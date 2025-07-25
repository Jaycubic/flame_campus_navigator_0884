import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UniversityLogo from './components/UniversityLogo';
import LoadingSpinner from './components/LoadingSpinner';
import LoadingMessage from './components/LoadingMessage';
import ProgressIndicator from './components/ProgressIndicator';
import LoadingSteps from './components/LoadingSteps';
import ErrorState from './components/ErrorState';

const CampusMapLoading = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadingSteps = [
    {
      id: 'map',
      title: 'Loading campus map...',
      description: 'Downloading SVG map from repository',
      icon: 'Map',
      message: 'Loading campus map...',
      messageIcon: 'Map'
    },
    {
      id: 'location',
      title: 'Requesting location access...',
      description: 'Checking GPS permissions',
      icon: 'MapPin',
      message: 'Requesting location access...',
      messageIcon: 'MapPin'
    },
    {
      id: 'gps',
      title: 'Initializing GPS tracking...',
      description: 'Connecting to location services',
      icon: 'Navigation',
      message: 'Initializing GPS tracking...',
      messageIcon: 'Navigation'
    },
    {
      id: 'complete',
      title: 'Ready to navigate!',
      description: 'All systems initialized',
      icon: 'CheckCircle',
      message: 'Campus navigator ready!',
      messageIcon: 'CheckCircle'
    }
  ];

  const currentStepData = loadingSteps[currentStep] || loadingSteps[0];

  useEffect(() => {
    const simulateLoading = async () => {
      try {
        // Step 1: Load SVG Map
        setCurrentStep(0);
        setProgress(10);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate SVG loading
        try {
          const response = await fetch('https://raw.githubusercontent.com/Jaycubic/FLAMECampusSVG/main/CampusMap.svg');
          if (!response.ok) {
            throw new Error('Failed to load SVG');
          }
          setProgress(40);
        } catch (svgError) {
          setError({ type: 'svg_load', message: 'Failed to load campus map' });
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Step 2: Request Location Access
        setCurrentStep(1);
        setProgress(60);
        
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Check geolocation support
        if (!navigator.geolocation) {
          setError({ type: 'gps', message: 'GPS not supported on this device' });
          return;
        }

        // Step 3: Initialize GPS
        setCurrentStep(2);
        setProgress(80);
        
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Step 4: Complete
        setCurrentStep(3);
        setProgress(100);
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Navigate to main campus map
        setIsLoading(false);
        setTimeout(() => {
          navigate('/campus-map-navigation');
        }, 500);

      } catch (err) {
        setError({ type: 'network', message: 'Network connection failed' });
      }
    };

    simulateLoading();
  }, [navigate]);

  const handleRetry = () => {
    setError(null);
    setCurrentStep(0);
    setProgress(0);
    setIsLoading(true);
    
    // Restart loading process
    window.location.reload();
  };

  const handleTroubleshoot = () => {
    // Navigate to troubleshooting or show tips
    navigate('/location-permission-setup');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <UniversityLogo className="mb-8" />
          <ErrorState
            error={error}
            onRetry={handleRetry}
            onTroubleshoot={handleTroubleshoot}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* University Logo */}
        <UniversityLogo />

        {/* Loading Spinner */}
        <div className="flex justify-center">
          <LoadingSpinner size={64} />
        </div>

        {/* Loading Message */}
        <LoadingMessage
          message={currentStepData.message}
          icon={currentStepData.messageIcon}
          className="min-h-[60px]"
        />

        {/* Progress Indicator */}
        <ProgressIndicator progress={progress} />

        {/* Loading Steps */}
        <LoadingSteps
          currentStep={currentStep}
          steps={loadingSteps}
        />

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <p className="text-xs text-muted-foreground">
            Preparing your campus navigation experience...
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            This may take a few moments on first launch
          </p>
        </motion.div>

        {/* Loading Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="bg-surface/80 backdrop-blur-sm rounded-lg p-4 border border-border"
        >
          <h3 className="text-sm font-medium text-foreground mb-2">
            💡 Quick Tip
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            For the best navigation experience, ensure location services are enabled 
            and you have a stable internet connection.
          </p>
        </motion.div>
      </div>

      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </div>
  );
};

export default CampusMapLoading;