"use client";

import { useEffect, useState } from "react";

export const useConversationTitle = (
  initialTitle,
  conversationId,
  onTitleUpdate
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(initialTitle);

  useEffect(() => {
    setNewTitle(initialTitle);
  }, [initialTitle]);

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setNewTitle(initialTitle);
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const saveTitle = async () => {
    if (newTitle.trim() === "" || newTitle === initialTitle) {
      setIsEditing(false);
      setNewTitle(initialTitle);
      return;
    }

    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!response.ok) {
        throw new Error("Failed to update title");
      }

      if (onTitleUpdate) {
        onTitleUpdate(newTitle);
      }
      window.dispatchEvent(new Event("conversations:refresh"));
    } catch (error) {
      console.error("Failed to rename conversation:", error);
      setNewTitle(initialTitle); // Revert on error
    } finally {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveTitle();
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  return {
    isEditing,
    newTitle,
    startEditing,
    cancelEditing,
    handleTitleChange,
    saveTitle,
    handleKeyDown,
  };
};
