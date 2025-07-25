"use client";
import { Zap } from "lucide-react";
import { useCallback } from "react";
import { useChatHandler } from "@/hooks/useChatHandler";

export default function Suggestions({ onSendMessage }) {
  const { handleSendMessage } = useChatHandler("suggestion");
  
  const promptSuggestions = [
    "It looks like you're writing an email, would you like help drafting it?",
    "Can you summarize this article for me?",
    "Analyze this month's sales performance",
  ];

  const handleSuggestionClick = useCallback(async (suggestion) => {
    if (onSendMessage) {
      try {
        // Notify parent that we're sending a suggestion
        await onSendMessage(suggestion, true);
        
        // Use the handler from useChatHook
        await handleSendMessage(null, suggestion);
        
        // Notify parent that sending is complete
        await onSendMessage(suggestion, false);
      } catch (error) {
        console.error("Error handling suggestion:", error);
        // Notify parent about the error
        await onSendMessage("", false);
      }
    }
  }, [onSendMessage, handleSendMessage]);

  return (
    <div className="space-y-3 w-full max-w-2xl">
      {promptSuggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => handleSuggestionClick(suggestion)}
          className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer text-left"
        >
          <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <span className="text-gray-700">{suggestion}</span>
        </button>
      ))}
    </div>
  );
}
