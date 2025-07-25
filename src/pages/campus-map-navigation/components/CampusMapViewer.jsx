import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const CampusMapViewer = ({ 
  userLocation, 
  destination, 
  onMapClick, 
  zoom, 
  onZoomChange,
  isNavigating 
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Updated anchor points for precise GPS to SVG conversion as requested by user
  const anchorPoints = {
    topLeft: { pixel: { x: 132.75, y: 133.55 }, gps: { lat: 18.5271557, lng: 73.7276252 } },
    bottomRight: { pixel: { x: 2512.5, y: 3776.5 }, gps: { lat: 18.5180856, lng: 73.7339646 } }
  };

  // Enhanced GPS to pixel conversion with improved precision
  const gpsToPixel = (lat, lng) => {
    const { topLeft, bottomRight } = anchorPoints;
    
    // Calculate the ratios with higher precision
    const latRatio = (lat - topLeft.gps.lat) / (bottomRight.gps.lat - topLeft.gps.lat);
    const lngRatio = (lng - topLeft.gps.lng) / (bottomRight.gps.lng - topLeft.gps.lng);
    
    // Apply ratios to pixel coordinates with precise calculation
    const x = topLeft.pixel.x + (bottomRight.pixel.x - topLeft.pixel.x) * lngRatio;
    const y = topLeft.pixel.y + (bottomRight.pixel.y - topLeft.pixel.y) * latRatio;
    
    return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
  };

  // Enhanced pixel to GPS conversion with improved precision
  const pixelToGps = (x, y) => {
    const { topLeft, bottomRight } = anchorPoints;
    
    // Calculate ratios with higher precision
    const xRatio = (x - topLeft.pixel.x) / (bottomRight.pixel.x - topLeft.pixel.x);
    const yRatio = (y - topLeft.pixel.y) / (bottomRight.pixel.y - topLeft.pixel.y);
    
    // Apply ratios to GPS coordinates with precise calculation
    const lat = topLeft.gps.lat + (bottomRight.gps.lat - topLeft.gps.lat) * yRatio;
    const lng = topLeft.gps.lng + (bottomRight.gps.lng - topLeft.gps.lng) * xRatio;
    
    return { 
      lat: Math.round(lat * 10000000) / 10000000, 
      lng: Math.round(lng * 10000000) / 10000000 
    };
  };

  // Validate if GPS coordinates are within the mapped area
  const isLocationWithinBounds = (lat, lng) => {
    const { topLeft, bottomRight } = anchorPoints.gps || anchorPoints.topLeft.gps;
    return lat >= bottomRight.lat && lat <= topLeft.lat && 
           lng >= topLeft.lng && lng <= bottomRight.lng;
  };

  // Handle map click for destination selection with bounds checking
  const handleMapClick = (event) => {
    if (isDragging || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = (event.clientX - rect.left) / zoom + panOffset.x;
    const svgY = (event.clientY - rect.top) / zoom + panOffset.y;
    
    const gpsCoords = pixelToGps(svgX, svgY);
    
    // Only allow clicks within the mapped campus area
    if (isLocationWithinBounds(gpsCoords.lat, gpsCoords.lng)) {
      onMapClick?.(gpsCoords, { x: svgX, y: svgY });
    }
  };

  // Enhanced pan handling with smoother gestures
  const handleMouseDown = (event) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
    event.preventDefault();
  };

  const handleMouseMove = (event) => {
    if (!isDragging) return;
    
    const deltaX = (event.clientX - dragStart.x) / zoom;
    const deltaY = (event.clientY - dragStart.y) / zoom;
    
    setPanOffset(prev => ({
      x: prev.x - deltaX,
      y: prev.y - deltaY
    }));
    
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Enhanced touch support for mobile zoom and pan
  const handleTouchStart = (event) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX, y: touch.clientY });
    }
    event.preventDefault();
  };

  const handleTouchMove = (event) => {
    if (!isDragging || event.touches.length !== 1) return;
    
    const touch = event.touches[0];
    const deltaX = (touch.clientX - dragStart.x) / zoom;
    const deltaY = (touch.clientY - dragStart.y) / zoom;
    
    setPanOffset(prev => ({
      x: prev.x - deltaX,
      y: prev.y - deltaY
    }));
    
    setDragStart({ x: touch.clientX, y: touch.clientY });
    event.preventDefault();
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Load SVG map
  useEffect(() => {
    const loadSvgMap = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/Jaycubic/FLAMECampusSVG/main/CampusMap.svg');
        if (!response.ok) throw new Error('Failed to load campus map');
        
        const svgText = await response.text();
        if (svgRef.current) {
          svgRef.current.innerHTML = svgText;
          
          // Get SVG dimensions
          const svgElement = svgRef.current.querySelector('svg');
          if (svgElement) {
            const viewBox = svgElement.getAttribute('viewBox');
            if (viewBox) {
              const [, , width, height] = viewBox.split(' ').map(Number);
              setSvgDimensions({ width, height });
            }
          }
          
          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Error loading campus map:', error);
        setMapError(true);
      }
    };

    loadSvgMap();
  }, []);

  // Add event listeners for enhanced pan gestures
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseUp);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragStart, zoom]);

  // Calculate user position on SVG with improved precision
  const userPixelPosition = userLocation?.lat && userLocation?.lng && isLocationWithinBounds(userLocation.lat, userLocation.lng) 
    ? gpsToPixel(userLocation.lat, userLocation.lng) 
    : null;
  const destinationPixelPosition = destination?.lat && destination?.lng && isLocationWithinBounds(destination.lat, destination.lng)
    ? gpsToPixel(destination.lat, destination.lng) 
    : null;

  if (mapError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted">
        <div className="text-center p-6">
          <Icon name="AlertTriangle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Map Loading Failed</h3>
          <p className="text-muted-foreground">Unable to load the campus map. Please check your connection.</p>
        </div>
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted">
        <div className="text-center p-6">
          <Icon name="Loader2" size={48} className="text-primary mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Loading Campus Map</h3>
          <p className="text-muted-foreground">Preparing your navigation experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 relative overflow-hidden bg-background cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Enhanced SVG Map Container with smoother zoom transitions */}
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${zoom}) translate(${-panOffset.x}px, ${-panOffset.y}px)`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onClick={handleMapClick}
      >
        <div
          ref={svgRef}
          className="w-full h-full"
          style={{ minWidth: '100%', minHeight: '100%' }}
        />
        
        {/* Enhanced User Location Marker with better accuracy indicator */}
        {userPixelPosition && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: userPixelPosition.x - 12,
              top: userPixelPosition.y - 12
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="relative">
              {/* Enhanced pulsing ring with accuracy indicator */}
              <motion.div
                className="absolute inset-0 w-6 h-6 bg-primary/20 rounded-full"
                animate={{ scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 w-6 h-6 bg-primary/40 rounded-full"
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              {/* Main marker with enhanced precision indicator */}
              <div className="w-6 h-6 bg-primary border-3 border-white rounded-full shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              {/* Accuracy indicator */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-1 h-1 bg-primary rounded-full opacity-60" />
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Destination Marker */}
        {destinationPixelPosition && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: destinationPixelPosition.x - 16,
              top: destinationPixelPosition.y - 32
            }}
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="relative">
              <Icon name="MapPin" size={32} className="text-error drop-shadow-lg" />
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Enhanced Route Line with better precision */}
        {userPixelPosition && destinationPixelPosition && isNavigating && (
          <motion.svg
            className="absolute inset-0 pointer-events-none"
            style={{ width: svgDimensions.width, height: svgDimensions.height }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.line
              x1={userPixelPosition.x}
              y1={userPixelPosition.y}
              x2={destinationPixelPosition.x}
              y2={destinationPixelPosition.y}
              stroke="#3B82F6"
              strokeWidth="4"
              strokeDasharray="12,6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="drop-shadow-sm"
            />
            
            {/* Enhanced direction arrow */}
            <motion.polygon
              points={`${destinationPixelPosition.x - 10},${destinationPixelPosition.y - 25} ${destinationPixelPosition.x + 10},${destinationPixelPosition.y - 25} ${destinationPixelPosition.x},${destinationPixelPosition.y - 35}`}
              fill="#3B82F6"
              stroke="white"
              strokeWidth="2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="drop-shadow-sm"
            />
          </motion.svg>
        )}
      </div>
      
      {/* Loading overlay during navigation setup */}
      {isNavigating && !userPixelPosition && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <Icon name="Navigation" size={32} className="text-primary mx-auto mb-2 animate-pulse" />
            <p className="text-sm text-muted-foreground">Calculating route...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusMapViewer;