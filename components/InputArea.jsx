"use client";

import { useChatHandler } from "@/hooks/useChatHandler";
import { ArrowRight, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback } from "react";

const InputArea = ({ onSendMessage, messageSubmitting }) => {
  const maxLength = 1000;
  const params = useParams();
  const { inputValue, setInputValue, isSubmitting, handleSendMessage } =
    useChatHandler("prompt");

  const handleInputChange = useCallback(
    (e) => {
      setInputValue(e.target.value);
    },
    [setInputValue]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!inputValue.trim()) return;

      if (onSendMessage) {
        onSendMessage(inputValue, true, setInputValue);
        try {
          if (params?.id) {
            return;
          } else {
            await handleSendMessage();
          }
          setInputValue("");
        } catch (error) {
          console.error("Error sending message:", error);
        } finally {
          onSendMessage("", false);
        }
      }
    },
    [inputValue, onSendMessage, handleSendMessage, params?.id, setInputValue]
  );

  const memoizedHandleSubmit = useCallback(
    (e) => {
      handleSubmit(e);
    },
    [handleSubmit]
  );

  return (
    <div className="p-6 border-t border-gray-200">
      <form onSubmit={memoizedHandleSubmit} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            maxLength={maxLength}
            disabled={isSubmitting || messageSubmitting}
            className="w-full p-4 pr-20 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-70 disabled:cursor-not-allowed"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <button
              type="button"
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <Sparkles className="w-5 h-5 text-purple-500" />
            </button>
          </div>
        </div>
        <div className="flex items-end justify-end mt-3">
          <div className="flex items-end space-x-4">
            <span className="text-sm text-gray-500">
              {inputValue.length}/{maxLength}
            </span>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                inputValue.trim() && !isSubmitting && !messageSubmitting
                  ? "bg-black hover:bg-gray-800 text-white cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!inputValue.trim() || isSubmitting || messageSubmitting}
            >
              <span className="text-sm">
                {isSubmitting || messageSubmitting ? "Sending..." : "Send"}
              </span>
              {!isSubmitting && !messageSubmitting && (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputArea;
