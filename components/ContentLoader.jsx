"use client";

import { useEffect, useState } from "react";

const ContentLoader = ({
  type = "text", // 'text' | 'bubble' | 'dots'
  lines = 1,      // Number of text lines or bubbles
  className = "", // Additional classes
  isAi = false,   // For bubble type, true for AI, false for user
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  // Text line loader
  const TextLine = ({ width = "100%" }) => (
    <div 
      className="h-4 bg-gray-200 rounded animate-pulse mb-2"
      style={{ width }}
    />
  );

  // Typing dots
  const TypingDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{
            animationDelay: `${i * 150}ms`,
            animationDuration: "1s",
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </div>
  );

  // Message bubble
  const Bubble = ({ isAi }) => (
    <div className={`flex ${isAi ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`rounded-lg p-3 max-w-xs ${
          isAi ? 'bg-gray-100' : 'bg-blue-500 text-white'
        }`}
      >
        <TypingDots />
      </div>
    </div>
  );

  // Render based on type
  const renderContent = () => {
    switch (type) {
      case 'text':
        return (
          <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
              <TextLine 
                key={i} 
                width={i === lines - 1 && lines > 1 ? '80%' : '100%'}
              />
            ))}
          </div>
        );
      
      case 'bubble':
        return (
          <div className={className}>
            {Array.from({ length: lines }).map((_, i) => (
              <Bubble key={i} isAi={isAi} />
            ))}
          </div>
        );
      
      case 'dots':
        return (
          <div className={className}>
            <TypingDots />
          </div>
        );
      
      default:
        return null;
    }
  };

  return renderContent();
};

export default ContentLoader;
