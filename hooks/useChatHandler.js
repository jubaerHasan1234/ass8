"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function useChatHandler(status) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = async (conversationId = null, text = null) => {
    setIsSubmitting(true);

    try {
      setIsSubmitting(true);
      const convResponse = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
          questionDate: new Date().toISOString(),
          text: text || inputValue,
        }),
      });

      const data = await convResponse.json();

      if (!convResponse.ok) {
        throw new Error("Failed to create conversation");
      } else {
        const id = data.id;
        router.push(`/conversation/${id}`);
        setInputValue("");
      }
    } catch (error) {
      console.error("Error:", error);
      // Optional: Add toast or UI feedback
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    inputValue,
    setInputValue,
    isSubmitting,
    handleSendMessage,
  };
}
