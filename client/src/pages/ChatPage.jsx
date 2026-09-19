import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import apiClient from "../api/client";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { createChatSocket } from "../sockets/socket";
import { unreadCount } from "../utils/readState";

export default function ChatPage() {
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const socketRef = useRef(null);
  const listenersRef = useRef(new Set());

  const loadConversations = useCallback(() => {
    setLoading(true);
    return apiClient
      .get("/conversations")
      .then((res) => setConversations(res.data))
      .catch((err) => console.error("Failed to load conversations", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return undefined;

    socketRef.current = createChatSocket(token, {
      onMessage: (msg) => {
        // Bump the conversation preview/order and fan the message out to any
        // subscribed chat window.
        setConversations((prev) => {
          const next = prev.map((c) =>
            c.id === msg.conversation_id ? { ...c, last_message: msg } : c
          );
          next.sort((a, b) => {
            const at = new Date(a.last_message?.created_at || a.created_at);
            const bt = new Date(b.last_message?.created_at || b.created_at);
            return bt - at;
          });
          return next;
        });
        listenersRef.current.forEach((cb) => cb(msg));
      },
    });

    return () => socketRef.current?.close();
  }, []);

  const subscribe = useCallback((callback) => {
    listenersRef.current.add(callback);
    return () => listenersRef.current.delete(callback);
  }, []);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) || null,
    [conversations, activeConversationId]
  );

  const totalUnread = conversations.reduce((sum, c) => sum + unreadCount(c), 0);

  function handleCreated(conversation) {
    setConversations((prev) => [conversation, ...prev]);
    setActiveConversationId(conversation.id);
  }

  const showingChat = Boolean(activeConversationId);

  return (
    <div className="app-shell">
      <div className="phone-frame">
        {!showingChat ? (
          <>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <ConversationList
                conversations={conversations}
                loading={loading}
                currentUserId={user?.id}
                activeConversationId={activeConversationId}
                onSelect={setActiveConversationId}
                onCreated={handleCreated}
                showNewChat={showNewChat}
                onOpenNewChat={() => setShowNewChat(true)}
                onCloseNewChat={() => setShowNewChat(false)}
              />
            </div>
            <BottomNav
              active="chats"
              unread={totalUnread}
              onNavigate={(key) => {
                if (key === "profile") logout();
                if (key === "compose") setShowNewChat(true);
              }}
            />
          </>
        ) : (
          <div style={{ flex: 1, overflow: "hidden" }}>
            <ChatWindow
              conversation={activeConversation}
              currentUserId={user?.id}
              socket={socketRef.current}
              onBack={() => setActiveConversationId(null)}
              onMessage={subscribe}
            />
          </div>
        )}
      </div>
    </div>
  );
}
