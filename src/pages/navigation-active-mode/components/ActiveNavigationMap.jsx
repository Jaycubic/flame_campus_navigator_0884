import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ActiveNavigationMap = ({ 
  userLocation, 
  destination, 
  route, 
  heading = 0,
  onMapInteraction 
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [zoom, setZoom] = useState(1.8);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  // Updated precise anchor points for GPS to SVG coordinate conversion
  const ANCHOR_POINTS = {
    topLeft: { x: 132.75, y: 133.55, lat: 18.5271557, lng: 73.7276252 },
    bottomRight: { x: 2512.5, y: 3776.5, lat: 18.5180856, lng: 73.7339646 }
  };

  // Enhanced GPS to SVG pixel conversion with improved precision
  const gpsToSvgPixel = (lat, lng) => {
    const { topLeft, bottomRight } = ANCHOR_POINTS;
    
    // Calculate ratios with higher precision
    const latRatio = (lat - topLeft.lat) / (bottomRight.lat - topLeft.lat);
    const lngRatio = (lng - topLeft.lng) / (bottomRight.lng - topLeft.lng);
    
    // Apply ratios with precise calculation
    const x = topLeft.x + (lngRatio * (bottomRight.x - topLeft.x));
    const y = topLeft.y + (latRatio * (bottomRight.y - topLeft.y));
    
    return { 
      x: Math.round(x * 100) / 100, 
      y: Math.round(y * 100) / 100 
    };
  };

  // Validate if coordinates are within mapped bounds
  const isLocationWithinBounds = (lat, lng) => {
    const { topLeft, bottomRight } = ANCHOR_POINTS;
    return lat >= bottomRight.lat && lat <= topLeft.lat && 
           lng >= topLeft.lng && lng <= bottomRight.lng;
  };

  const handleMapLoad = () => {
    setMapLoaded(true);
    setMapError(false);
  };

  const handleMapError = () => {
    setMapError(true);
    setMapLoaded(false);
  };

  // Enhanced zoom controls with smoother increments
  const handleZoomIn = () => {
    setZoom(prev => {
      const step = prev < 1 ? 0.1 : prev < 2 ? 0.2 : 0.3;
      return Math.min(prev + step, 5);
    });
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const step = prev <= 1 ? 0.1 : prev <= 2 ? 0.2 : 0.3;
      return Math.max(prev - step, 0.5);
    });
  };

  const handleRecenter = () => {
    if (userLocation && containerRef.current) {
      const userPixel = gpsToSvgPixel(userLocation.lat, userLocation.lng);
      setPanOffset({ x: 0, y: 0 });
      setZoom(1.8);
      onMapInteraction?.('recenter', userPixel);
    }
  };

  // Auto-follow user location with smooth transitions
  useEffect(() => {
    if (userLocation && isLocationWithinBounds(userLocation.lat, userLocation.lng)) {
      const userPixel = gpsToSvgPixel(userLocation.lat, userLocation.lng);
      // Smoothly center map on user location during navigation
      setPanOffset(prev => ({
        x: prev.x * 0.9, // Smooth transition to center
        y: prev.y * 0.9
      }));
    }
  }, [userLocation]);

  // Calculate precise user and destination positions
  const userPixel = userLocation && isLocationWithinBounds(userLocation.lat, userLocation.lng) 
    ? gpsToSvgPixel(userLocation.lat, userLocation.lng) 
    : null;
  const destinationPixel = destination && isLocationWithinBounds(destination.lat, destination.lng)
    ? gpsToSvgPixel(destination.lat, destination.lng) 
    : null;

  return (
    <div ref={containerRef} className="relative w-full h-full bg-muted overflow-hidden">
      {/* Enhanced Campus Map SVG with improved precision */}
      <div className="absolute inset-0">
        {!mapError ? (
          <div
            className="w-full h-full"
            style={{
              transform: `scale(${zoom}) translate(${-panOffset.x}px, ${-panOffset.y}px)`,
              transformOrigin: 'center center',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox="0 0 2645 3910"
              className="w-full h-full"
            >
              {/* Load campus map with error handling */}
              <image
                href="https://raw.githubusercontent.com/Jaycubic/FLAMECampusSVG/main/CampusMap.svg"
                width="2645"
                height="3910"
                onLoad={handleMapLoad}
                onError={handleMapError}
              />
              
              {/* Enhanced Route Path with better precision */}
              {route && route.length > 1 && (
                <motion.path
                  d={`M ${route.map(point => `${point.x} ${point.y}`).join(' L ')}`}
                  stroke="#3B82F6"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="20 10"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="drop-shadow-lg"
                />
              )}
              
              {/* Enhanced Destination Pin with better visibility */}
              {destinationPixel && (
                <motion.g
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <circle
                    cx={destinationPixel.x}
                    cy={destinationPixel.y}
                    r="15"
                    fill="#EF4444"
                    stroke="white"
                    strokeWidth="4"
                    className="drop-shadow-lg"
                  />
                  <path
                    d={`M ${destinationPixel.x} ${destinationPixel.y - 15} L ${destinationPixel.x - 10} ${destinationPixel.y - 35} L ${destinationPixel.x + 10} ${destinationPixel.y - 35} Z`}
                    fill="#EF4444"
                    stroke="white"
                    strokeWidth="3"
                    className="drop-shadow-lg"
                  />
                </motion.g>
              )}
              
              {/* Enhanced User Location Marker with precise positioning */}
              {userPixel && (
                <motion.g
                  animate={{ 
                    x: userPixel.x, 
                    y: userPixel.y,
                    rotate: heading 
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 150, 
                    damping: 25,
                    duration: 0.4 
                  }}
                >
                  {/* Enhanced pulsing outer ring with accuracy indication */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="25"
                    fill="#3B82F6"
                    fillOpacity="0.15"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="18"
                    fill="#3B82F6"
                    fillOpacity="0.25"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  />
                  
                  {/* Main marker with enhanced precision */}
                  <circle
                    cx="0"
                    cy="0"
                    r="12"
                    fill="#1E40AF"
                    stroke="white"
                    strokeWidth="4"
                    className="drop-shadow-lg"
                  />
                  
                  {/* Enhanced direction arrow with heading indication */}
                  <path
                    d="M 0 -10 L 5 0 L 0 10 L -5 0 Z"
                    fill="white"
                    transform={`rotate(${heading})`}
                    className="drop-shadow-sm"
                  />
                  
                  {/* Precision indicator */}
                  <circle
                    cx="0"
                    cy="0"
                    r="2"
                    fill="white"
                    opacity="0.8"
                  />
                </motion.g>
              )}
            </svg>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-muted">
            <div className="text-center">
              <Icon name="MapOff" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Unable to load campus map</p>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {!mapLoaded && !mapError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="text-center">
              <Icon name="Loader2" size={32} className="text-primary animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading navigation map...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Map Controls with improved zoom ranges */}
      <div className="absolute bottom-20 right-4 flex flex-col gap-2 z-10">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomIn}
          className={`w-12 h-12 bg-surface/95 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-foreground transition-all duration-200 ${
            zoom >= 5 
              ? 'opacity-50 cursor-not-allowed' :'hover:bg-surface hover:shadow-xl active:scale-90'
          }`}
          disabled={zoom >= 5}
        >
          <Icon name="Plus" size={20} />
        </motion.button>
        
        <div className="px-2 py-1 bg-surface/95 backdrop-blur-md rounded-full shadow-lg">
          <div className="text-xs font-medium text-center text-muted-foreground">
            {Math.round(zoom * 100)}%
          </div>
        </div>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomOut}
          className={`w-12 h-12 bg-surface/95 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-foreground transition-all duration-200 ${
            zoom <= 0.5 
              ? 'opacity-50 cursor-not-allowed' :'hover:bg-surface hover:shadow-xl active:scale-90'
          }`}
          disabled={zoom <= 0.5}
        >
          <Icon name="Minus" size={20} />
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleRecenter}
          className={`w-12 h-12 bg-primary/95 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-200 ${
            !userPixel 
              ? 'opacity-50 cursor-not-allowed' :'hover:bg-primary hover:shadow-xl active:scale-90'
          }`}
          disabled={!userPixel}
        >
          <motion.div
            animate={userPixel ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon name="Crosshair" size={20} />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
};

export default ActiveNavigationMap;