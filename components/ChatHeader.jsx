"use client";

import { useRouter } from "next/navigation";
import { useConversationDelete } from "@/hooks/useConversationDelete";
import { useConversationTitle } from "@/hooks/useConversationTitle";
import { ArrowLeft, Edit, MoreHorizontal, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

export default function ChatHeader({
  conversationTitle,
  conversationId,
  onTitleUpdate,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const { isModalOpen, requestDelete, handleConfirmDelete, handleCloseModal } =
    useConversationDelete();

  const {
    isEditing,
    newTitle,
    startEditing,
    cancelEditing,
    handleTitleChange,
    saveTitle,
    handleKeyDown,
  } = useConversationTitle(conversationTitle, conversationId, onTitleUpdate);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleRenameClick = () => {
    startEditing();
    setShowDropdown(false);
  };

  const handleDelete = () => {
    setShowDropdown(false);
    requestDelete(conversationId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="px-4 md:px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Back button - only visible on mobile */}
          <button 
            onClick={handleBackClick}
            className="md:hidden p-1 -ml-2 mr-1 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newTitle}
                onChange={handleTitleChange}
                onKeyDown={handleKeyDown}
                autoFocus
                className="text-lg font-semibold text-gray-800 bg-transparent border-b border-gray-400 focus:outline-none"
              />
              <button
                onClick={saveTitle}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={cancelEditing}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <h1 className="text-lg font-semibold text-gray-800">{newTitle}</h1>
          )}
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
              <button
                onClick={handleRenameClick}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Rename conversation</span>
              </button>
              <hr className="my-1 opacity-10" />
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete conversation</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Conversation"
        message="Are you sure you want to delete this conversation? This action cannot be undone."
      />
    </div>
  );
}
