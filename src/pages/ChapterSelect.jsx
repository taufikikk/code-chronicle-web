import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getChapters, getProgress } from "../api/client";

export default function ChapterSelect() {
  const [chapters, setChapters] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hov, setHov] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getChapters(), getProgress().catch(() => [])])
      .then(([ch, prog]) => {
        setChapters(ch);
        setProgress(prog);
      })
      .finally(() => setLoading(false));
  }, []);

  const getChapterProgress = (chapterId) =>
    progress.find((p) => p.chapter_id === chapterId);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* Titlebar */}
      <div
        style={{
          height: 30,
          background: "var(--titlebar)",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          borderBottom: "1px solid var(--border)",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              color: "var(--accent)",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            ⟨/⟩
          </span>
          <span style={{ color: "var(--text-dim)", fontSize: 12 }}>
            Code Chronicle — Chapter Select
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ color: "var(--text-dim)", fontSize: 11 }}>─</span>
          <span style={{ color: "var(--text-dim)", fontSize: 11 }}>□</span>
          <span style={{ color: "var(--text-dim)", fontSize: 11 }}>✕</span>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "auto",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 600, width: "100%" }}>
          {/* Header */}
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--comment)",
                marginBottom: 8,
              }}
            >
              {"// DSA Visual Novel — IDE Edition"}
            </div>
            <h1
              style={{
                fontFamily: "var(--mono)",
                fontSize: 28,
                color: "var(--accent)",
                fontWeight: 700,
                margin: 0,
              }}
            >
              CODE CHRONICLE
            </h1>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 12,
                color: "var(--text-dim)",
                marginTop: 6,
              }}
            >
              Learn DSA through stories. Disguised as code.
            </div>
          </div>

          {loading ? (
            <div
              style={{
                textAlign: "center",
                color: "var(--text-dim)",
                fontFamily: "var(--mono)",
                fontSize: 13,
              }}
            >
              Loading chapters...
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {chapters.map((ch, i) => {
                const prog = getChapterProgress(ch.id);
                const isComplete = prog?.completed;
                return (
                  <div
                    key={ch.slug}
                    onClick={() => navigate(`/play/${ch.slug}`)}
                    onMouseEnter={() => setHov(i)}
                    onMouseLeave={() => setHov(null)}
                    style={{
                      padding: "16px 20px",
                      background:
                        hov === i ? "var(--selection)" : "var(--sidebar)",
                      border: "1px solid var(--border)",
                      borderLeft:
                        hov === i
                          ? "3px solid var(--accent)"
                          : isComplete
                          ? "3px solid var(--success)"
                          : "3px solid var(--border)",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: 12,
                            color: "var(--line-num)",
                          }}
                        >
                          {String(ch.order).padStart(2, "0")}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: 14,
                            color: "var(--text)",
                            fontWeight: 600,
                          }}
                        >
                          {ch.title}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 11,
                          color: isComplete
                            ? "var(--success)"
                            : prog
                            ? "var(--warning)"
                            : "var(--text-muted)",
                        }}
                      >
                        {isComplete
                          ? "✓ complete"
                          : prog
                          ? "◈ in progress"
                          : "○ new"}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        color: "var(--text-dim)",
                        marginLeft: 34,
                      }}
                    >
                      <span style={{ color: "var(--keyword)" }}>topic</span>
                      {": "}
                      <span style={{ color: "var(--string)" }}>
                        "{ch.topic}"
                      </span>
                    </div>
                    {ch.description && (
                      <div
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 11,
                          color: "var(--comment)",
                          marginLeft: 34,
                          marginTop: 4,
                        }}
                      >
                        // {ch.description.slice(0, 100)}
                        {ch.description.length > 100 ? "..." : ""}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div
        style={{
          height: 24,
          background: "var(--statusbar)",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
          ⟨/⟩ Code Chronicle
        </span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
          {chapters.length} chapters available
        </span>
      </div>
    </div>
  );
}
