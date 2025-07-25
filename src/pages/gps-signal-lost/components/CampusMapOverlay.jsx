import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const CampusMapOverlay = ({ lastKnownPosition, onManualNavigation }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [userMarkerPosition, setUserMarkerPosition] = useState(null);

  useEffect(() => {
    if (lastKnownPosition) {
      // Convert GPS coordinates to SVG pixel coordinates using interpolation
      const pixelPosition = convertGPSToPixel(
        lastKnownPosition.lat, 
        lastKnownPosition.lng
      );
      setUserMarkerPosition(pixelPosition);
    }
  }, [lastKnownPosition]);

  const convertGPSToPixel = (lat, lng) => {
    // Linear interpolation between two anchor points
    const pixelTopLeft = { x: 132.75, y: 133.55, lat: 18.5271557, lng: 73.7276252 };
    const pixelBottomRight = { x: 2512.5, y: 3776.5, lat: 18.5180856, lng: 73.7339646 };

    const latRatio = (lat - pixelTopLeft.lat) / (pixelBottomRight.lat - pixelTopLeft.lat);
    const lngRatio = (lng - pixelTopLeft.lng) / (pixelBottomRight.lng - pixelTopLeft.lng);

    const x = pixelTopLeft.x + (pixelBottomRight.x - pixelTopLeft.x) * lngRatio;
    const y = pixelTopLeft.y + (pixelBottomRight.y - pixelTopLeft.y) * latRatio;

    return { x, y };
  };

  const handleMapLoad = () => {
    setMapLoaded(true);
    setMapError(false);
  };

  const handleMapError = () => {
    setMapError(true);
    setMapLoaded(false);
  };

  const handleManualNavigation = () => {
    onManualNavigation();
  };

  return (
    <div className="bg-surface rounded-lg overflow-hidden">
      {/* Map Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Map" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Campus Map</h3>
              <p className="text-sm text-muted-foreground">
                {lastKnownPosition ? 'Last known position shown' : 'Manual navigation available'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleManualNavigation}
            className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/90 transition-colors"
          >
            Browse Map
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-64 bg-muted">
        {!mapLoaded && !mapError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Icon name="Loader2" size={32} className="text-primary animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading campus map...</p>
            </div>
          </div>
        )}

        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Icon name="AlertTriangle" size={32} className="text-error mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Failed to load map</p>
              <button
                onClick={() => {
                  setMapError(false);
                  setMapLoaded(false);
                }}
                className="text-sm text-primary hover:text-primary/80"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* SVG Map */}
        <div className="relative w-full h-full overflow-hidden">
          <svg
            viewBox="0 0 2645 3910"
            className="w-full h-full object-contain opacity-60"
            onLoad={handleMapLoad}
            onError={handleMapError}
          >
            {/* Campus Map Background */}
            <image
              href="https://raw.githubusercontent.com/Jaycubic/FLAMECampusSVG/main/CampusMap.svg"
              width="2645"
              height="3910"
              onLoad={handleMapLoad}
              onError={handleMapError}
            />
            
            {/* Last Known Position Marker */}
            {userMarkerPosition && lastKnownPosition && (
              <g>
                {/* Accuracy Circle */}
                <circle
                  cx={userMarkerPosition.x}
                  cy={userMarkerPosition.y}
                  r={lastKnownPosition.accuracy * 2} // Scale accuracy to visible size
                  fill="rgba(59, 130, 246, 0.1)"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                
                {/* User Position Marker */}
                <circle
                  cx={userMarkerPosition.x}
                  cy={userMarkerPosition.y}
                  r="8"
                  fill="#3B82F6"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  opacity="0.8"
                />
                
                {/* Pulsing Animation */}
                <circle
                  cx={userMarkerPosition.x}
                  cy={userMarkerPosition.y}
                  r="12"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    values="8;20;8"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.6;0;0.6"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            )}
          </svg>

          {/* GPS Lost Overlay */}
          <div className="absolute inset-0 bg-error/10 flex items-center justify-center pointer-events-none">
            <div className="bg-surface/90 backdrop-blur-sm rounded-lg p-4 text-center">
              <Icon name="WifiOff" size={24} className="text-error mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">GPS Signal Lost</p>
              <p className="text-xs text-muted-foreground">
                Showing last known position
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Info" size={16} />
            <span>Tap and drag to explore the map manually</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors">
              <Icon name="ZoomIn" size={16} className="text-foreground" />
            </button>
            <button className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors">
              <Icon name="ZoomOut" size={16} className="text-foreground" />
            </button>
            <button className="w-8 h-8 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors">
              <Icon name="Maximize" size={16} className="text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusMapOverlay;