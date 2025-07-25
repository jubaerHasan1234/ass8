"use client";

import { useRouter } from "next/navigation";
import { useState } from 'react';

export const useConversationDelete = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conversationIdToDelete, setConversationIdToDelete] = useState(null);

  const requestDelete = (conversationId) => {
    setConversationIdToDelete(conversationId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setConversationIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!conversationIdToDelete) return;

    try {
      const res = await fetch(`/api/conversations/${conversationIdToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete conversation");
      }

      router.push("/");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      alert("Failed to delete conversation. Please try again.");
    } finally {
      handleCloseModal();
    }
  };

  return {
    isModalOpen,
    requestDelete,
    handleConfirmDelete,
    handleCloseModal,
  };
};
