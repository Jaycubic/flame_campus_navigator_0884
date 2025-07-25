import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TroubleshootingGuide = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const troubleshootingSteps = [
    {
      browser: 'Chrome',
      steps: [
        'Click the location icon in the address bar',
        'Select "Always allow" for location access',
        'Refresh the page and try again'
      ]
    },
    {
      browser: 'Safari',
      steps: [
        'Go to Safari > Preferences > Websites',
        'Click on Location in the left sidebar',
        'Set this website to "Allow"'
      ]
    },
    {
      browser: 'Firefox',
      steps: [
        'Click the shield icon in the address bar',
        'Click "Turn off Blocking for This Site"',
        'Reload the page'
      ]
    },
    {
      browser: 'Mobile',
      steps: [
        'Open your device Settings',
        'Go to Privacy & Security > Location Services',
        'Enable location for your browser app'
      ]
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
          <Icon name="HelpCircle" size={20} className="text-primary" />
          <span className="font-medium text-foreground">Need help enabling location?</span>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground transition-transform duration-200"
        />
      </Button>
      
      {isExpanded && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-6 animate-slide-up">
          <p className="text-sm text-muted-foreground">
            Follow these browser-specific steps to enable location access:
          </p>
          
          {troubleshootingSteps.map((guide, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium text-foreground flex items-center space-x-2">
                <Icon name="Monitor" size={16} className="text-primary" />
                <span>{guide.browser}</span>
              </h4>
              <ol className="list-decimal list-inside space-y-1 ml-6">
                {guide.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="text-sm text-muted-foreground">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
          
          <div className="pt-4 border-t border-border">
            <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg">
              <Icon name="Info" size={16} className="text-primary mt-0.5" />
              <div className="text-sm">
                <p className="text-foreground font-medium mb-1">Still having trouble?</p>
                <p className="text-muted-foreground">
                  Make sure your device's location services are enabled and you're using a supported browser.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TroubleshootingGuide;