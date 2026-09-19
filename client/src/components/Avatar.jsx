import React from "react";

const GRADIENTS = [
  ["#8b2ff7", "#f72585"],
  ["#f72585", "#ff8a3d"],
  ["#3d8bff", "#8b2ff7"],
  ["#22c55e", "#3d8bff"],
  ["#f7b733", "#f72585"],
];

function gradientForName(name) {
  const code = Array.from(name || "?").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return GRADIENTS[code % GRADIENTS.length];
}

function initialsForName(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const second = parts.length > 1 ? parts[1][0] : parts[0]?.[1] || "";
  return (first + second).toUpperCase();
}

export default function Avatar({ name, size = 52, isOnline, isGroup }) {
  const [from, to] = gradientForName(name);

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${from}, ${to})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 600,
          fontSize: size * 0.34,
          border: "2px solid rgba(255,255,255,0.08)",
        }}
      >
        {isGroup ? "👥" : initialsForName(name)}
      </div>
      {isOnline !== undefined && (
        <span
          style={{
            position: "absolute",
            bottom: 1,
            right: 1,
            width: size * 0.24,
            height: size * 0.24,
            borderRadius: "50%",
            background: isOnline ? "var(--online)" : "#555",
            border: "2px solid var(--bg)",
          }}
        />
      )}
    </div>
  );
}
