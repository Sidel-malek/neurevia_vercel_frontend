import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showAnimation?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className = '', 
  showAnimation = true 
}) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 ${className}`}>
      <div 
        className={`h-2.5 rounded-full transition-all duration-300 ease-out ${
          progress < 50 ? 'bg-blue-500' : 
          progress < 80 ? 'bg-blue-600' : 'bg-green-500'
        } ${showAnimation ? 'animate-pulse' : ''}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;