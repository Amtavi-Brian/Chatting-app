import React, { useEffect, useState } from "react";
import apiClient from "../api/client";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

export default function ChatWindow({ conversationId, socket }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!conversationId) return;
    apiClient
      .get(`/conversations/${conversationId}/messages`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Failed to load messages", err));
  }, [conversationId]);

  function handleSend(content) {
    if (!conversationId) return;
    socket?.send({ conversation_id: conversationId, content, content_type: "text" });
  }

  if (!conversationId) {
    return (
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Select a conversation to start chatting.</p>
      </main>
    );
  }

  return (
    <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <MessageList messages={messages} />
      <MessageInput onSend={handleSend} />
    </main>
  );
}
