import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-medium border-b border-border safe-top">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Navigation" size={20} color="white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground leading-none">FLAME</span>
              <span className="text-xs text-muted-foreground leading-none">Campus Navigator</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Button
            variant="ghost"
            className="text-foreground hover:text-primary hover:bg-muted"
            onClick={() => window.location.href = '/campus-map-navigation'}
          >
            <Icon name="Map" size={18} className="mr-2" />
            Campus Map
          </Button>
          <Button
            variant="ghost"
            className="text-foreground hover:text-primary hover:bg-muted"
            onClick={() => window.location.href = '/navigation-active-mode'}
          >
            <Icon name="Navigation2" size={18} className="mr-2" />
            Navigation
          </Button>
          <Button
            variant="ghost"
            className="text-foreground hover:text-primary hover:bg-muted"
            onClick={() => window.location.href = '/location-permission-setup'}
          >
            <Icon name="MapPin" size={18} className="mr-2" />
            Location
          </Button>
          
          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              className="text-foreground hover:text-primary hover:bg-muted"
              onClick={toggleMenu}
            >
              <Icon name="MoreHorizontal" size={18} className="mr-2" />
              More
            </Button>
            
            {isMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={closeMenu}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-modal z-50">
                  <div className="py-1">
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted flex items-center"
                      onClick={() => {
                        window.location.href = '/campus-map-loading';
                        closeMenu();
                      }}
                    >
                      <Icon name="Loader2" size={16} className="mr-3" />
                      Loading Status
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted flex items-center"
                      onClick={() => {
                        window.location.href = '/gps-signal-lost';
                        closeMenu();
                      }}
                    >
                      <Icon name="WifiOff" size={16} className="mr-3" />
                      GPS Status
                    </button>
                    <div className="border-t border-border my-1" />
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted flex items-center"
                      onClick={closeMenu}
                    >
                      <Icon name="Settings" size={16} className="mr-3" />
                      Settings
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted flex items-center"
                      onClick={closeMenu}
                    >
                      <Icon name="HelpCircle" size={16} className="mr-3" />
                      Help
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-foreground hover:text-primary hover:bg-muted"
          onClick={toggleMenu}
        >
          <Icon name={isMenuOpen ? "X" : "Menu"} size={24} />
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" 
            onClick={closeMenu}
          />
          <div className="absolute top-full left-0 right-0 bg-surface border-b border-border shadow-modal z-50 md:hidden">
            <nav className="py-2">
              <button
                className="w-full px-4 py-3 text-left text-foreground hover:bg-muted flex items-center"
                onClick={() => {
                  window.location.href = '/campus-map-navigation';
                  closeMenu();
                }}
              >
                <Icon name="Map" size={20} className="mr-3" />
                Campus Map
              </button>
              <button
                className="w-full px-4 py-3 text-left text-foreground hover:bg-muted flex items-center"
                onClick={() => {
                  window.location.href = '/navigation-active-mode';
                  closeMenu();
                }}
              >
                <Icon name="Navigation2" size={20} className="mr-3" />
                Navigation
              </button>
              <button
                className="w-full px-4 py-3 text-left text-foreground hover:bg-muted flex items-center"
                onClick={() => {
                  window.location.href = '/location-permission-setup';
                  closeMenu();
                }}
              >
                <Icon name="MapPin" size={20} className="mr-3" />
                Location
              </button>
              
              <div className="border-t border-border my-2" />
              
              <button
                className="w-full px-4 py-3 text-left text-muted-foreground hover:bg-muted flex items-center"
                onClick={() => {
                  window.location.href = '/campus-map-loading';
                  closeMenu();
                }}
              >
                <Icon name="Loader2" size={20} className="mr-3" />
                Loading Status
              </button>
              <button
                className="w-full px-4 py-3 text-left text-muted-foreground hover:bg-muted flex items-center"
                onClick={() => {
                  window.location.href = '/gps-signal-lost';
                  closeMenu();
                }}
              >
                <Icon name="WifiOff" size={20} className="mr-3" />
                GPS Status
              </button>
              
              <div className="border-t border-border my-2" />
              
              <button
                className="w-full px-4 py-3 text-left text-muted-foreground hover:bg-muted flex items-center"
                onClick={closeMenu}
              >
                <Icon name="Settings" size={20} className="mr-3" />
                Settings
              </button>
              <button
                className="w-full px-4 py-3 text-left text-muted-foreground hover:bg-muted flex items-center"
                onClick={closeMenu}
              >
                <Icon name="HelpCircle" size={20} className="mr-3" />
                Help
              </button>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;