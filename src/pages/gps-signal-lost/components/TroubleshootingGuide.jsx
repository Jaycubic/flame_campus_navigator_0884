import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TroubleshootingGuide = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const troubleshootingSteps = [
    {
      id: 'location',
      icon: 'MapPin',
      title: 'Check Your Location',
      description: 'GPS signals work best outdoors with clear sky view',
      details: [
        'Move to an outdoor area if you\'re inside a building',
        'Avoid areas with tall buildings or dense tree cover',
        'GPS accuracy improves significantly in open spaces',
        'Indoor navigation may require manual map browsing'
      ]
    },
    {
      id: 'settings',
      icon: 'Settings',
      title: 'Device Settings',
      description: 'Ensure location services are properly configured',
      details: [
        'Check that location services are enabled for your browser',
        'Allow high accuracy GPS mode in device settings',
        'Disable battery optimization for location services',
        'Restart location services if recently changed'
      ]
    },
    {
      id: 'environment',
      icon: 'Cloud',
      title: 'Environmental Factors',
      description: 'Weather and surroundings can affect GPS signals',
      details: [
        'Heavy cloud cover or storms may weaken GPS signals',
        'Metal structures and buildings can block satellite signals',
        'Underground areas have limited GPS connectivity',
        'Wait a few minutes for signal to stabilize'
      ]
    },
    {
      id: 'device',
      icon: 'Smartphone',
      title: 'Device Issues',
      description: 'Hardware or software problems may affect GPS',
      details: [
        'Restart your device to refresh GPS connections',
        'Update your browser to the latest version',
        'Clear browser cache and location data',
        'Check if other location-based apps are working'
      ]
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div className="bg-surface rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
          <Icon name="HelpCircle" size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Troubleshooting Guide</h3>
          <p className="text-sm text-muted-foreground">
            Common solutions for GPS connectivity issues
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {troubleshootingSteps.map((step) => (
          <div key={step.id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(step.id)}
              className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name={step.icon} size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                <Icon 
                  name={expandedSection === step.id ? "ChevronUp" : "ChevronDown"} 
                  size={20} 
                  className="text-muted-foreground transition-transform duration-200"
                />
              </div>
            </button>

            {expandedSection === step.id && (
              <div className="px-4 pb-4 animate-slide-up">
                <div className="pl-11 space-y-2">
                  {step.details.map((detail, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="mt-6 bg-accent/5 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground mb-2">Quick Tip</h4>
            <p className="text-sm text-muted-foreground">
              For the best GPS experience on FLAME campus, use the app in outdoor areas 
              between buildings. The central courtyard and main pathways typically have 
              the strongest GPS signals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TroubleshootingGuide;