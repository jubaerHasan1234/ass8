"use client";

import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useConversationDelete } from "../hooks/useConversationDelete";
import { useConversationTitle } from "../hooks/useConversationTitle";
import ConfirmationModal from "./ConfirmationModal";
import Portal from "./Portal";
export default function SidebarConversationItem({
  conversation,
  onEdit,
  onDelete,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [editing, setEditing] = useState(false);

  // Always use the latest title from props unless editing
  const {
    isEditing,
    newTitle,
    startEditing,
    cancelEditing,
    handleTitleChange,
    handleKeyDown,
  } = useConversationTitle(
    conversation.title,
    conversation.id,
    (updatedTitle) => {
      setEditing(false);
      if (onEdit) onEdit(updatedTitle);
    }
  );

  // Hook for delete
  const { isModalOpen, requestDelete, handleConfirmDelete, handleCloseModal } =
    useConversationDelete();
  function handleDelete() {
    handleConfirmDelete();
    if (onDelete) onDelete();
  }
  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu || editing) {
      setEditing(false);
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu, editing]);

  return (
    <div className="relative group flex items-center px-2 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
      <Link
        href={`/conversation/${conversation.id}`}
        className="flex-1 flex items-center space-x-3 min-w-0"
        tabIndex={-1}
      >
        {editing || isEditing ? (
          <input
            className="bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-zinc-200 focus:outline-none w-full"
            value={newTitle}
            onChange={handleTitleChange}
            onKeyDown={handleKeyDown}
            autoFocus
            onBlur={cancelEditing}
          />
        ) : (
          <span className="truncate text-sm text-zinc-300">
            {conversation.title}
          </span>
        )}
      </Link>
      <button
        className="ml-2 p-1 rounded hover:bg-gray-700"
        onClick={() => setShowMenu((v) => !v)}
        aria-label="Show menu"
        tabIndex={0}
      >
        <MoreHorizontal size={18} />
      </button>
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 top-8 z-20 bg-gray-800 border border-gray-700 rounded shadow-lg w-32"
        >
          <button
            className="flex items-center w-full px-3 py-2 hover:bg-gray-700 text-sm text-zinc-100"
            onClick={() => {
              setShowMenu(false);
              setEditing(true);
              startEditing();
            }}
          >
            <Edit className="w-4 h-4 mr-2" /> Edit
          </button>
          <button
            className="flex items-center w-full px-3 py-2 hover:bg-gray-700 text-sm text-red-400"
            onClick={() => {
              setShowMenu(false);
              requestDelete(conversation.id);
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </button>
        </div>
      )}
      {/* Confirmation Modal for Delete */}
      {isModalOpen && (
        <Portal>
          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleDelete}
            title="Delete Conversation"
            message="Are you sure you want to delete this conversation? This action cannot be undone."
          />
        </Portal>
      )}
    </div>
  );
}
//
