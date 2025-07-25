import React from 'react';
import Icon from '../../../components/AppIcon';

const PermissionBenefits = () => {
  const benefits = [
    {
      icon: "Navigation2",
      title: "Real-time Positioning",
      description: "See your exact location on the campus map with GPS accuracy"
    },
    {
      icon: "Route",
      title: "Turn-by-turn Guidance",
      description: "Get step-by-step directions to any building or facility"
    },
    {
      icon: "Bell",
      title: "Arrival Notifications",
      description: "Receive alerts when you reach your destination"
    },
    {
      icon: "Shield",
      title: "Privacy Protected",
      description: "Your location data stays on your device and is never stored"
    }
  ];

  return (
    <div className="space-y-4 mb-8">
      {benefits.map((benefit, index) => (
        <div key={index} className="flex items-start space-x-4 p-4 bg-surface rounded-lg border border-border">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name={benefit.icon} size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground mb-1">{benefit.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PermissionBenefits;