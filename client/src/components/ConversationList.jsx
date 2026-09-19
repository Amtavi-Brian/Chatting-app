import React, { useMemo, useState } from "react";
import Avatar from "./Avatar";
import { conversationIsOnline, conversationTitle, formatTimestamp } from "../utils/format";
import { unreadCount } from "../utils/readState";
import NewChatModal from "./NewChatModal";

export default function ConversationList({
  conversations,
  loading,
  currentUserId,
  activeConversationId,
  onSelect,
  onCreated,
  showNewChat,
  onOpenNewChat,
  onCloseNewChat,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    return conversations
      .filter((c) => (filter === "groups" ? c.is_group : filter === "direct" ? !c.is_group : true))
      .filter((c) =>
        search.trim()
          ? conversationTitle(c, currentUserId).toLowerCase().includes(search.trim().toLowerCase())
          : true
      );
  }, [conversations, filter, search, currentUserId]);

  const groupCount = conversations.filter((c) => c.is_group).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "20px 16px 12px", display: "flex", alignItems: "center", gap: 12 }}>
        <div className="logo-icon">Z</div>
        <h1 style={{ flex: 1, margin: 0, fontSize: 24, fontWeight: 700 }}>Chats</h1>
        <button className="icon-btn" onClick={onOpenNewChat} title="New chat">
          ✏️
        </button>
      </div>

      <div style={{ padding: "0 16px 12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--surface-alt)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "10px 14px",
          }}
        >
          <span style={{ color: "var(--text-muted)" }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
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
      </div>

      <div style={{ display: "flex", gap: 8, padding: "0 16px 14px", overflowX: "auto" }}>
        <button
          className={`pill-tab ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`pill-tab ${filter === "direct" ? "active" : ""}`}
          onClick={() => setFilter("direct")}
        >
          Direct
        </button>
        <button
          className={`pill-tab ${filter === "groups" ? "active" : ""}`}
          onClick={() => setFilter("groups")}
        >
          Groups {groupCount > 0 && `(${groupCount})`}
        </button>
      </div>

      <div className="scroll-area">
        {loading && (
          <p style={{ textAlign: "center", color: "var(--text-muted)", marginTop: 24 }}>Loading chats...</p>
        )}
        {!loading && filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--text-muted)", marginTop: 24 }}>
            No conversations yet. Tap ✏️ to start one.
          </p>
        )}
        {filtered.map((c) => {
          const title = conversationTitle(c, currentUserId);
          const online = conversationIsOnline(c, currentUserId);
          const badge = unreadCount(c);
          const isActive = c.id === activeConversationId;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: isActive ? "var(--surface-alt)" : "transparent",
                border: "none",
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <Avatar name={title} isOnline={online} isGroup={c.is_group} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: 15,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {title}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>
                    {formatTimestamp(c.last_message?.created_at || c.created_at)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 2 }}>
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontSize: 13,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {c.last_message
                      ? c.last_message.content_type === "text"
                        ? c.last_message.content
                        : "📎 Attachment"
                      : c.is_group
                      ? `${c.participants.length} members`
                      : "Say hello 👋"}
                  </span>
                  {badge > 0 && <span className="badge">{badge}</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {showNewChat && (
        <NewChatModal
          onClose={onCloseNewChat}
          onCreated={(conversation) => {
            onCloseNewChat();
            onCreated(conversation);
          }}
        />
      )}
    </div>
  );
}
