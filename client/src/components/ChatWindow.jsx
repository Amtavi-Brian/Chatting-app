import React, { useEffect, useState } from "react";
import apiClient from "../api/client";
import Avatar from "./Avatar";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { conversationIsOnline, conversationTitle } from "../utils/format";
import { markRead } from "../utils/readState";

export default function ChatWindow({ conversation, currentUserId, socket, onBack, onMessage }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const conversationId = conversation?.id;

  useEffect(() => {
    if (!conversationId) return;
    setLoading(true);
    apiClient
      .get(`/conversations/${conversationId}/messages`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Failed to load messages", err))
      .finally(() => setLoading(false));
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return undefined;
    return onMessage((msg) => {
      if (msg.conversation_id === conversationId) {
        setMessages((prev) => [...prev, msg]);
        markRead(conversationId, msg.created_at);
      }
    });
  }, [conversationId, onMessage]);

  useEffect(() => {
    if (conversationId && messages.length > 0) {
      markRead(conversationId, messages[messages.length - 1]?.created_at);
    }
  }, [conversationId, messages]);

  function handleSend(content) {
    if (!conversation) return;
    socket?.send({ conversation_id: conversation.id, content, content_type: "text" });
  }

  if (!conversation) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
        }}
      >
        Select a conversation to start chatting.
      </div>
    );
  }

  const title = conversationTitle(conversation, currentUserId);
  const online = conversationIsOnline(conversation, currentUserId);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <button className="icon-btn" onClick={onBack}>
          ←
        </button>
        <Avatar name={title} size={40} isOnline={online} isGroup={conversation.is_group} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {title}
          </div>
          <div style={{ fontSize: 12, color: online ? "var(--online)" : "var(--text-muted)" }}>
            {conversation.is_group ? `${conversation.participants.length} members` : online ? "Online" : "Offline"}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
          Loading messages...
        </div>
      ) : (
        <MessageList messages={messages} currentUserId={currentUserId} />
      )}
      <MessageInput onSend={handleSend} />
    </div>
  );
}
