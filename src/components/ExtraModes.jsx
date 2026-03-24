import { useState, useEffect, useRef } from "react";

// ═══ PRACTICE ═══
export function PracticeMode({ questions }) {
  const [qi, setQi] = useState(0);
  const [ans, setAns] = useState({});
  const [fi, setFi] = useState("");
  const [sr, setSr] = useState(false);
  const ref = useRef(null);
  useEffect(function() { if (ref.current) ref.current.scrollTop = 0; setFi(""); }, [qi, sr]);
  if (!questions || !questions.length) return null;
  var q = questions[qi], my = ans[q.id];
  var sc = Object.values(ans).filter(function(a) { return a.correct; }).length;
  var tot = questions.length, allD = Object.keys(ans).length === tot;
  var pct = Math.round((sc / tot) * 100);
  var subM = function(i) { if (my) return; var o = {}; o[q.id] = { selected: i, correct: String(i) === q.answer }; setAns(function(p) { return Object.assign({}, p, o); }); };
  var subF = function() { if (my) return; var o = {}; o[q.id] = { selected: fi.trim(), correct: fi.trim().toLowerCase() === (q.answer || "").toLowerCase() }; setAns(function(p) { return Object.assign({}, p, o); }); };
  var retry = function() { setAns({}); setQi(0); setSr(false); };

  if (sr) {
    var wrong = questions.filter(function(p) { return ans[p.id] && !ans[p.id].correct; });
    var lvl = pct >= 88 ? { l: "Master", c: "var(--success)" } : pct >= 75 ? { l: "Strong", c: "var(--accent)" } : pct >= 50 ? { l: "Getting There", c: "var(--warning)" } : { l: "Building", c: "var(--string)" };
    return <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div ref={ref} style={{ flex: 1, overflow: "auto", padding: "24px 24px 40px 40px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 18, fontWeight: 600, color: "var(--accent)", marginBottom: 20 }}>RESULTS</div>
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ background: "#0d1117", border: "1px solid var(--border)", borderRadius: 6, padding: "20px 28px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 36, fontWeight: 700, color: lvl.c }}>{sc}<span style={{ fontSize: 16, color: "var(--text-dim)" }}>{"/" + tot}</span></div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)" }}>{pct + "% — " + lvl.l}</div>
          </div>
        </div>
        {wrong.length > 0 && <div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 600, color: "var(--error)", marginBottom: 10 }}>Review</div>
          {wrong.map(function(w, i) { return <div key={i} style={{ background: "rgba(241,76,76,0.03)", border: "1px solid rgba(241,76,76,0.2)", borderRadius: 4, padding: 12, marginBottom: 6 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12 }}><span style={{ color: "var(--error)" }}>{"X "}</span>{w.question.split("\n")[0]}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>{w.explanation}</div>
          </div>; })}
        </div>}
        {wrong.length === 0 && <div style={{ background: "rgba(78,201,176,0.07)", border: "1px solid rgba(78,201,176,0.2)", borderRadius: 6, padding: 16 }}><span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--success)", fontWeight: 600 }}>Perfect!</span></div>}
      </div>
      <div style={{ borderTop: "1px solid var(--border)", padding: "8px 16px", display: "flex", justifyContent: "space-between", background: "var(--sidebar)", flexShrink: 0 }}>
        <button onClick={function() { setSr(false); }} style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--border)", padding: "6px 16px", fontFamily: "var(--mono)", fontSize: 12, cursor: "pointer" }}>Back</button>
        <button onClick={retry} style={{ background: "var(--accent)", color: "#fff", border: "none", padding: "6px 16px", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Retry</button>
      </div>
    </div>;
  }

  return <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <div style={{ display: "flex", gap: 2, padding: "10px 16px", background: "var(--tab)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
      {questions.map(function(_, i) { var a = ans[questions[i].id]; return <div key={i} onClick={function() { setQi(i); }} style={{ flex: 1, height: 4, borderRadius: 2, cursor: "pointer", background: a ? (a.correct ? "var(--success)" : "var(--error)") : i === qi ? "var(--accent)" : "var(--border)" }} />; })}
    </div>
    <div ref={ref} style={{ flex: 1, overflow: "auto", padding: "20px 24px 40px 40px" }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--text)", lineHeight: 1.7, marginBottom: 12, whiteSpace: "pre-wrap" }}>{"Q" + (qi + 1) + ". " + q.question}</div>
      {q.code && <div style={{ background: "#0d1117", border: "1px solid var(--border)", borderRadius: 4, padding: "12px 16px", margin: "8px 0", fontFamily: "var(--mono)", fontSize: 12.5, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "var(--text)" }}>{q.code}</div>}
      {q.type === "mcq" && q.options && <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
        {q.options.map(function(o, i) { var sel = my && my.selected === i; var cor = String(i) === q.answer; var bg = my ? (sel && my.correct ? "rgba(78,201,176,0.13)" : sel ? "rgba(241,76,76,0.13)" : cor ? "rgba(78,201,176,0.07)" : "transparent") : "transparent"; return <div key={i} onClick={function() { subM(i); }} style={{ padding: "10px 14px", border: "1px solid " + (my ? (cor ? "var(--success)" : sel ? "var(--error)" : "var(--border)") : "var(--border)"), borderRadius: 4, cursor: my ? "default" : "pointer", background: bg, fontFamily: "var(--mono)", fontSize: 13, color: "var(--text)" }}><span style={{ color: "var(--text-dim)", marginRight: 8 }}>{String.fromCharCode(65 + i) + "."}</span>{o}</div>; })}
      </div>}
      {q.type === "fill" && <div style={{ marginTop: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={fi} onChange={function(e) { setFi(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter") subF(); }} disabled={!!my} placeholder="..." style={{ flex: 1, background: "var(--bg)", border: "1px solid " + (my ? (my.correct ? "var(--success)" : "var(--error)") : "var(--border)"), borderRadius: 4, padding: "8px 12px", color: "var(--text)", fontFamily: "var(--mono)", fontSize: 13, outline: "none" }} />
          {!my && <button onClick={subF} style={{ background: "var(--accent)", color: "#fff", border: "none", padding: "8px 16px", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Check</button>}
        </div>
        {my && !my.correct && <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--warning)", marginTop: 6 }}>{"-> " + q.answer}</div>}
      </div>}
      {my && <div style={{ marginTop: 16, padding: "10px 14px", background: (my.correct ? "rgba(78,201,176,0.07)" : "rgba(204,167,0,0.07)"), borderLeft: "2px solid " + (my.correct ? "var(--success)" : "var(--warning)"), fontFamily: "var(--mono)", fontSize: 12, color: "var(--text)", lineHeight: 1.6 }}>{q.explanation}</div>}
    </div>
    <div style={{ borderTop: "1px solid var(--border)", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--sidebar)", flexShrink: 0 }}>
      <button onClick={function() { if (qi > 0) setQi(qi - 1); }} disabled={qi === 0} style={{ background: "transparent", color: qi > 0 ? "var(--text)" : "var(--text-muted)", border: "1px solid " + (qi > 0 ? "var(--border)" : "transparent"), padding: "6px 16px", fontFamily: "var(--mono)", fontSize: 12, cursor: qi > 0 ? "pointer" : "default" }}>Prev</button>
      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)" }}>{sc + "/" + tot}</span>
      {qi < tot - 1 ? <button onClick={function() { setQi(qi + 1); }} style={{ background: "var(--accent)", color: "#fff", border: "none", padding: "6px 16px", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Next</button> : allD ? <button onClick={function() { setSr(true); }} style={{ background: "var(--success)", color: "#fff", border: "none", padding: "6px 16px", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Results</button> : <button disabled style={{ background: "transparent", color: "var(--text-muted)", border: "1px solid transparent", padding: "6px 16px", fontFamily: "var(--mono)", fontSize: 12 }}>...</button>}
    </div>
  </div>;
}

// ═══ CHEATSHEET ═══
export function CheatsheetMode({ cards }) {
  if (!cards || !cards.length) return null;
  return <div style={{ flex: 1, overflow: "auto", padding: "20px 24px 40px 40px" }}>
    <div style={{ fontFamily: "var(--mono)", fontSize: 15, fontWeight: 600, color: "var(--accent)", marginBottom: 20 }}>CHEAT SHEET</div>
    {cards.map(function(s, i) { return <div key={i} style={{ background: "#0d1117", border: "1px solid var(--border)", borderRadius: 4, marginBottom: 10, overflow: "hidden" }}>
      <div style={{ padding: "8px 14px", background: "var(--tab)", borderBottom: "1px solid var(--border)", fontFamily: "var(--mono)", fontSize: 12, color: "var(--keyword)", fontWeight: 600 }}>{s.title}</div>
      <div style={{ padding: "12px 14px", fontFamily: "var(--mono)", fontSize: 12, lineHeight: 1.7, whiteSpace: "pre", color: "var(--text)", overflowX: "auto" }}>{s.content}</div>
    </div>; })}
  </div>;
}

// ═══ BUGS ═══
export function BugsMode({ bugs }) {
  const [bi, setBi] = useState(0);
  const [sf, setSf] = useState(false);
  const ref = useRef(null);
  useEffect(function() { if (ref.current) ref.current.scrollTop = 0; setSf(false); }, [bi]);
  if (!bugs || !bugs.length) return null;
  var b = bugs[bi];
  return <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--tab)", flexShrink: 0, overflow: "auto" }}>
      {bugs.map(function(_, i) { return <div key={i} onClick={function() { setBi(i); }} style={{ padding: "6px 12px", fontSize: 11, cursor: "pointer", background: i === bi ? "var(--tab-active)" : "var(--tab)", color: i === bi ? "var(--text)" : "var(--text-dim)", borderTop: i === bi ? "1px solid var(--error)" : "1px solid transparent", borderRight: "1px solid var(--border)", fontFamily: "var(--mono)", whiteSpace: "nowrap" }}>{"Bug" + (i + 1)}</div>; })}
    </div>
    <div ref={ref} style={{ flex: 1, overflow: "auto", padding: "20px 24px 40px 40px" }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 15, fontWeight: 600, color: "var(--error)", marginBottom: 6 }}>{b.title}</div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text)", lineHeight: 1.7, marginBottom: 16 }}>{b.description}</div>
      <div style={{ background: "#0d1117", border: "1px solid var(--border)", borderRadius: 4, padding: "12px 16px", margin: "8px 0", fontFamily: "var(--mono)", fontSize: 12.5, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "var(--text)" }}>{b.buggy_code}</div>
      <button onClick={function() { setSf(!sf); }} style={{ background: "var(--tab)", color: sf ? "var(--success)" : "var(--accent)", border: "1px solid var(--border)", padding: "8px 16px", fontFamily: "var(--mono)", fontSize: 12, cursor: "pointer", borderRadius: 4, marginTop: 8 }}>{sf ? "Hide" : "Fix"}</button>
      {sf && <div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--success)", marginTop: 16, fontWeight: 600 }}>Fix:</div>
        <div style={{ background: "#0d1117", border: "1px solid var(--border)", borderRadius: 4, padding: "12px 16px", margin: "8px 0", fontFamily: "var(--mono)", fontSize: 12.5, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "var(--text)" }}>{b.fixed_code}</div>
      </div>}
      {b.why && <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(0,122,204,0.07)", borderLeft: "2px solid var(--accent)", fontFamily: "var(--mono)", fontSize: 12, color: "var(--text)", lineHeight: 1.7 }}>{b.why}</div>}
    </div>
    <div style={{ borderTop: "1px solid var(--border)", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--sidebar)", flexShrink: 0 }}>
      <button onClick={function() { if (bi > 0) setBi(bi - 1); }} disabled={bi === 0} style={{ background: "transparent", color: bi > 0 ? "var(--text)" : "var(--text-muted)", border: "1px solid " + (bi > 0 ? "var(--border)" : "transparent"), padding: "6px 16px", fontFamily: "var(--mono)", fontSize: 12 }}>Prev</button>
      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)" }}>{(bi + 1) + "/" + bugs.length}</span>
      <button onClick={function() { if (bi < bugs.length - 1) setBi(bi + 1); }} disabled={bi >= bugs.length - 1} style={{ background: bi < bugs.length - 1 ? "var(--accent)" : "transparent", color: bi < bugs.length - 1 ? "#fff" : "var(--text-muted)", border: "none", padding: "6px 16px", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600 }}>Next</button>
    </div>
  </div>;
}

// ═══ TRACER ═══
export function TracerMode({ traces }) {
  const [ti, setTi] = useState(0);
  const [step, setStep] = useState(0);
  const [gs, setGs] = useState("");
  const [ck, setCk] = useState(false);
  const ref = useRef(null);
  useEffect(function() { if (ref.current) ref.current.scrollTop = 0; setGs(""); setCk(false); setStep(0); }, [ti]);
  useEffect(function() { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [step]);
  if (!traces || !traces.length) return null;
  var t = traces[ti], atEnd = step >= t.steps.length - 1;
  var isOk = ck && gs.trim().toLowerCase().replace(/"/g, "") === (t.answer || "").toLowerCase().replace(/"/g, "");
  return <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--tab)", flexShrink: 0 }}>
      {traces.map(function(_, i) { return <div key={i} onClick={function() { setTi(i); }} style={{ padding: "6px 14px", fontSize: 11, cursor: "pointer", background: i === ti ? "var(--tab-active)" : "var(--tab)", color: i === ti ? "var(--text)" : "var(--text-dim)", borderTop: i === ti ? "1px solid var(--accent)" : "1px solid transparent", borderRight: "1px solid var(--border)", fontFamily: "var(--mono)" }}>{"T" + (i + 1)}</div>; })}
    </div>
    <div ref={ref} style={{ flex: 1, overflow: "auto", padding: "20px 24px 40px 40px" }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 14, fontWeight: 600, color: "var(--keyword)", marginBottom: 12 }}>{t.title}</div>
      <div style={{ background: "#0d1117", border: "1px solid var(--border)", borderRadius: 4, padding: "12px 16px", margin: "8px 0", fontFamily: "var(--mono)", fontSize: 12.5, lineHeight: 1.7, whiteSpace: "pre-wrap", color: "var(--text)" }}>{t.code}</div>
      {t.steps.slice(0, step + 1).map(function(s, i) {
        return <div key={i} style={{ marginTop: 16 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--accent)", fontWeight: 600, marginBottom: 6 }}>{"Step " + (i + 1) + ": " + (s.l || "")}</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {s.sk && <div style={{ background: "#0d1117", border: "1px solid var(--border)", borderRadius: 4, padding: "10px 14px", minWidth: 110 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-dim)", marginBottom: 4 }}>STACK</div>
              {s.sk.map(function(v, j) { return <div key={j} style={{ fontFamily: "var(--mono)", fontSize: 12 }}><span style={{ color: "var(--variable)" }}>{v[0]}</span>{"="}<span style={{ color: "var(--number)" }}>{v[1]}</span></div>; })}
            </div>}
            {s.hp && s.hp.length > 0 && <div style={{ background: "#0d1117", border: "1px solid rgba(204,167,0,0.2)", borderRadius: 4, padding: "10px 14px", minWidth: 110 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-dim)", marginBottom: 4 }}>HEAP</div>
              {s.hp.map(function(h, j) { return <div key={j} style={{ fontFamily: "var(--mono)", fontSize: 12 }}><span style={{ color: "var(--text-dim)" }}>{h[0] + ":"}</span> <span style={{ color: "var(--string)" }}>{h[1]}</span></div>; })}
            </div>}
          </div>
          {s.ex && <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--comment)", marginTop: 6 }}>{"// " + s.ex}</div>}
        </div>;
      })}
      {atEnd && t.question && <div style={{ marginTop: 24, padding: 14, background: "rgba(0,122,204,0.07)", border: "1px solid rgba(0,122,204,0.2)", borderRadius: 6 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--accent)", fontWeight: 600, marginBottom: 8 }}>{t.question}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={gs} onChange={function(e) { setGs(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter") setCk(true); }} disabled={ck} placeholder="..." style={{ flex: 1, background: "var(--bg)", border: "1px solid " + (ck ? (isOk ? "var(--success)" : "var(--error)") : "var(--border)"), borderRadius: 4, padding: "8px 12px", color: "var(--text)", fontFamily: "var(--mono)", fontSize: 13, outline: "none" }} />
          {!ck && <button onClick={function() { setCk(true); }} style={{ background: "var(--accent)", color: "#fff", border: "none", padding: "8px 16px", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Check</button>}
        </div>
        {ck && <div style={{ marginTop: 8, fontFamily: "var(--mono)", fontSize: 12, color: isOk ? "var(--success)" : "var(--warning)" }}>{isOk ? "Benar! " : ("X -> " + t.answer + ". ")}{t.explanation}</div>}
      </div>}
    </div>
    <div style={{ borderTop: "1px solid var(--border)", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--sidebar)", flexShrink: 0 }}>
      <button onClick={function() { if (step > 0) setStep(step - 1); }} disabled={step === 0} style={{ background: "transparent", color: step > 0 ? "var(--text)" : "var(--text-muted)", border: "1px solid " + (step > 0 ? "var(--border)" : "transparent"), padding: "6px 16px", fontFamily: "var(--mono)", fontSize: 12 }}>Step -</button>
      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)" }}>{"Step " + (step + 1) + "/" + t.steps.length}</span>
      <button onClick={function() { if (!atEnd) setStep(step + 1); }} disabled={atEnd} style={{ background: !atEnd ? "var(--accent)" : "transparent", color: !atEnd ? "#fff" : "var(--text-muted)", border: "none", padding: "6px 16px", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600 }}>Step +</button>
    </div>
  </div>;
}

// ═══ INTERVIEW ═══
export function InterviewMode({ questions }) {
  const [ii, setIi] = useState(0);
  const [sh, setSh] = useState(false);
  const ref = useRef(null);
  useEffect(function() { if (ref.current) ref.current.scrollTop = 0; setSh(false); }, [ii]);
  if (!questions || !questions.length) return null;
  var it = questions[ii];
  return <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <div ref={ref} style={{ flex: 1, overflow: "auto", padding: "20px 24px 40px 40px" }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)", marginBottom: 4 }}>{"Q" + (ii + 1) + "/" + questions.length}</div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 20, lineHeight: 1.6 }}>{it.question}</div>
      <button onClick={function() { setSh(!sh); }} style={{ background: sh ? "var(--tab)" : "var(--accent)", color: sh ? "var(--text)" : "#fff", border: "1px solid " + (sh ? "var(--border)" : "var(--accent)"), padding: "10px 20px", fontFamily: "var(--mono)", fontSize: 12, cursor: "pointer", borderRadius: 4, fontWeight: 600 }}>{sh ? "Hide" : "Answer"}</button>
      {sh && <div>
        <div style={{ marginTop: 20, fontFamily: "var(--mono)", fontSize: 13, color: "var(--text)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{it.answer}</div>
        {it.tip && <div style={{ marginTop: 16, padding: "12px 14px", background: "rgba(204,167,0,0.07)", borderLeft: "2px solid var(--warning)", fontFamily: "var(--mono)", fontSize: 12, color: "var(--text)", lineHeight: 1.6 }}>{"Tip: " + it.tip}</div>}
      </div>}
    </div>
    <div style={{ borderTop: "1px solid var(--border)", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--sidebar)", flexShrink: 0 }}>
      <button onClick={function() { if (ii > 0) setIi(ii - 1); }} disabled={ii === 0} style={{ background: "transparent", color: ii > 0 ? "var(--text)" : "var(--text-muted)", border: "1px solid " + (ii > 0 ? "var(--border)" : "transparent"), padding: "6px 16px", fontFamily: "var(--mono)", fontSize: 12 }}>Prev</button>
      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)" }}>{(ii + 1) + "/" + questions.length}</span>
      <button onClick={function() { if (ii < questions.length - 1) setIi(ii + 1); }} disabled={ii >= questions.length - 1} style={{ background: ii < questions.length - 1 ? "var(--accent)" : "transparent", color: ii < questions.length - 1 ? "#fff" : "var(--text-muted)", border: "none", padding: "6px 16px", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600 }}>Next</button>
    </div>
  </div>;
}

// ═══ FLASHCARD ═══
export function FlashcardMode({ cards }) {
  const [ci, setCi] = useState(0);
  const [fl, setFl] = useState(false);
  const [kn, setKn] = useState({});
  useEffect(function() { setFl(false); }, [ci]);
  if (!cards || !cards.length) return null;
  var tot = cards.length, knCount = Object.keys(kn).length;
  var mark = function(ok) { if (ok) { var o = {}; o[ci] = true; setKn(function(p) { return Object.assign({}, p, o); }); } setCi(ci + 1); };
  if (ci >= tot) return <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
    <div style={{ fontFamily: "var(--mono)", fontSize: 36, fontWeight: 700, color: "var(--success)" }}>{knCount}<span style={{ fontSize: 16, color: "var(--text-dim)" }}>{"/" + tot}</span></div>
    <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--text)" }}>Mastered</div>
    <button onClick={function() { setCi(0); setKn({}); }} style={{ background: "var(--accent)", color: "#fff", border: "none", padding: "6px 16px", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Restart</button>
  </div>;
  var card = cards[ci];
  return <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <div style={{ display: "flex", gap: 2, padding: "10px 16px", background: "var(--tab)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
      {cards.map(function(_, i) { return <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: kn[i] ? "var(--success)" : i === ci ? "var(--accent)" : i < ci ? "var(--text-muted)" : "var(--border)" }} />; })}
    </div>
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={function() { setFl(!fl); }} style={{ width: "100%", maxWidth: 380, minHeight: 180, background: "#0d1117", border: "1px solid " + (fl ? "var(--success)" : "var(--accent)"), borderRadius: 8, padding: "28px 24px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-dim)", marginBottom: 12 }}>{(fl ? "ANSWER" : "QUESTION") + " - tap"}</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: fl ? 20 : 15, fontWeight: 600, color: fl ? "var(--success)" : "var(--text)", lineHeight: 1.6 }}>{fl ? card.back : card.front}</div>
      </div>
    </div>
    <div style={{ borderTop: "1px solid var(--border)", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--sidebar)", flexShrink: 0 }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)" }}>{(ci + 1) + "/" + tot}</span>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={function() { mark(false); }} style={{ background: "rgba(241,76,76,0.13)", color: "var(--error)", border: "1px solid rgba(241,76,76,0.3)", padding: "6px 14px", fontFamily: "var(--mono)", fontSize: 12, cursor: "pointer", borderRadius: 4 }}>Lupa</button>
        <button onClick={function() { mark(true); }} style={{ background: "rgba(78,201,176,0.13)", color: "var(--success)", border: "1px solid rgba(78,201,176,0.3)", padding: "6px 14px", fontFamily: "var(--mono)", fontSize: 12, cursor: "pointer", borderRadius: 4 }}>Ingat</button>
      </div>
    </div>
  </div>;
}

// ═══ DEEP QUIZ ═══
export function DeepQuizMode({ questions }) {
  const [qi, setQi] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [results, setResults] = useState([]);
  const [showDone, setShowDone] = useState(false);
  const ref = useRef(null);

  useEffect(function() { if (ref.current) ref.current.scrollTop = 0; setInput(""); setChecked(false); setShowHint(false); }, [qi, showDone]);

  if (!questions || !questions.length) return <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", color: "var(--text-dim)" }}>Coming soon</div>;

  var q = questions[qi], total = questions.length;
  var normalize = function(s) { return s.toLowerCase().replace(/[^a-z0-9+*=()]/g, "").trim(); };

  var checkAnswer = function() {
    if (checked) return;
    setChecked(true);
    var norm = normalize(input);
    var isMatch = q.accept.some(function(a) { return norm.indexOf(normalize(a)) !== -1; });
    setResults(function(p) { return p.concat([{ correct: isMatch, answer: input.trim() }]); });
  };

  var nextQ = function() { if (qi + 1 < total) setQi(qi + 1); else setShowDone(true); };
  var restart = function() { setQi(0); setInput(""); setChecked(false); setShowHint(false); setResults([]); setShowDone(false); };

  if (showDone) {
    var correct = results.filter(function(r) { return r.correct; }).length;
    var pct = Math.round((correct / total) * 100);
    return <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div ref={ref} style={{ flex: 1, overflow: "auto", padding: "24px 24px 40px 50px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 20, fontWeight: 700, color: "var(--accent)", marginBottom: 20 }}>MASTERY CHECK</div>
        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ background: "#0d1117", border: "1px solid var(--border)", borderRadius: 8, padding: "20px 28px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 36, fontWeight: 700, color: pct >= 80 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--error)" }}>{correct}<span style={{ fontSize: 16, color: "var(--text-dim)" }}>{"/" + total}</span></div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>{pct + "%"}</div>
          </div>
        </div>
        {questions.map(function(qq, i) {
          var r = results[i]; if (!r) return null;
          return <div key={i} style={{ background: (r.correct ? "rgba(78,201,176,0.03)" : "rgba(241,76,76,0.03)"), border: "1px solid " + (r.correct ? "rgba(78,201,176,0.2)" : "rgba(241,76,76,0.2)"), borderRadius: 4, padding: 12, marginBottom: 6 }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12 }}><span style={{ color: r.correct ? "var(--success)" : "var(--error)" }}>{r.correct ? "OK " : "X "}</span>{qq.question.split("\n")[0]}</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)", marginTop: 4 }}>{"You: " + r.answer}</div>
            {!r.correct && <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--warning)", marginTop: 2 }}>{"Expected: " + qq.perfect}</div>}
          </div>;
        })}
      </div>
      <div style={{ borderTop: "1px solid var(--border)", padding: "8px 16px", display: "flex", justifyContent: "flex-end", background: "var(--sidebar)", flexShrink: 0 }}>
        <button onClick={restart} style={{ background: "var(--accent)", color: "#fff", border: "none", padding: "6px 16px", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Retry</button>
      </div>
    </div>;
  }

  var diffCol = q.difficulty === "master" ? "var(--error)" : q.difficulty === "hard" ? "var(--warning)" : q.difficulty === "medium" ? "var(--accent)" : "var(--success)";
  var lastResult = results.length > 0 ? results[results.length - 1] : null;

  return <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <div style={{ display: "flex", gap: 3, padding: "10px 16px", background: "var(--tab)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
      {questions.map(function(_, i) { var r = results[i]; return <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: r ? (r.correct ? "var(--success)" : "var(--error)") : i === qi ? "var(--accent)" : "var(--border)" }} />; })}
    </div>
    <div ref={ref} style={{ flex: 1, overflow: "auto", padding: "20px 24px 40px 50px" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "3px 8px", borderRadius: 3, background: "rgba(128,128,128,0.13)", color: diffCol }}>{q.difficulty}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, padding: "3px 8px", borderRadius: 3, background: "rgba(128,128,128,0.13)", color: "var(--text-dim)" }}>{q.type}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)" }}>{"Q" + (qi + 1) + "/" + total}</span>
      </div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--text)", lineHeight: 1.7, marginBottom: 20, whiteSpace: "pre-wrap" }}>{q.question}</div>
      <textarea value={input} onChange={function(e) { setInput(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter" && !e.shiftKey && input.trim()) { e.preventDefault(); checkAnswer(); } }} disabled={checked} placeholder="Ketik jawaban..." style={{ width: "100%", minHeight: q.type === "explain" || q.type === "draw" || q.type === "debug" ? 120 : 60, background: checked ? "#0d1117" : "var(--bg)", border: "1px solid " + (checked ? (lastResult && lastResult.correct ? "var(--success)" : "var(--error)") : "var(--border)"), borderRadius: 4, padding: 12, color: "var(--text)", fontFamily: "var(--mono)", fontSize: 13, lineHeight: 1.6, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {!checked && <button onClick={checkAnswer} disabled={!input.trim()} style={{ background: input.trim() ? "var(--accent)" : "transparent", color: input.trim() ? "#fff" : "var(--text-muted)", border: input.trim() ? "none" : "1px solid var(--border)", padding: "10px 20px", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, cursor: input.trim() ? "pointer" : "default", borderRadius: 4 }}>Submit</button>}
        {!checked && !showHint && <button onClick={function() { setShowHint(true); }} style={{ background: "transparent", color: "var(--warning)", border: "1px solid rgba(204,167,0,0.3)", padding: "10px 16px", fontFamily: "var(--mono)", fontSize: 12, cursor: "pointer", borderRadius: 4 }}>Hint</button>}
      </div>
      {showHint && !checked && <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(204,167,0,0.04)", borderLeft: "2px solid var(--warning)", fontFamily: "var(--mono)", fontSize: 12, color: "var(--warning)" }}>{q.hint}</div>}
      {checked && lastResult && <div style={{ marginTop: 16, padding: 14, background: (lastResult.correct ? "rgba(78,201,176,0.04)" : "rgba(241,76,76,0.04)"), border: "1px solid " + (lastResult.correct ? "rgba(78,201,176,0.2)" : "rgba(241,76,76,0.2)"), borderRadius: 6 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: lastResult.correct ? "var(--success)" : "var(--error)", fontWeight: 600, marginBottom: 6 }}>{lastResult.correct ? "Benar!" : "Belum tepat"}</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--success)", marginBottom: 8 }}>{"Model: " + q.perfect}</div>
        {!lastResult.correct && q.explanation && <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text)", lineHeight: 1.7, borderTop: "1px solid rgba(128,128,128,0.2)", paddingTop: 8 }}>{q.explanation}</div>}
      </div>}
    </div>
    <div style={{ borderTop: "1px solid var(--border)", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--sidebar)", flexShrink: 0 }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)" }}>{results.filter(function(r) { return r.correct; }).length + "/" + (qi + (checked ? 1 : 0))}</span>
      <span>{checked ? <button onClick={nextQ} style={{ background: "var(--accent)", color: "#fff", border: "none", padding: "6px 16px", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{qi + 1 < total ? "Next" : "Results"}</button> : <span />}</span>
    </div>
  </div>;
}
