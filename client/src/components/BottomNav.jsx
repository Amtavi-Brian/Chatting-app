import React from "react";

const ITEMS = [
  { key: "home", icon: "🏠", label: "Home" },
  { key: "explore", icon: "🧭", label: "Explore" },
  { key: "compose", icon: "➕", label: "" },
  { key: "chats", icon: "💬", label: "Chats" },
  { key: "profile", icon: "👤", label: "Profile" },
];

export default function BottomNav({ active = "chats", unread = 0, onNavigate }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "10px 8px",
        borderTop: "1px solid var(--border)",
        background: "var(--bg)",
      }}
    >
      {ITEMS.map((item) => {
        if (item.key === "compose") {
          return (
            <button
              key={item.key}
              onClick={() => onNavigate?.(item.key)}
              className="gradient-btn"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                fontSize: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: -20,
                boxShadow: "0 6px 18px rgba(139,47,247,0.5)",
              }}
            >
              {item.icon}
            </button>
          );
        }
        const isActive = item.key === active;
        return (
          <button
            key={item.key}
            onClick={() => onNavigate?.(item.key)}
            style={{
              background: "none",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: isActive ? "var(--accent-2)" : "var(--text-muted)",
              cursor: "pointer",
              position: "relative",
              fontSize: 11,
            }}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {item.label}
            {item.key === "chats" && unread > 0 && (
              <span className="badge" style={{ position: "absolute", top: -6, right: -10 }}>
                {unread}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
