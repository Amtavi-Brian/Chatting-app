import React, { useState } from "react";

export default function MessageInput({ onSend }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        borderTop: "1px solid var(--border)",
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          background: "var(--surface-alt)",
          border: "1px solid var(--border)",
          borderRadius: 999,
          padding: "8px 14px",
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text)",
            fontSize: 14,
          }}
        />
      </div>
      <button
        type="submit"
        className="gradient-btn"
        disabled={!value.trim()}
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: value.trim() ? 1 : 0.5,
          flexShrink: 0,
        }}
      >
        ➤
      </button>
    </form>
  );
}
