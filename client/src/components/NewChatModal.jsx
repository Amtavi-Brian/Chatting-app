import React, { useEffect, useState } from "react";
import apiClient from "../api/client";
import Avatar from "./Avatar";

export default function NewChatModal({ onClose, onCreated, currentUserId }) {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get("/users")
      .then((res) => setUsers(res.data.filter((u) => u.id !== currentUserId)))
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, [currentUserId]);

  function toggle(id) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleCreate() {
    if (selected.length === 0) return;
    setCreating(true);
    setError("");
    try {
      const { data } = await apiClient.post("/conversations", {
        is_group: selected.length > 1,
        participant_ids: selected,
      });
      onCreated(data);
    } catch (err) {
      setError("Could not start conversation");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "flex-end",
        zIndex: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxHeight: "70%",
          background: "var(--surface)",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>New chat</h2>
          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        {error && <p style={{ color: "var(--accent-2)", margin: 0 }}>{error}</p>}
        <div className="scroll-area" style={{ maxHeight: 320 }}>
          {loading && <p style={{ color: "var(--text-muted)" }}>Loading users...</p>}
          {!loading && users.length === 0 && (
            <p style={{ color: "var(--text-muted)" }}>No other users found.</p>
          )}
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => toggle(u.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 6px",
                background: selected.includes(u.id) ? "var(--surface-alt)" : "transparent",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <Avatar name={u.username} size={38} isOnline={u.is_online} />
              <span style={{ flex: 1 }}>{u.username}</span>
              {selected.includes(u.id) && <span style={{ color: "var(--accent-1)" }}>✓</span>}
            </button>
          ))}
        </div>
        <button
          className="gradient-btn"
          disabled={selected.length === 0 || creating}
          onClick={handleCreate}
          style={{ padding: "12px 0", opacity: selected.length === 0 || creating ? 0.6 : 1 }}
        >
          {creating ? "Starting..." : `Start chat${selected.length > 1 ? " (group)" : ""}`}
        </button>
      </div>
    </div>
  );
}
