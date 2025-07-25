import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const MapControlCluster = ({ onZoomIn, onZoomOut, onRecenter, onToggleLayer, currentZoom = 15, maxZoom = 20, minZoom = 10 }) => {
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState('default');

  const handleZoomIn = () => {
    if (currentZoom < maxZoom) {
      onZoomIn?.();
    }
  };

  const handleZoomOut = () => {
    if (currentZoom > minZoom) {
      onZoomOut?.();
    }
  };

  const handleRecenter = () => {
    onRecenter?.();
  };

  const handleLayerChange = (layer) => {
    setActiveLayer(layer);
    onToggleLayer?.(layer);
    setIsLayerMenuOpen(false);
  };

  const toggleLayerMenu = () => {
    setIsLayerMenuOpen(!isLayerMenuOpen);
  };

  const layers = [
    { id: 'default', name: 'Default', icon: 'Map' },
    { id: 'satellite', name: 'Satellite', icon: 'Satellite' },
    { id: 'terrain', name: 'Terrain', icon: 'Mountain' },
    { id: 'buildings', name: 'Buildings', icon: 'Building' }
  ];

  return (
    <div className="map-controls">
      {/* Zoom Controls */}
      <div className="flex flex-col bg-surface rounded-lg shadow-floating overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className={`map-control-button rounded-none border-b border-border ${
            currentZoom >= maxZoom ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted active:animate-scale-tap'
          }`}
          onClick={handleZoomIn}
          disabled={currentZoom >= maxZoom}
        >
          <Icon name="Plus" size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`map-control-button rounded-none ${
            currentZoom <= minZoom ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted active:animate-scale-tap'
          }`}
          onClick={handleZoomOut}
          disabled={currentZoom <= minZoom}
        >
          <Icon name="Minus" size={20} />
        </Button>
      </div>

      {/* Recenter Control */}
      <Button
        variant="ghost"
        size="icon"
        className="map-control-button hover:bg-muted active:animate-scale-tap"
        onClick={handleRecenter}
      >
        <Icon name="Crosshair" size={20} />
      </Button>

      {/* Layer Control */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className={`map-control-button hover:bg-muted active:animate-scale-tap ${
            isLayerMenuOpen ? 'bg-muted' : ''
          }`}
          onClick={toggleLayerMenu}
        >
          <Icon name="Layers" size={20} />
        </Button>

        {/* Layer Menu */}
        {isLayerMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsLayerMenuOpen(false)}
            />
            <div className="absolute right-full top-0 mr-2 w-40 bg-popover border border-border rounded-lg shadow-modal z-50">
              <div className="py-1">
                {layers.map((layer) => (
                  <button
                    key={layer.id}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center transition-colors ${
                      activeLayer === layer.id ? 'bg-muted text-primary' : 'text-popover-foreground'
                    }`}
                    onClick={() => handleLayerChange(layer.id)}
                  >
                    <Icon name={layer.icon} size={16} className="mr-2" />
                    {layer.name}
                    {activeLayer === layer.id && (
                      <Icon name="Check" size={14} className="ml-auto text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Compass Control */}
      <Button
        variant="ghost"
        size="icon"
        className="map-control-button hover:bg-muted active:animate-scale-tap"
        onClick={() => {
          // Reset map rotation to north
          console.log('Reset compass to north');
        }}
      >
        <Icon name="Compass" size={20} />
      </Button>

      {/* Current Location Control */}
      <Button
        variant="ghost"
        size="icon"
        className="map-control-button hover:bg-muted active:animate-scale-tap bg-primary/10 text-primary"
        onClick={handleRecenter}
      >
        <Icon name="Navigation" size={20} />
      </Button>
    </div>
  );
};

export default MapControlCluster;