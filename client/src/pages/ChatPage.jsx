import React, { useEffect, useRef, useState } from "react";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../context/AuthContext";
import { createChatSocket } from "../sockets/socket";

export default function ChatPage() {
  const { logout } = useAuth();
  const [activeConversationId, setActiveConversationId] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return undefined;

    socketRef.current = createChatSocket(token, {
      onMessage: (msg) => {
        // Route incoming messages to the active conversation's message list.
        console.log("New message", msg);
      },
    });

    return () => socketRef.current?.close();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ConversationList onSelect={setActiveConversationId} />
      <ChatWindow conversationId={activeConversationId} socket={socketRef.current} />
      <button onClick={logout}>Log Out</button>
    </div>
  );
}
