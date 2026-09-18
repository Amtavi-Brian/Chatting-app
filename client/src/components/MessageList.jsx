import React from "react";

export default function MessageList({ messages }) {
  return (
    <ul style={{ flex: 1, overflowY: "auto", listStyle: "none", padding: 8 }}>
      {messages.map((msg) => (
        <li key={msg.id}>
          <strong>{msg.sender_id}:</strong> {msg.content}
        </li>
      ))}
    </ul>
  );
}
