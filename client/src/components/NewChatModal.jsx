import React, { useState } from "react";
import apiClient from "../api/client";
import Avatar from "./Avatar";

export default function NewChatModal({ onClose, onCreated }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [found, setFound] = useState(null);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    setError("");
    setFound(null);
    if (!phoneNumber.trim()) return;
    setSearching(true);
    try {
      const { data } = await apiClient.get(
        `/users/by-phone/${encodeURIComponent(phoneNumber.trim())}`
      );
      setFound(data);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "No user found with that phone number.");
    } finally {
      setSearching(false);
    }
  }

  async function handleStartChat() {
    if (!found) return;
    setCreating(true);
    setError("");
    try {
      const { data } = await apiClient.post("/conversations", {
        is_group: false,
        participant_ids: [found.id],
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
          background: "var(--surface)",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>New chat</h2>
          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 13 }}>
          Enter a contact's phone number to start chatting with them.
        </p>

        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
          <input
            className="auth-input"
            type="tel"
            placeholder="+15551234567"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="gradient-btn" style={{ padding: "0 18px" }} disabled={searching}>
            {searching ? "..." : "Find"}
          </button>
        </form>

        {error && <p style={{ color: "var(--accent-2)", margin: 0, fontSize: 13 }}>{error}</p>}

        {found && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 10,
              background: "var(--surface-alt)",
              borderRadius: 12,
            }}
          >
            <Avatar name={found.username || found.phone_number} size={44} isOnline={found.is_online} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{found.username || found.phone_number}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{found.phone_number}</div>
            </div>
          </div>
        )}

        <button
          className="gradient-btn"
          disabled={!found || creating}
          onClick={handleStartChat}
          style={{ padding: "12px 0", opacity: !found || creating ? 0.6 : 1 }}
        >
          {creating ? "Starting..." : "Start chat"}
        </button>
      </div>
    </div>
  );
}
