"use client";

import logo from "@/public/logo.svg"; // Your logo path
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import getAllPromptConversations from "../lib/getAllPromptConversations";
import SidebarConversationItem from "./SidebarConversationItem";

export default function Sidebar() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const convos = await getAllPromptConversations();
        setConversations(convos);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();

    const handleRefresh = () => fetchConversations();
    window.addEventListener("conversations:refresh", handleRefresh);

    return () =>
      window.removeEventListener("conversations:refresh", handleRefresh);
  }, [params.id]);

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <span className="font-semibold text-sm">CognitionX</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-400">
        <div className="space-y-1">
          <Link
            href="/"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Create Chat</span>
          </Link>
        </div>

        {/* Conversations */}
        <div className="pt-4">
          <span className="text-gray-500 text-xs uppercase font-semibold">
            Conversations
          </span>
          <div className="space-y-1 mt-3">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="flex space-x-2">
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
              </div>
            ) : conversations.length > 0 ? (
              conversations.map((conversation) => (
                <SidebarConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  onEdit={(updatedTitle) => {
                    setConversations((convs) =>
                      convs.map((c) =>
                        c.id === conversation.id
                          ? { ...c, title: updatedTitle }
                          : c
                      )
                    );
                  }}
                  onDelete={() => {
                    setConversations((convs) =>
                      convs.filter((c) => c.id !== conversation.id)
                    );
                  }}
                />
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center py-2">
                No conversations yet
              </p>
            )}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 mt-auto">
        <div className="text-center ">
          <span className="text-xs text-gray-400">Powered by</span>
          <div className="flex items-center justify-center pt-2 pb-2">
            <>
              <Image
                src={logo}
                alt="Logo"
                // fill
                className="h-10 w-auto"
                sizes="112px"
                priority
              />
            </>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
