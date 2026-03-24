import React from "react";
import { TYPE_COLORS } from "../engine/theme";

export default function GlossarySidebar({ glossary, activeKey, onSelect }) {
  if (!glossary || glossary.length === 0) return null;

  return (
    <div style={{ padding: "0 0 12px" }}>
      <div
        style={{
          padding: "8px 12px",
          fontSize: 11,
          fontWeight: 600,
          color: "var(--text-dim)",
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Definitions ({glossary.length})
      </div>
      {glossary.map((entry) => (
        <div
          key={entry.key}
          onClick={() => onSelect(entry.key === activeKey ? null : entry.key)}
          style={{
            padding: "3px 12px",
            fontSize: 11,
            cursor: "pointer",
            background:
              activeKey === entry.key ? "var(--selection)" : "transparent",
            color: activeKey === entry.key ? "var(--text)" : "var(--text-dim)",
            fontFamily: "var(--mono)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              color: TYPE_COLORS[entry.type] || "var(--text-dim)",
              fontSize: 9,
            }}
          >
            ●
          </span>
          {entry.term}
        </div>
      ))}
    </div>
  );
}
