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
    <form onSubmit={handleSubmit} style={{ display: "flex", padding: 8 }}>
      <input
        style={{ flex: 1 }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type a message..."
      />
      <button type="submit">Send</button>
    </form>
  );
}
