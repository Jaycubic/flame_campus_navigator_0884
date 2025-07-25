import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const LoadingSteps = ({ currentStep, steps, className = '' }) => {
  return (
    <div className={`w-full max-w-sm ${className}`}>
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isPending = index > currentStep;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive ? 'bg-primary/5 border border-primary/20' : 
                isCompleted ? 'bg-success/5' : 'bg-muted/50'
              }`}
            >
              {/* Step Icon */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                isCompleted ? 'bg-success text-white' : isActive ?'bg-primary text-white': 'bg-muted text-muted-foreground'
              }`}>
                {isCompleted ? (
                  <Icon name="Check" size={16} />
                ) : isActive ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Icon name="Loader2" size={16} />
                  </motion.div>
                ) : (
                  <Icon name={step.icon} size={16} />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  isActive ? 'text-primary' :
                  isCompleted ? 'text-success': 'text-muted-foreground'
                }`}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>

              {/* Loading Animation for Active Step */}
              {isActive && (
                <motion.div
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingSteps;