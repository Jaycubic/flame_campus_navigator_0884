import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const MapControls = ({ 
  zoom, 
  onZoomIn, 
  onZoomOut, 
  onRecenter, 
  onToggleLayer,
  userLocation,
  maxZoom = 4,
  minZoom = 0.3 
}) => {
  const handleZoomIn = () => {
    if (zoom < maxZoom) {
      onZoomIn?.();
    }
  };

  const handleZoomOut = () => {
    if (zoom > minZoom) {
      onZoomOut?.();
    }
  };

  const handleRecenter = () => {
    onRecenter?.();
  };

  // Enhanced zoom step calculation for smoother zoom
  const getZoomStep = () => {
    if (zoom < 1) return 0.1;
    if (zoom < 2) return 0.2;
    return 0.3;
  };

  return (
    <div className="fixed bottom-6 right-4 z-20 flex flex-col gap-2">
      {/* Enhanced Zoom Controls with better UX */}
      <motion.div 
        className="bg-surface/95 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border border-border"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className={`w-14 h-14 rounded-none border-b border-border transition-all duration-200 ${
            zoom >= maxZoom 
              ? 'opacity-50 cursor-not-allowed' :'hover:bg-muted active:scale-95 hover:shadow-md'
          }`}
          onClick={handleZoomIn}
          disabled={zoom >= maxZoom}
        >
          <Icon name="Plus" size={22} className="transition-transform duration-200 hover:scale-110" />
        </Button>
        
        {/* Zoom Level Indicator */}
        <div className="px-3 py-1 bg-muted/50 border-b border-border">
          <div className="text-xs font-medium text-center text-muted-foreground">
            {Math.round(zoom * 100)}%
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className={`w-14 h-14 rounded-none transition-all duration-200 ${
            zoom <= minZoom 
              ? 'opacity-50 cursor-not-allowed' :'hover:bg-muted active:scale-95 hover:shadow-md'
          }`}
          onClick={handleZoomOut}
          disabled={zoom <= minZoom}
        >
          <Icon name="Minus" size={22} className="transition-transform duration-200 hover:scale-110" />
        </Button>
      </motion.div>

      {/* Enhanced Recenter Control */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className={`w-14 h-14 bg-surface/95 backdrop-blur-md shadow-xl rounded-xl border border-border transition-all duration-200 ${
            !userLocation 
              ? 'opacity-50 cursor-not-allowed' :'hover:bg-muted active:scale-95 hover:shadow-md'
          }`}
          onClick={handleRecenter}
          disabled={!userLocation}
        >
          <Icon name="Crosshair" size={22} className="transition-transform duration-200 hover:scale-110" />
        </Button>
      </motion.div>

      {/* Enhanced My Location Control */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className={`w-14 h-14 bg-primary/95 backdrop-blur-md text-primary-foreground shadow-xl rounded-xl transition-all duration-200 ${
            !userLocation 
              ? 'opacity-50 cursor-not-allowed' :'hover:bg-primary/90 active:scale-95 hover:shadow-md'
          }`}
          onClick={handleRecenter}
          disabled={!userLocation}
        >
          <motion.div
            animate={userLocation ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon name="Navigation" size={22} />
          </motion.div>
        </Button>
      </motion.div>

      {/* Enhanced Compass Control */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-14 h-14 bg-surface/95 backdrop-blur-md shadow-xl rounded-xl border border-border hover:bg-muted active:scale-95 transition-all duration-200 hover:shadow-md"
          onClick={() => {
            // Reset map orientation to north with animation
            console.log('Reset compass to north');
          }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Icon name="Compass" size={22} />
          </motion.div>
        </Button>
      </motion.div>

      {/* Zoom Fit Control - New feature for better navigation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-14 h-14 bg-surface/95 backdrop-blur-md shadow-xl rounded-xl border border-border hover:bg-muted active:scale-95 transition-all duration-200 hover:shadow-md"
          onClick={() => {
            // Fit map to show both user and destination
            console.log('Fit to bounds');
          }}
        >
          <Icon name="Maximize2" size={20} className="transition-transform duration-200 hover:scale-110" />
        </Button>
      </motion.div>
    </div>
  );
};

export default MapControls;