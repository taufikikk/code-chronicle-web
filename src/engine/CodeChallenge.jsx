import React, { useState } from "react";

export default function CodeChallenge({ challenge, onComplete }) {
  const [code, setCode] = useState(challenge.starter_code);
  const [result, setResult] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const validate = () => {
    for (const rule of challenge.validation_rules) {
      if (rule.type === "regex_match") {
        if (!new RegExp(rule.pattern).test(code)) {
          setResult({ pass: false, msg: rule.error });
          return;
        }
      }
      if (rule.type === "regex_not_match") {
        if (new RegExp(rule.pattern).test(code)) {
          setResult({ pass: false, msg: rule.error });
          return;
        }
      }
      if (rule.type === "regex_not_match_inside") {
        const outerMatch = code.match(new RegExp(rule.outer, "s"));
        if (outerMatch && new RegExp(rule.pattern).test(outerMatch[0])) {
          setResult({ pass: false, msg: rule.error });
          return;
        }
      }
    }
    setResult({ pass: true, msg: "PASSED — Deploying fix..." });
    setTimeout(() => onComplete?.(), 2000);
  };

  return (
    <div style={{ marginTop: 8 }}>
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          background: "var(--tab)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            padding: "6px 16px",
            fontSize: 12,
            color: "var(--text)",
            background: "var(--tab-active)",
            borderTop: "1px solid var(--accent)",
            fontFamily: "var(--mono)",
          }}
        >
          FIX
        </div>
        <div
          style={{
            padding: "6px 16px",
            fontSize: 12,
            color: "var(--text-dim)",
            fontFamily: "var(--mono)",
          }}
        >
          BUGGY (ref)
        </div>
      </div>

      {/* Buggy code reference */}
      <div
        style={{
          background: "#1a0000",
          borderLeft: "2px solid var(--error)",
          padding: "10px 14px",
          fontSize: 12,
          fontFamily: "var(--mono)",
          color: "rgba(241, 76, 76, 0.8)",
          whiteSpace: "pre-wrap",
        }}
      >
        <span style={{ color: "var(--error)", fontWeight: 600 }}>
          // ⚠ BUGGY — reference only
        </span>
        {"\n"}
        {challenge.buggy_code}
      </div>

      {/* Code editor */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        style={{
          width: "100%",
          minHeight: 200,
          background: "var(--bg)",
          color: "var(--text)",
          border: "none",
          borderLeft: "2px solid var(--accent)",
          padding: "12px 14px",
          fontSize: 13,
          lineHeight: 1.6,
          fontFamily: "var(--mono)",
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 1, background: "var(--border)" }}>
        <button
          onClick={validate}
          style={{
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            padding: "8px 20px",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          ▶ Run & Verify
        </button>
        <button
          onClick={() => setShowHints(!showHints)}
          style={{
            background: "var(--tab)",
            color: "var(--warning)",
            border: "none",
            padding: "8px 16px",
            fontSize: 12,
          }}
        >
          💡 Hints
        </button>
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          style={{
            background: "var(--tab)",
            color: "var(--text-dim)",
            border: "none",
            padding: "8px 16px",
            fontSize: 12,
          }}
        >
          {showAnswer ? "Hide" : "Show"} Solution
        </button>
      </div>

      {/* Hints */}
      {showHints && challenge.hints?.length > 0 && (
        <div
          style={{
            background: "rgba(204, 167, 0, 0.07)",
            borderLeft: "2px solid var(--warning)",
            padding: "10px 14px",
            fontSize: 12,
            fontFamily: "var(--mono)",
            color: "var(--warning)",
            whiteSpace: "pre-wrap",
          }}
        >
          {challenge.hints.map((h, i) => (
            <div key={i} style={{ marginBottom: 4 }}>
              💡 {h}
            </div>
          ))}
        </div>
      )}

      {/* Answer */}
      {showAnswer && (
        <div
          style={{
            background: "#001a00",
            borderLeft: "2px solid var(--success)",
            padding: "10px 14px",
            fontSize: 12,
            fontFamily: "var(--mono)",
            color: "var(--success)",
            whiteSpace: "pre-wrap",
          }}
        >
          <span style={{ fontWeight: 600 }}>// ✓ FIXED</span>
          {"\n"}
          {challenge.fixed_code}
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          style={{
            padding: "8px 14px",
            fontSize: 12,
            fontFamily: "var(--mono)",
            background: result.pass
              ? "rgba(0, 26, 0, 0.27)"
              : "rgba(26, 0, 0, 0.27)",
            borderLeft: `2px solid ${
              result.pass ? "var(--success)" : "var(--error)"
            }`,
            color: result.pass ? "var(--success)" : "var(--error)",
          }}
        >
          {result.pass ? "✓ " : "✗ "}
          {result.msg}
        </div>
      )}
    </div>
  );
}
