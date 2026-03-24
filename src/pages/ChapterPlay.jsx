import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChapter, getGlossary, saveProgress } from "../api/client";
import DialogueLine from "../engine/DialogueLine";
import ChoicePanel from "../engine/ChoicePanel";
import CodeChallenge from "../engine/CodeChallenge";
import FileExplorer from "../components/FileExplorer";
import GlossarySidebar from "../components/GlossarySidebar";
import DefinitionTooltip from "../components/DefinitionTooltip";
import DeepDiveMode from "../components/DeepDiveMode";
import { PracticeMode, CheatsheetMode, BugsMode, TracerMode, InterviewMode, FlashcardMode, DeepQuizMode } from "../components/ExtraModes";

var MODE_DEFS = [
  { id: "story", lb: "story.md" },
  { id: "deepdive", lb: "deep_dive.md" },
  { id: "practice", lb: "practice.java" },
  { id: "cheatsheet", lb: "cheatsheet.md" },
  { id: "bugs", lb: "bugs.java" },
  { id: "tracer", lb: "tracer.java" },
  { id: "interview", lb: "quiz.md" },
  { id: "flashcard", lb: "flashcard.md" },
  { id: "deepquiz", lb: "deep_quiz.java" },
];

function isJ(l) { return l.endsWith(".java"); }

// ═══ STORY MODE (inline — needs scene engine) ═══
function StoryMode(props) {
  var chapter = props.chapter;
  var glossary = props.glossary;
  var onTermClick = props.onTermClick;
  var scenes = chapter.scenes || [];

  var _fi = useState(0), fileIdx = _fi[0], setFileIdx = _fi[1];
  var _li = useState(0), lineIdx = _li[0], setLineIdx = _li[1];
  var _sh = useState([0]), shownLines = _sh[0], setShownLines = _sh[1];
  var _cd = useState(false), currentDone = _cd[0], setCurrentDone = _cd[1];
  var _wc = useState(false), waitChoice = _wc[0], setWaitChoice = _wc[1];
  var _cm = useState(null), choiceMade = _cm[0], setChoiceMade = _cm[1];
  var _ca = useState(false), challengeActive = _ca[0], setChallengeActive = _ca[1];
  var _cd2 = useState(false), challengeDone = _cd2[0], setChallengeDone = _cd2[1];
  var scrollRef = useRef(null);

  var getFiles = useCallback(function() {
    var ordered = [];
    var usedGroups = {};
    var sorted = scenes.slice().sort(function(a, b) { return a.order - b.order; });
    sorted.forEach(function(s) {
      if (s.is_choice_target && s.choice_group) {
        if (!usedGroups[s.choice_group]) {
          usedGroups[s.choice_group] = true;
          if (choiceMade) {
            var chosen = sorted.find(function(x) { return x.slug === choiceMade; });
            if (chosen) ordered.push(chosen);
          } else {
            ordered.push({ slug: "_pending", filename: "02_investigation.md", lines: [] });
          }
        }
      } else {
        ordered.push(s);
      }
    });
    return ordered;
  }, [scenes, choiceMade]);

  var files = getFiles();
  var currentFile = files[fileIdx];
  var currentScene = currentFile && currentFile.lines && currentFile.lines.length > 0 ? currentFile : null;
  var hasChallenge = currentFile && currentFile.filename && currentFile.filename.endsWith(".java") && chapter.challenge;

  useEffect(function() { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [shownLines, challengeActive]);
  useEffect(function() {
    if (currentDone && currentScene) {
      var line = currentScene.lines[lineIdx];
      if (line && line.choice && !waitChoice) setWaitChoice(true);
    }
  }, [currentDone, lineIdx]);

  var advanceLine = function() {
    if (!currentDone || !currentScene) return;
    var line = currentScene.lines[lineIdx];
    if (line && line.choice) { setWaitChoice(true); return; }
    var next = lineIdx + 1;
    if (next < currentScene.lines.length) { setLineIdx(next); setShownLines(function(p) { return p.concat([next]); }); setCurrentDone(false); }
  };
  var advanceFile = function(force) {
    if (!force && hasChallenge && !challengeDone) { setChallengeActive(true); return; }
    var next = fileIdx + 1;
    if (next < files.length) { setFileIdx(next); setLineIdx(0); setShownLines([0]); setCurrentDone(false); setWaitChoice(false); setChallengeActive(false); }
  };
  var handleChoice = function(slug) {
    setChoiceMade(slug); setWaitChoice(false);
    setTimeout(function() { setFileIdx(function(p) { return p + 1; }); setLineIdx(0); setShownLines([0]); setCurrentDone(false); setChallengeActive(false); }, 0);
  };

  var isLastLine = currentScene && lineIdx >= currentScene.lines.length - 1;
  var isLastFile = fileIdx >= files.length - 1;
  var lastLineHasChoice = currentScene && currentScene.lines[currentScene.lines.length - 1] && currentScene.lines[currentScene.lines.length - 1].choice;

  return <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <div ref={scrollRef} style={{ flex: 1, overflow: "auto", padding: "12px 0 100px" }}>
      <div style={{ padding: "4px 16px 8px 66px", color: "var(--text-muted)", fontSize: 11, fontFamily: "var(--mono)" }}>
        {(chapter.slug || "").replace(/-/g, "_") + " > " + (currentFile ? currentFile.filename : "")}
      </div>
      {currentScene && shownLines.map(function(lIdx, i) {
        var line = currentScene.lines[lIdx];
        if (!line) return null;
        var isLatest = i === shownLines.length - 1;
        return <div key={fileIdx + "-" + lIdx} style={{ animation: isLatest ? "fadeIn 0.2s ease" : "none" }}>
          <DialogueLine line={line} lineNum={lIdx + 1} isLatest={isLatest}
            onDone={function() { if (isLatest) setCurrentDone(true); }}
            skipAll={!isLatest} glossary={glossary} onTermClick={onTermClick} />
          {isLatest && line.choice && waitChoice && <ChoicePanel options={line.choice.options} onChoice={handleChoice} />}
        </div>;
      })}
      {challengeActive && chapter.challenge && <div style={{ padding: "0 0 0 0px" }}>
        <CodeChallenge challenge={chapter.challenge} onComplete={function() { setChallengeDone(true); setChallengeActive(false); advanceFile(true); }} />
      </div>}
      {!currentScene && <div style={{ padding: "40px 66px", color: "var(--text-muted)", fontFamily: "var(--mono)", fontSize: 13 }}>// Pilih path di scene sebelumnya...</div>}
    </div>
    {!waitChoice && !challengeActive && currentScene && <div style={{ borderTop: "1px solid var(--border)", padding: "8px 16px", display: "flex", justifyContent: "flex-end", gap: 8, background: "var(--sidebar)", flexShrink: 0 }}>
      {isLastLine && !isLastFile && !lastLineHasChoice ? <button onClick={function() { advanceFile(); }} style={{ background: "var(--accent)", color: "#fff", border: "none", padding: "6px 20px", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{hasChallenge && !challengeDone ? "Challenge" : "Next"}</button>
      : isLastLine && isLastFile && !lastLineHasChoice ? <span style={{ color: "var(--text-dim)", fontFamily: "var(--mono)", fontSize: 12 }}>Done</span>
      : <button onClick={advanceLine} disabled={!currentDone} style={{ background: currentDone ? "var(--tab)" : "transparent", color: currentDone ? "var(--text)" : "var(--text-muted)", border: "1px solid " + (currentDone ? "var(--border)" : "transparent"), padding: "6px 20px", fontFamily: "var(--mono)", fontSize: 12, cursor: currentDone ? "pointer" : "default" }}>{currentDone ? "Continue" : "..."}</button>}
    </div>}
  </div>;
}

// ═══ MAIN PAGE ═══
export default function ChapterPlay() {
  var params = useParams(), slug = params.slug;
  var navigate = useNavigate();
  var _ch = useState(null), chapter = _ch[0], setChapter = _ch[1];
  var _gl = useState([]), glossary = _gl[0], setGlossary = _gl[1];
  var _ld = useState(true), loading = _ld[0], setLoading = _ld[1];
  var _m = useState("story"), mode = _m[0], setMode = _m[1];
  var _t = useState(null), activeTerm = _t[0], setActiveTerm = _t[1];

  useEffect(function() {
    setLoading(true);
    Promise.all([getChapter(slug), getGlossary()]).then(function(r) {
      setChapter(r[0]); setGlossary(r[1]);
    }).finally(function() { setLoading(false); });
  }, [slug]);

  var onT = function(k) { setActiveTerm(activeTerm === k ? null : k); };
  var glossaryMap = {};
  glossary.forEach(function(g) { glossaryMap[g.key] = g; });

  if (loading) return <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", color: "var(--text-dim)", fontSize: 13 }}>Loading...</div>;
  if (!chapter) return <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", color: "var(--error)", fontSize: 13 }}>Not found <button onClick={function() { navigate("/"); }} style={{ marginLeft: 12, background: "var(--accent)", color: "#fff", border: "none", padding: "6px 16px", fontFamily: "var(--mono)", fontSize: 12, cursor: "pointer" }}>Back</button></div>;

  return <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh" }}>
    {/* TITLEBAR */}
    <div style={{ height: 30, background: "var(--titlebar)", display: "flex", alignItems: "center", padding: "0 12px", borderBottom: "1px solid var(--border)", justifyContent: "space-between", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span onClick={function() { navigate("/"); }} style={{ color: "var(--accent)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{"</>"}</span>
        <span style={{ color: "var(--text-dim)", fontSize: 12 }}>{"Code Chronicle — " + chapter.title}</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}><span style={{ color: "var(--text-dim)", fontSize: 11 }}>-</span><span style={{ color: "var(--text-dim)", fontSize: 11 }}>o</span><span style={{ color: "var(--text-dim)", fontSize: 11 }}>x</span></div>
    </div>

    {/* MAIN */}
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* SIDEBAR */}
      <div style={{ width: 185, background: "var(--sidebar)", borderRight: "1px solid var(--border)", overflow: "auto", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "8px 12px", fontSize: 11, fontWeight: 600, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1 }}>Explorer</div>
        <div style={{ padding: "4px 12px", fontSize: 12, fontFamily: "var(--mono)" }}><span style={{ color: "var(--text-dim)" }}>{"v "}</span><span style={{ color: "var(--fn)" }}>{(chapter.slug || "").replace(/-/g, "_") + "/"}</span></div>
        {MODE_DEFS.map(function(md) {
          return <div key={md.id} onClick={function() { setMode(md.id); }} style={{ padding: "3px 12px 3px 28px", fontSize: 11.5, cursor: "pointer", background: md.id === mode ? "var(--selection)" : "transparent", color: md.id === mode ? "var(--text)" : "var(--text-dim)", fontFamily: "var(--mono)", borderLeft: md.id === mode ? "2px solid var(--accent)" : "2px solid transparent" }}>
            <span style={{ color: isJ(md.lb) ? "var(--error)" : "var(--keyword)", marginRight: 5, fontSize: 10 }}>{isJ(md.lb) ? "F" : "f"}</span>{md.lb}
          </div>;
        })}
        <div style={{ borderTop: "1px solid var(--border)", flex: 1, overflow: "auto", marginTop: 8 }}>
          <GlossarySidebar glossary={glossary} activeKey={activeTerm} onSelect={onT} />
        </div>
      </div>

      {/* EDITOR */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* TABS */}
        <div style={{ display: "flex", background: "var(--tab)", borderBottom: "1px solid var(--border)", flexShrink: 0, overflow: "auto" }}>
          {MODE_DEFS.map(function(md) {
            return <div key={md.id} onClick={function() { setMode(md.id); }} style={{ padding: "6px 12px", fontSize: 11.5, cursor: "pointer", background: md.id === mode ? "var(--tab-active)" : "var(--tab)", color: md.id === mode ? "var(--text)" : "var(--text-dim)", borderTop: md.id === mode ? "1px solid var(--accent)" : "1px solid transparent", borderRight: "1px solid var(--border)", fontFamily: "var(--mono)", whiteSpace: "nowrap" }}>
              <span style={{ color: isJ(md.lb) ? "var(--error)" : "var(--keyword)", marginRight: 4, fontSize: 10 }}>{isJ(md.lb) ? "F" : "f"}</span>{md.lb}
            </div>;
          })}
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {mode === "story" && <StoryMode chapter={chapter} glossary={glossary} onTermClick={onT} />}
          {mode === "deepdive" && <DeepDiveMode levels={chapter.deep_dives} glossary={glossary} onTermClick={onT} />}
          {mode === "practice" && <PracticeMode questions={chapter.practices} />}
          {mode === "cheatsheet" && <CheatsheetMode cards={chapter.cheatsheets} />}
          {mode === "bugs" && <BugsMode bugs={chapter.bugs} />}
          {mode === "tracer" && <TracerMode traces={chapter.traces} />}
          {mode === "interview" && <InterviewMode questions={chapter.interviews} />}
          {mode === "flashcard" && <FlashcardMode cards={chapter.flashcards} />}
          {mode === "deepquiz" && <DeepQuizMode questions={chapter.deep_quizzes} />}
        </div>
      </div>
    </div>

    {/* STATUSBAR */}
    <div style={{ height: 24, background: "var(--statusbar)", display: "flex", alignItems: "center", padding: "0 12px", justifyContent: "space-between", flexShrink: 0 }}>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{"Code Chronicle Ch." + chapter.order}</span>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{mode + " | UTF-8"}</span>
    </div>

    {/* TOOLTIP */}
    {activeTerm && glossaryMap[activeTerm] && <DefinitionTooltip entry={glossaryMap[activeTerm]} onClose={function() { setActiveTerm(null); }} />}
  </div>;
}
