"use client";

import { useState } from "react";

// Dot animation component
const TypingDots = ({ className = "" }) => (
  <div className={`flex space-x-1 items-center ${className}`}>
    {[...Array(3)].map((_, i) => (
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

// Title loader component
const TitleLoader = ({ className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="h-6 w-48 bg-gray-200 rounded"></div>
  </div>
);

// Message bubble loader
const MessageBubbleLoader = ({ isAi = false, className = "" }) => (
  <div
    className={`flex items-start space-x-3 ${
      isAi ? "justify-start" : "justify-end"
    } ${className}`}
  >
    {isAi && (
      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex-shrink-0"></div>
    )}
    <div
      className={`rounded-lg p-4 max-w-3xl ${
        isAi ? "bg-gray-100" : "bg-blue-500 text-white"
      }`}
    >
      <TypingDots className="justify-start" />
    </div>
  </div>
);

// Main component
const Animation = ({
  type = "dots", // 'title', 'dots', 'message-ai', 'message-user'
  className = "",
}) => {
  const [show, setShow] = useState(true);

  // Handle animation timing if needed
  //   useEffect(() => {
  //     // Add any animation timing logic here if needed
  //     return () => setShow(false);
  //   }, []);

  if (!show) return null;

  switch (type) {
    case "title":
      return <TitleLoader className={className} />;
    case "dots":
      return <TypingDots className={className} />;
    case "message-ai":
      return <MessageBubbleLoader isAi={true} className={className} />;
    case "message-user":
      return <MessageBubbleLoader isAi={false} className={className} />;
    default:
      return <TypingDots className={className} />;
  }
};

export default Animation;
