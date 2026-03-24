import React from "react";

export default function FileExplorer({
  chapterSlug,
  files,
  activeIdx,
  onSelect,
}) {
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
        Explorer
      </div>
      <div
        style={{
          padding: "4px 12px",
          fontSize: 12,
          color: "var(--text)",
          fontFamily: "var(--mono)",
        }}
      >
        <span style={{ color: "var(--text-dim)" }}>▾ </span>
        <span style={{ color: "var(--fn)" }}>
          {chapterSlug?.replace(/-/g, "_") || "chapter"}/
        </span>
      </div>
      {files.map((f, i) => {
        const isActive = i === activeIdx;
        const isUnlocked = i <= activeIdx;
        const isJava = f.filename?.endsWith(".java");
        return (
          <div
            key={f.slug + i}
            onClick={() => isUnlocked && onSelect(i)}
            style={{
              padding: "3px 12px 3px 28px",
              fontSize: 12,
              cursor: isUnlocked ? "pointer" : "default",
              background: isActive ? "var(--selection)" : "transparent",
              color: isActive
                ? "var(--text)"
                : isUnlocked
                ? "var(--text-dim)"
                : "rgba(106, 106, 106, 0.4)",
              fontFamily: "var(--mono)",
              borderLeft: isActive
                ? "2px solid var(--accent)"
                : "2px solid transparent",
            }}
          >
            <span
              style={{
                color: isJava ? "var(--error)" : "var(--keyword)",
                marginRight: 6,
              }}
            >
              {isJava ? "◆" : "◇"}
            </span>
            {f.filename}
          </div>
        );
      })}
    </div>
  );
}
