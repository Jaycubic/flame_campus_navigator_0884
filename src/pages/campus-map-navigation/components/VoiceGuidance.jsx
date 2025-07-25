import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const VoiceGuidance = ({ 
  isNavigating, 
  destination, 
  distance, 
  userLocation,
  onArrival 
}) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastAnnouncementDistance, setLastAnnouncementDistance] = useState(null);
  const speechSynthesisRef = useRef(null);

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }
  }, []);

  // Voice guidance logic
  useEffect(() => {
    if (!isNavigating || !isVoiceEnabled || !distance || !speechSynthesisRef.current) {
      return;
    }

    const announceGuidance = (message) => {
      if (speechSynthesisRef.current && !isSpeaking) {
        // Cancel any ongoing speech
        speechSynthesisRef.current.cancel();
        
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        utterance.lang = 'en-IN';
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        speechSynthesisRef.current.speak(utterance);
      }
    };

    // Check for arrival (within 10 meters)
    if (distance <= 10) {
      if (lastAnnouncementDistance === null || lastAnnouncementDistance > 10) {
        announceGuidance("You have arrived at your destination");
        onArrival?.();
        setLastAnnouncementDistance(distance);
      }
      return;
    }

    // Distance-based announcements
    const announcements = [
      { threshold: 500, message: "In 500 meters, you will reach your destination" },
      { threshold: 200, message: "In 200 meters, you will reach your destination" },
      { threshold: 100, message: "In 100 meters, you will reach your destination" },
      { threshold: 50, message: "In 50 meters, you will reach your destination" },
      { threshold: 25, message: "You are almost at your destination" }
    ];

    for (const announcement of announcements) {
      if (distance <= announcement.threshold && 
          (lastAnnouncementDistance === null || lastAnnouncementDistance > announcement.threshold)) {
        announceGuidance(announcement.message);
        setLastAnnouncementDistance(distance);
        break;
      }
    }
  }, [distance, isNavigating, isVoiceEnabled, lastAnnouncementDistance, isSpeaking, onArrival]);

  // Navigation start announcement
  useEffect(() => {
    if (isNavigating && destination && isVoiceEnabled && speechSynthesisRef.current) {
      const message = `Navigation started to ${destination.name || 'your destination'}`;
      
      setTimeout(() => {
        if (speechSynthesisRef.current && !isSpeaking) {
          const utterance = new SpeechSynthesisUtterance(message);
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          utterance.volume = 0.8;
          utterance.lang = 'en-IN';
          
          utterance.onstart = () => setIsSpeaking(true);
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);
          
          speechSynthesisRef.current.speak(utterance);
        }
      }, 1000);
    }
  }, [isNavigating, destination, isVoiceEnabled]);

  // Reset announcement tracking when navigation stops
  useEffect(() => {
    if (!isNavigating) {
      setLastAnnouncementDistance(null);
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
      setIsSpeaking(false);
    }
  }, [isNavigating]);

  const toggleVoiceGuidance = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    
    if (speechSynthesisRef.current && isSpeaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
    
    // Announce the change
    if (!isVoiceEnabled && speechSynthesisRef.current) {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance("Voice guidance enabled");
        utterance.rate = 0.9;
        utterance.lang = 'en-IN';
        speechSynthesisRef.current.speak(utterance);
      }, 100);
    }
  };

  const testVoiceGuidance = () => {
    if (speechSynthesisRef.current && isVoiceEnabled) {
      const utterance = new SpeechSynthesisUtterance("Voice guidance is working correctly");
      utterance.rate = 0.9;
      utterance.lang = 'en-IN';
      speechSynthesisRef.current.speak(utterance);
    }
  };

  // Don't render if speech synthesis is not supported
  if (!('speechSynthesis' in window)) {
    return null;
  }

  return (
    <motion.div
      className="fixed top-20 left-4 z-20"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-surface/95 backdrop-blur-medium rounded-lg shadow-floating border border-border p-3">
        <div className="flex items-center space-x-2">
          {/* Voice Status Indicator */}
          <div className={`flex items-center space-x-2 ${
            isVoiceEnabled ? 'text-primary' : 'text-muted-foreground'
          }`}>
            <Icon 
              name={isVoiceEnabled ? (isSpeaking ? "Volume2" : "VolumeX") : "VolumeX"} 
              size={16}
              className={isSpeaking ? 'animate-pulse' : ''}
            />
            <span className="text-xs font-medium">
              {isSpeaking ? 'Speaking...' : (isVoiceEnabled ? 'Voice On' : 'Voice Off')}
            </span>
          </div>

          {/* Voice Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVoiceGuidance}
            className={`p-1 h-6 w-6 ${
              isVoiceEnabled ? 'text-primary hover:bg-primary/10' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            <Icon name={isVoiceEnabled ? "Volume2" : "VolumeX"} size={12} />
          </Button>

          {/* Test Voice Button (only when not navigating) */}
          {!isNavigating && isVoiceEnabled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={testVoiceGuidance}
              className="p-1 h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <Icon name="Play" size={12} />
            </Button>
          )}
        </div>

        {/* Voice Guidance Status */}
        {isNavigating && (
          <motion.div
            className="mt-2 pt-2 border-t border-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isVoiceEnabled ? 'bg-success animate-pulse' : 'bg-muted-foreground'
              }`} />
              <span className="text-xs text-muted-foreground">
                {isVoiceEnabled ? 'Guidance active' : 'Guidance disabled'}
              </span>
            </div>
            
            {distance && distance <= 50 && (
              <div className="mt-1 text-xs text-warning font-medium">
                Approaching destination
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default VoiceGuidance;