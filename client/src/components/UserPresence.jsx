import React from "react";

export default function UserPresence({ isOnline }) {
  return (
    <span style={{ color: isOnline ? "green" : "gray" }}>
      {isOnline ? "Online" : "Offline"}
    </span>
  );
}
