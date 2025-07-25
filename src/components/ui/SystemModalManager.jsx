import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const SystemModalManager = ({ 
  type = null, // 'permission', 'loading', 'error', 'success'
  title = '',
  message = '',
  isVisible = false,
  onClose,
  onAction,
  actionText = 'OK',
  showCancel = false,
  cancelText = 'Cancel',
  autoClose = false,
  autoCloseDelay = 3000
}) => {
  const [isOpen, setIsOpen] = useState(isVisible);

  useEffect(() => {
    setIsOpen(isVisible);
    
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleAction = () => {
    onAction?.();
    if (type !== 'loading') {
      handleClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && type !== 'loading') {
      handleClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getModalConfig = () => {
    switch (type) {
      case 'permission':
        return {
          icon: 'MapPin',
          iconColor: 'text-primary',
          iconBg: 'bg-primary/10',
          title: title || 'Location Permission Required',
          message: message || 'FLAME Campus Navigator needs access to your location to provide accurate navigation and directions.',
          actionText: actionText || 'Allow Location',
          showCancel: true,
          cancelText: cancelText || 'Not Now'
        };
      case 'loading':
        return {
          icon: 'Loader2',
          iconColor: 'text-primary',
          iconBg: 'bg-primary/10',
          title: title || 'Loading Campus Map',
          message: message || 'Please wait while we prepare your navigation experience...',
          showAction: false,
          showCancel: false,
          animate: true
        };
      case 'error':
        return {
          icon: 'AlertTriangle',
          iconColor: 'text-error',
          iconBg: 'bg-error/10',
          title: title || 'GPS Signal Lost',
          message: message || 'Unable to determine your location. Please check your GPS settings and try again.',
          actionText: actionText || 'Retry',
          showCancel: true,
          cancelText: cancelText || 'Cancel'
        };
      case 'success':
        return {
          icon: 'CheckCircle',
          iconColor: 'text-success',
          iconBg: 'bg-success/10',
          title: title || 'Navigation Ready',
          message: message || 'Your location has been found. You can now start navigating around campus.',
          actionText: actionText || 'Start Navigation',
          showCancel: false
        };
      default:
        return {
          icon: 'Info',
          iconColor: 'text-muted-foreground',
          iconBg: 'bg-muted',
          title: title || 'Information',
          message: message || 'Please review the information below.',
          actionText: actionText || 'OK',
          showCancel: showCancel
        };
    }
  };

  if (!isOpen) {
    return null;
  }

  const config = getModalConfig();

  return (
    <div className="system-modal-overlay" onClick={type !== 'loading' ? handleClose : undefined}>
      <div 
        className="system-modal-content animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 rounded-full ${config.iconBg} flex items-center justify-center`}>
            <Icon 
              name={config.icon} 
              size={32} 
              className={`${config.iconColor} ${config.animate ? 'animate-spin' : ''}`}
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-foreground mb-2">
          {config.title}
        </h2>

        {/* Message */}
        <p className="text-center text-muted-foreground mb-6 leading-relaxed">
          {config.message}
        </p>

        {/* Loading Progress (for loading type) */}
        {type === 'loading' && (
          <div className="mb-6">
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {config.showAction !== false && (
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            {config.showCancel && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                {config.cancelText}
              </Button>
            )}
            <Button
              variant="default"
              className="flex-1"
              onClick={handleAction}
              disabled={type === 'loading'}
            >
              {config.actionText}
            </Button>
          </div>
        )}

        {/* Close button for non-critical modals */}
        {type !== 'loading' && type !== 'permission' && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

// Preset modal components for common use cases
export const PermissionModal = ({ isVisible, onAllow, onDeny }) => (
  <SystemModalManager
    type="permission"
    isVisible={isVisible}
    onAction={onAllow}
    onClose={onDeny}
  />
);

export const LoadingModal = ({ isVisible, message }) => (
  <SystemModalManager
    type="loading"
    isVisible={isVisible}
    message={message}
  />
);

export const ErrorModal = ({ isVisible, title, message, onRetry, onClose }) => (
  <SystemModalManager
    type="error"
    isVisible={isVisible}
    title={title}
    message={message}
    onAction={onRetry}
    onClose={onClose}
    actionText="Retry"
  />
);

export const SuccessModal = ({ isVisible, title, message, onAction, actionText }) => (
  <SystemModalManager
    type="success"
    isVisible={isVisible}
    title={title}
    message={message}
    onAction={onAction}
    actionText={actionText}
    autoClose={true}
  />
);

export default SystemModalManager;