"use client";
import ChatArea from "@/components/ChatArea";
import InputArea from "@/components/InputArea";
import MessageAnimation from "@/components/MessageAnimation";
import { useCallback, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  const handleSendMessage = useCallback(async (message, isSending) => {
    if (isSending) {
      setIsLoading(true);
      setCurrentMessage(message);
    } else {
      // Message sending completed or failed
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <MessageAnimation message={currentMessage} />
        ) : (
          <ChatArea onSendMessage={handleSendMessage} />
        )}
      </div>

      <InputArea onSendMessage={handleSendMessage} />
    </div>
  );
}
