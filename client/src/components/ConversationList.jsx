import React, { useEffect, useState } from "react";
import apiClient from "../api/client";

export default function ConversationList({ onSelect }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    apiClient
      .get("/conversations")
      .then((res) => setConversations(res.data))
      .catch((err) => console.error("Failed to load conversations", err));
  }, []);

  return (
    <aside style={{ width: 250, borderRight: "1px solid #ddd" }}>
      <h2>Conversations</h2>
      <ul>
        {conversations.map((c) => (
          <li key={c.id}>
            <button onClick={() => onSelect(c.id)}>Conversation #{c.id}</button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
