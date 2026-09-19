import React, { useEffect, useRef } from "react";
import { formatTimestamp } from "../utils/format";

export default function MessageList({ messages, currentUserId }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const sorted = [...messages].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  return (
    <div
      className="scroll-area"
      style={{ display: "flex", flexDirection: "column", gap: 10, padding: 16 }}
    >
      {sorted.length === 0 && (
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginTop: 24 }}>
          No messages yet. Say hello 👋
        </p>
      )}
      {sorted.map((msg) => {
        const isMine = msg.sender_id === currentUserId;
        return (
          <div
            key={msg.id}
            style={{
              alignSelf: isMine ? "flex-end" : "flex-start",
              maxWidth: "75%",
              display: "flex",
              flexDirection: "column",
              alignItems: isMine ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 16,
                borderBottomRightRadius: isMine ? 4 : 16,
                borderBottomLeftRadius: isMine ? 16 : 4,
                background: isMine ? "var(--accent-gradient)" : "var(--surface-alt)",
                color: "#fff",
                fontSize: 14,
                wordBreak: "break-word",
              }}
            >
              {msg.content}
            </div>
            <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
              {formatTimestamp(msg.created_at)}
            </span>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
