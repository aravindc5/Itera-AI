import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Charting your course...",
  "Consulting local guides...",
  "Packing your virtual bags...",
  "Checking the weather forecast...",
  "Finding the best photo spots...",
  "Translating local greetings...",
  "Your next adventure is loading...",
];

const LoadingSpinner: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="text-6xl animate-spin">🌍</div>
      <p className="text-gray-800 text-lg font-medium">Building Your Itinerary</p>
      <p className="text-gray-600 text-sm transition-opacity duration-500 ease-in-out">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingSpinner;
