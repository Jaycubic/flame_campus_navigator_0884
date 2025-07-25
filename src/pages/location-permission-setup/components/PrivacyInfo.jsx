import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PrivacyInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const privacyPoints = [
    {
      icon: "Shield",
      title: "Local Processing Only",
      description: "Your location data is processed entirely on your device and never sent to external servers."
    },
    {
      icon: "Eye",
      title: "No Tracking",
      description: "We don't track your movements or store your location history anywhere."
    },
    {
      icon: "Lock",
      title: "Secure Connection",
      description: "All location requests use secure HTTPS connections for your protection."
    },
    {
      icon: "UserX",
      title: "No Personal Data",
      description: "No personal information is collected or associated with your location data."
    }
  ];

  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between p-4 h-auto text-left"
      >
        <div className="flex items-center space-x-3">
          <Icon name="Shield" size={20} className="text-success" />
          <span className="font-medium text-foreground">Privacy & Security Information</span>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground transition-transform duration-200"
        />
      </Button>
      
      {isExpanded && (
        <div className="mt-4 p-4 bg-success/5 border border-success/20 rounded-lg space-y-4 animate-slide-up">
          <p className="text-sm text-muted-foreground mb-4">
            Your privacy is our priority. Here's how we protect your location data:
          </p>
          
          {privacyPoints.map((point, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name={point.icon} size={16} className="text-success" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">{point.title}</h4>
                <p className="text-sm text-muted-foreground">{point.description}</p>
              </div>
            </div>
          ))}
          
          <div className="pt-4 border-t border-success/20">
            <div className="flex items-center space-x-2 text-sm text-success">
              <Icon name="CheckCircle" size={16} />
              <span className="font-medium">FLAME University Certified Privacy Standards</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyInfo;