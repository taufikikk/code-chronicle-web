import React, { useEffect } from "react";
import useTypewriter from "../hooks/useTypewriter";
import TermHighlight from "./TermHighlight";
import { CHAR_COLORS } from "./theme";

const LINE_STYLES = {
  output: {
    color: "var(--text)",
    background: "#1a1a2e",
    borderLeft: "2px solid var(--accent)",
    padding: "8px 12px",
    margin: "4px 0",
    fontSize: 12,
  },
  error: { color: "var(--error)", fontWeight: 600 },
  error_code: {
    color: "var(--error)",
    background: "rgba(45, 0, 8, 0.33)",
    borderLeft: "2px solid var(--error)",
    padding: "8px 12px",
    margin: "4px 0",
    fontSize: 12,
  },
  success: { color: "var(--success)", fontWeight: 600 },
  string: { color: "var(--string)", fontStyle: "italic" },
};

export default function DialogueLine({
  line,
  lineNum,
  isLatest,
  onDone,
  skipAll,
  glossary,
  onTermClick,
}) {
  const isSpecial = ["output", "error", "error_code", "success", "string"].includes(line.style);
  const speed = isSpecial ? 6 : 18;
  const { displayed, done, skip } = useTypewriter(
    line.text,
    speed,
    !skipAll && isLatest
  );
  const charColor = CHAR_COLORS[line.char] || "var(--comment)";
  const isNarrator = line.char === "narrator";
  const extraStyle = LINE_STYLES[line.style] || {};

  useEffect(() => {
    if (done && onDone) onDone();
  }, [done]);

  const shouldHighlight = done && !isSpecial;

  return (
    <div
      onClick={!done ? skip : undefined}
      style={{
        display: "flex",
        cursor: !done ? "pointer" : "default",
        minHeight: 22,
        lineHeight: "22px",
      }}
    >
      {/* Line number gutter */}
      <div
        style={{
          width: 50,
          textAlign: "right",
          paddingRight: 16,
          flexShrink: 0,
          color: "var(--line-num)",
          fontSize: 13,
          fontFamily: "var(--mono)",
          userSelect: "none",
        }}
      >
        {lineNum}
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          fontSize: 13.5,
          fontFamily: "var(--mono)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          padding: "0 16px 0 0",
          ...extraStyle,
        }}
      >
        {!isNarrator && !isSpecial && (
          <span style={{ color: charColor, fontWeight: 600 }}>
            @{line.char}
            <span style={{ color: "var(--text-muted)" }}>{": "}</span>
          </span>
        )}
        <span
          style={{
            color:
              isNarrator && !isSpecial
                ? "var(--comment)"
                : isSpecial
                ? undefined
                : "var(--text)",
          }}
        >
          {!isNarrator && !isSpecial && '"'}
          {shouldHighlight ? (
            <TermHighlight
              text={displayed}
              glossary={glossary}
              onTermClick={onTermClick}
            />
          ) : (
            displayed
          )}
          {!isNarrator && !isSpecial && done && '"'}
        </span>
        {!done && (
          <span
            style={{ animation: "blink 0.8s infinite", color: "var(--accent)" }}
          >
            │
          </span>
        )}
      </div>
    </div>
  );
}
