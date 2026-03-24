import React from "react";
import { TYPE_COLORS } from "../engine/theme";

export default function DefinitionTooltip({ entry, onClose }) {
  if (!entry) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 36,
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--sidebar)",
        border: "1px solid var(--border)",
        borderRadius: 4,
        padding: "12px 16px",
        maxWidth: 450,
        width: "90vw",
        zIndex: 200,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        animation: "fadeIn 0.15s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              color: TYPE_COLORS[entry.type] || "var(--text-dim)",
              fontSize: 9,
              background:
                (TYPE_COLORS[entry.type] || "var(--text-dim)") +
                "22",
              padding: "2px 6px",
              borderRadius: 3,
              fontFamily: "var(--mono)",
            }}
          >
            {entry.type}
          </span>
          <span
            style={{
              color: "var(--text)",
              fontWeight: 600,
              fontSize: 13,
              fontFamily: "var(--mono)",
            }}
          >
            {entry.term}
          </span>
        </div>
        <span
          onClick={onClose}
          style={{
            color: "var(--text-dim)",
            cursor: "pointer",
            fontSize: 14,
            marginLeft: 12,
          }}
        >
          ✕
        </span>
      </div>
      <div
        style={{
          color: "var(--text)",
          fontSize: 12.5,
          lineHeight: 1.6,
          marginBottom: 6,
        }}
      >
        {entry.short}
      </div>
      <div
        style={{
          color: "var(--text-muted)",
          fontSize: 11,
          fontStyle: "italic",
          lineHeight: 1.5,
          borderTop: "1px solid var(--border)",
          paddingTop: 6,
        }}
      >
        {entry.detail}
      </div>
    </div>
  );
}
