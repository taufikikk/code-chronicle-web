import { useState, useEffect, useRef } from "react";
import TermHighlight from "../engine/TermHighlight";

export default function DeepDiveMode({ levels, glossary, onTermClick }) {
  const [lv, setLv] = useState(0);
  const ref = useRef(null);
  useEffect(function() { if (ref.current) ref.current.scrollTop = 0; }, [lv]);
  if (!levels || levels.length === 0) return null;
  const d = levels[lv];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--tab)", flexShrink: 0 }}>
        {levels.map(function(_, i) {
          return <div key={i} onClick={function() { setLv(i); }} style={{ padding: "6px 14px", fontSize: 11, cursor: "pointer", background: i === lv ? "var(--tab-active)" : "var(--tab)", color: i === lv ? "var(--text)" : "var(--text-dim)", borderTop: i === lv ? "1px solid var(--accent)" : "1px solid transparent", borderRight: "1px solid var(--border)", fontFamily: "var(--mono)" }}>{"L" + (i + 1)}</div>;
        })}
      </div>
      <div ref={ref} style={{ flex: 1, overflow: "auto", padding: "20px 24px 40px 50px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 15, fontWeight: 600, color: "var(--keyword)", marginBottom: 16 }}>{d.title}</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 13, lineHeight: 1.8, color: "var(--text)", whiteSpace: "pre-wrap", marginBottom: 16 }}>
          <TermHighlight text={d.content} glossary={glossary} onTermClick={onTermClick} />
        </div>
        {d.code && <div style={{ background: "#0d1117", border: "1px solid var(--border)", borderRadius: 4, padding: "12px 16px", margin: "8px 0", fontFamily: "var(--mono)", fontSize: 12.5, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "var(--text)" }}>{d.code}</div>}
        {d.keypoint && <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(0,122,204,0.07)", borderLeft: "2px solid var(--accent)", fontFamily: "var(--mono)", fontSize: 12, color: "var(--variable)" }}>{d.keypoint}</div>}
      </div>
      <div style={{ borderTop: "1px solid var(--border)", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--sidebar)", flexShrink: 0 }}>
        <button onClick={function() { if (lv > 0) setLv(lv - 1); }} disabled={lv === 0} style={{ background: "transparent", color: lv > 0 ? "var(--text)" : "var(--text-muted)", border: "1px solid " + (lv > 0 ? "var(--border)" : "transparent"), padding: "6px 16px", fontFamily: "var(--mono)", fontSize: 12, cursor: lv > 0 ? "pointer" : "default" }}>Prev</button>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)" }}>{"L" + (lv + 1) + "/" + levels.length}</span>
        <button onClick={function() { if (lv < levels.length - 1) setLv(lv + 1); }} disabled={lv >= levels.length - 1} style={{ background: lv < levels.length - 1 ? "var(--accent)" : "transparent", color: lv < levels.length - 1 ? "#fff" : "var(--text-muted)", border: "none", padding: "6px 16px", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, cursor: lv < levels.length - 1 ? "pointer" : "default" }}>Next</button>
      </div>
    </div>
  );
}
