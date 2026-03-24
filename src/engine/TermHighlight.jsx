import React from "react";

export default function TermHighlight({ text, glossary, onTermClick }) {
  if (!text || !glossary || glossary.length === 0) return <>{text}</>;

  // Build regex from glossary keys, longest first
  const keys = glossary.map((g) => g.key).sort((a, b) => b.length - a.length);
  const pattern = keys
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const regex = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(regex);

  const glossaryMap = {};
  glossary.forEach((g) => {
    glossaryMap[g.key.toLowerCase()] = g;
  });

  return parts.map((part, i) => {
    const entry = glossaryMap[part.toLowerCase()];
    if (entry) {
      return (
        <span
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            onTermClick?.(entry.key);
          }}
          style={{
            color: "var(--warning)",
            cursor: "pointer",
            borderBottom: "1px dashed rgba(204, 167, 0, 0.33)",
          }}
          title={entry.short}
        >
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
