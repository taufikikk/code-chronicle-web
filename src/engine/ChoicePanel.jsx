import React, { useState } from "react";

export default function ChoicePanel({ options, onChoice }) {
  const [hov, setHov] = useState(null);

  return (
    <div style={{ marginLeft: 50, padding: "8px 0" }}>
      <div
        style={{
          color: "var(--text-muted)",
          fontSize: 12,
          marginBottom: 6,
          fontFamily: "var(--mono)",
        }}
      >
        {"// Select path:"}
      </div>
      {options.map((opt, i) => (
        <div
          key={i}
          onClick={() => onChoice(opt.next_scene_slug)}
          onMouseEnter={() => setHov(i)}
          onMouseLeave={() => setHov(null)}
          style={{
            padding: "6px 12px",
            margin: "2px 0",
            cursor: "pointer",
            background: hov === i ? "var(--selection)" : "transparent",
            color: hov === i ? "var(--text)" : "var(--keyword)",
            fontFamily: "var(--mono)",
            fontSize: 13,
            borderLeft:
              hov === i
                ? "2px solid var(--accent)"
                : "2px solid transparent",
            transition: "all 0.15s",
          }}
        >
          {opt.label}
        </div>
      ))}
    </div>
  );
}
