"use client";

import Conversations from "@/components/Conversations";
import InputArea from "@/components/InputArea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConversationPage({ params }) {
  const [conversation, setConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const router = useRouter();

  const handleTitleUpdate = (newTitle) => {
    setConversation((prev) => ({ ...prev, title: newTitle }));
  };

  // Fetch conversation data when component mounts or params.id changes
  useEffect(() => {
    const fetchConversation = async () => {
      if (!params?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/conversations/${params.id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch conversation");
        }

        const { data } = await response.json();
        setConversation(data);
        setMessages(data.data || []);
      } catch (err) {
        console.error("Error fetching conversation:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversation();

    // Listen for conversation refresh events
    const handleRefresh = () => fetchConversation();
    window.addEventListener("conversations:refresh", handleRefresh);

    return () =>
      window.removeEventListener("conversations:refresh", handleRefresh);
  }, [params.id]);

  const handleSendMessage = async (message, isSubmitting, setInputValue) => {
    if (!message.trim() || isSending) return;

    try {
      setIsSending(true);

      // Add user message to the UI immediately for better UX
      const userMessage = {
        question: {
          value: message,
          date: new Date().toISOString(),
        },
        answer: {
          value: "",
          date: new Date().toISOString(),
          isLoading: true,
        },
      };

      setMessages((prev) => [...prev, userMessage]);

      // Send message to the API
      const response = await fetch(`/api/conversations/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const { data } = await response.json();

      // Update the messages with the server response
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0) {
          updated[lastIndex] = {
            ...updated[lastIndex],
            answer: {
              ...updated[lastIndex].answer,
              value: data.answer.value,
              date: data.answer.date,
              isLoading: false,
            },
          };
        }
        return updated;
      });

      // Refresh the conversation data to stay in sync
      const convResponse = await fetch(`/api/conversations/${params.id}`);
      if (convResponse.ok) {
        const { data: convData } = await convResponse.json();
        setConversation(convData);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");

      // Update the UI to show error state
      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0) {
          updated[lastIndex] = {
            ...updated[lastIndex],
            answer: {
              ...updated[lastIndex].answer,
              value: "Failed to send message. Please try again.",
              date: new Date().toISOString(),
              isError: true,
            },
          };
        }
        return updated;
      });
    } finally {
      setInputValue("");
      setIsSending(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500 p-4">
        <p className="text-lg font-medium mb-2">Error loading conversation</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <Conversations
            messages={messages}
            isSending={isSending}
            conversationTitle={conversation?.title || "New Conversation"}
            conversationId={params.id}
            onTitleUpdate={handleTitleUpdate}
          />
        )}
      </div>

      <InputArea
        onSendMessage={handleSendMessage}
        messageSubmitting={isSending}
      />
    </div>
  );
}
