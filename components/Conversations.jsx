"use client";

import React, { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Invalid date
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (error) {
    return "";
  }
};

const Conversations = ({
  messages = [],
  isSending = false, // This prop might be redundant now but kept for compatibility
  conversationTitle = "New Conversation",
  conversationId,
  onTitleUpdate,
}) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  return (
    <div className="animate-slide-down-fade">
      <ChatHeader
        conversationTitle={conversationTitle}
        conversationId={conversationId}
        onTitleUpdate={onTitleUpdate}
      />

      {/* Chat Content */}
      <div className="flex-1 flex flex-col p-8 overflow-y-auto space-y-6">
        {messages.map((message, index) => (
          <React.Fragment key={index}>
            {/* Question (Human) */}
            {message.question?.value && (
              <div className="flex items-start space-x-3 justify-end">
                <div className="flex-1 max-w-3xl">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {message.question.value}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block text-right">
                    {formatDate(message.question.date)}
                  </span>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  H
                </div>
              </div>
            )}

            {/* Answer (AI) */}
            {message.answer && (
              <div className="flex items-start space-x-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  AI
                </div>
                <div className="flex-1 max-w-3xl">
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 min-h-[44px]">
                    {message.answer.isLoading ? (
                      <div className="flex items-center space-x-2 h-full">
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    ) : message.answer.isError ? (
                      <p className="text-red-500 whitespace-pre-wrap">
                        {message.answer.value}
                      </p>
                    ) : (
                      <p className="text-gray-800 whitespace-pre-wrap">
                        {message.answer.value}
                      </p>
                    )}
                  </div>
                  {!message.answer.isLoading && (
                    <span className="text-xs text-gray-500 mt-1 block">
                      {formatDate(message.answer.date)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Empty div for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Conversations;
