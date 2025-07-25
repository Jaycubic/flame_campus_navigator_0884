import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const DestinationPanel = ({ 
  userLocation, 
  destination, 
  distance,
  onStartNavigation, 
  onClearDestination,
  isNavigating,
  onCancelNavigation 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(null);

  // Campus locations for search suggestions
  const campusLocations = [
    { name: "Main Academic Block", description: "Central academic building", lat: 18.5226207, lng: 73.7307949 },
    { name: "Library", description: "Central library and study area", lat: 18.5230157, lng: 73.7305252 },
    { name: "Student Hostel", description: "Residential accommodation", lat: 18.5235557, lng: 73.7315252 },
    { name: "Cafeteria", description: "Main dining facility", lat: 18.5228207, lng: 73.7310949 },
    { name: "Sports Complex", description: "Athletic facilities", lat: 18.5220207, lng: 73.7320949 },
    { name: "Auditorium", description: "Main event venue", lat: 18.5232207, lng: 73.7302949 },
    { name: "Admin Block", description: "Administrative offices", lat: 18.5234207, lng: 73.7308949 },
    { name: "Medical Center", description: "Campus health services", lat: 18.5225207, lng: 73.7312949 }
  ];

  const [filteredLocations, setFilteredLocations] = useState([]);

  // Calculate estimated walking time
  useEffect(() => {
    if (distance) {
      // Average walking speed: 5 km/h = 1.39 m/s
      const walkingSpeed = 1.39; // meters per second
      const timeInSeconds = distance / walkingSpeed;
      setEstimatedTime(timeInSeconds);
    }
  }, [distance]);

  // Filter locations based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = campusLocations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  }, [searchQuery]);

  const formatDistance = (dist) => {
    if (!dist) return '--';
    if (dist < 1000) {
      return `${Math.round(dist)}m`;
    }
    return `${(dist / 1000).toFixed(1)}km`;
  };

  const formatTime = (time) => {
    if (!time) return '--';
    if (time < 60) {
      return `${Math.round(time)}s`;
    }
    const minutes = Math.round(time / 60);
    return `${minutes} min`;
  };

  const handleLocationSelect = (location) => {
    setSearchQuery(location.name);
    setFilteredLocations([]);
    // Simulate setting destination
    console.log('Selected location:', location);
  };

  const togglePanel = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {/* Floating Search Button */}
      {!destination && !isExpanded && (
        <motion.div
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="default"
            className="bg-primary text-primary-foreground shadow-lg rounded-full px-6 py-3 hover:shadow-xl"
            onClick={togglePanel}
          >
            <Icon name="Search" size={20} className="mr-2" />
            Search campus locations
          </Button>
        </motion.div>
      )}

      {/* Destination Panel */}
      <AnimatePresence>
        {(isExpanded || destination) && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-border shadow-critical safe-bottom"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-2">
                <Icon name="MapPin" size={20} className="text-primary" />
                <span className="font-medium text-foreground">
                  {destination ? 'Destination Selected' : 'Find Location'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (destination) {
                    onClearDestination?.();
                  } else {
                    setIsExpanded(false);
                  }
                }}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>

            {/* Panel Content */}
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {!destination ? (
                <>
                  {/* Search Input */}
                  <Input
                    type="search"
                    placeholder="Search for buildings, facilities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />

                  {/* Search Results */}
                  {filteredLocations.length > 0 && (
                    <div className="space-y-2">
                      {filteredLocations.map((location, index) => (
                        <button
                          key={index}
                          className="w-full text-left p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                          onClick={() => handleLocationSelect(location)}
                        >
                          <div className="flex items-start space-x-3">
                            <Icon name="MapPin" size={16} className="text-muted-foreground mt-1" />
                            <div>
                              <h4 className="font-medium text-foreground">{location.name}</h4>
                              <p className="text-sm text-muted-foreground">{location.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Popular Locations */}
                  {!searchQuery && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                        Popular Locations
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {campusLocations.slice(0, 6).map((location, index) => (
                          <button
                            key={index}
                            className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-left"
                            onClick={() => handleLocationSelect(location)}
                          >
                            <div className="text-sm font-medium text-foreground">{location.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Current Location */}
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium text-foreground">Your Location</div>
                      <div className="text-xs text-muted-foreground">
                        {userLocation ? 'GPS location acquired' : 'Acquiring GPS location...'}
                      </div>
                    </div>
                  </div>

                  {/* Route Line */}
                  <div className="flex justify-center">
                    <div className="w-px h-8 bg-border"></div>
                  </div>

                  {/* Destination */}
                  <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg">
                    <Icon name="MapPin" size={16} className="text-accent" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">{destination.name || 'Selected Location'}</div>
                      <div className="text-xs text-muted-foreground">Tap location on map</div>
                    </div>
                  </div>

                  {/* Distance and Time */}
                  {distance && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold text-foreground font-mono">
                          {formatDistance(distance)}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">
                          Distance
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-lg font-bold text-foreground font-mono">
                          {formatTime(estimatedTime)}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">
                          Walking Time
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Controls */}
                  <div className="flex space-x-3">
                    {!isNavigating ? (
                      <Button
                        variant="default"
                        className="flex-1 bg-primary text-primary-foreground"
                        onClick={onStartNavigation}
                        disabled={!userLocation}
                      >
                        <Icon name="Navigation" size={16} className="mr-2" />
                        Start Navigation
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={onCancelNavigation}
                      >
                        <Icon name="X" size={16} className="mr-2" />
                        Cancel Navigation
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={onClearDestination}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DestinationPanel;