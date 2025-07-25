import React from 'react';
import Icon from '../../../components/AppIcon';

const LocationIllustration = () => {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative">
        {/* Phone Frame */}
        <div className="w-48 h-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-2 shadow-2xl">
          {/* Screen */}
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl relative overflow-hidden">
            {/* Campus Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-green-50">
              {/* Map Grid Lines */}
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#3B82F6" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
              
              {/* Campus Buildings */}
              <div className="absolute top-6 left-4 w-8 h-6 bg-blue-200 rounded-sm opacity-60"></div>
              <div className="absolute top-12 right-6 w-6 h-8 bg-blue-200 rounded-sm opacity-60"></div>
              <div className="absolute bottom-16 left-6 w-10 h-4 bg-blue-200 rounded-sm opacity-60"></div>
              <div className="absolute bottom-8 right-4 w-6 h-6 bg-blue-200 rounded-sm opacity-60"></div>
            </div>
            
            {/* Location Pin */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                {/* Pin Shadow */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-black/20 rounded-full blur-sm"></div>
                
                {/* Pulsing Circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary/20 rounded-full animate-ping"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary/30 rounded-full animate-pulse"></div>
                
                {/* Location Pin */}
                <div className="relative z-10 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Icon name="MapPin" size={16} color="white" />
                </div>
              </div>
            </div>
            
            {/* GPS Signal Waves */}
            <div className="absolute top-4 right-4">
              <div className="relative">
                <div className="w-1 h-1 bg-success rounded-full"></div>
                <div className="absolute -top-1 -left-1 w-3 h-3 border-2 border-success rounded-full animate-ping opacity-75"></div>
                <div className="absolute -top-2 -left-2 w-5 h-5 border-2 border-success rounded-full animate-ping opacity-50" style={{animationDelay: '0.5s'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Location Icon */}
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-xl animate-bounce">
          <Icon name="Navigation" size={24} color="white" />
        </div>
      </div>
    </div>
  );
};

export default LocationIllustration;