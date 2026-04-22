import { useState, useCallback } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0d0d;
    --surface: #161616;
    --surface2: #1f1f1f;
    --border: #2a2a2a;
    --accent: #e8c547;
    --accent2: #ff6b35;
    --text: #f0ede6;
    --muted: #666;
    --know: #4ade80;
    --dontknow: #f87171;
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

  .app {
    min-height: 100vh;
    background: var(--bg);
    background-image: radial-gradient(ellipse at 20% 20%, rgba(232,197,71,0.04) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 80%, rgba(255,107,53,0.04) 0%, transparent 60%);
    padding: 2rem 1rem;
  }

  .header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .header h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 900;
    letter-spacing: -0.02em;
    line-height: 1;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .header p {
    color: var(--muted);
    font-size: 1rem;
    margin-top: 0.5rem;
    font-weight: 300;
    letter-spacing: 0.05em;
  }

  .container { max-width: 820px; margin: 0 auto; }

  /* INPUT SECTION */
  .input-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .input-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 0.75rem;
  }

  .input-row {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .count-selector {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.4rem 0.75rem;
    font-size: 0.85rem;
    color: var(--text);
  }

  .count-selector select {
    background: transparent;
    border: none;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    cursor: pointer;
    outline: none;
  }

  .count-selector select option { background: #1f1f1f; }

  textarea {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 300;
    line-height: 1.7;
    padding: 1rem 1.25rem;
    resize: vertical;
    min-height: 140px;
    transition: border-color 0.2s;
    outline: none;
    margin-bottom: 1.25rem;
  }

  textarea::placeholder { color: var(--muted); }
  textarea:focus { border-color: var(--accent); }

  .generate-btn {
    width: 100%;
    padding: 0.9rem;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    border: none;
    border-radius: 10px;
    color: #0d0d0d;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
  }

  .generate-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .generate-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* SCORE BAR */
  .score-bar {
    display: flex;
    gap: 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1rem 1.5rem;
    margin-bottom: 2rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .score-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
  }

  .score-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
  }

  .score-dot.know { background: var(--know); }
  .score-dot.dontknow { background: var(--dontknow); }
  .score-dot.remaining { background: var(--muted); }

  .score-label { color: var(--muted); }
  .score-num { font-weight: 500; }

  .progress-bar-wrap {
    flex: 1;
    height: 4px;
    background: var(--border);
    border-radius: 99px;
    overflow: hidden;
    min-width: 80px;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--know), var(--accent));
    border-radius: 99px;
    transition: width 0.5s ease;
  }

  .export-btn {
    margin-left: auto;
    padding: 0.45rem 1rem;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }

  .export-btn:hover { border-color: var(--accent); color: var(--accent); }

  /* NAV */
  .nav-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .nav-btn {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    font-size: 1.2rem;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    display: flex; align-items: center; justify-content: center;
  }

  .nav-btn:hover:not(:disabled) { border-color: var(--accent); background: var(--surface2); }
  .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .nav-counter {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    color: var(--muted);
    min-width: 60px;
    text-align: center;
  }

  .nav-counter span { color: var(--text); font-size: 1.4rem; }

  /* FLASHCARD */
  .card-scene {
    perspective: 1200px;
    margin-bottom: 1.75rem;
    cursor: pointer;
  }

  .card-inner {
    position: relative;
    width: 100%;
    min-height: 260px;
    transform-style: preserve-3d;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card-inner.flipped { transform: rotateY(180deg); }

  .card-face {
    position: absolute;
    width: 100%; min-height: 260px;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border-radius: 16px;
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .card-front {
    background: var(--surface);
    border: 1px solid var(--border);
  }

  .card-back {
    background: var(--surface2);
    border: 1px solid var(--accent);
    transform: rotateY(180deg);
  }

  .card-tag {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 1.25rem;
  }

  .card-back .card-tag { color: var(--accent); }

  .card-text {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.1rem, 3vw, 1.5rem);
    font-weight: 700;
    line-height: 1.4;
    color: var(--text);
  }

  .card-hint {
    margin-top: 1.5rem;
    font-size: 0.78rem;
    color: var(--muted);
    letter-spacing: 0.05em;
  }

  /* ACTION BUTTONS */
  .action-row {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2.5rem;
  }

  .action-btn {
    flex: 1;
    max-width: 200px;
    padding: 0.85rem 1rem;
    border-radius: 10px;
    border: 1px solid;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.15s, opacity 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  }

  .action-btn:hover { transform: translateY(-2px); opacity: 0.85; }

  .btn-know {
    background: rgba(74,222,128,0.1);
    border-color: var(--know);
    color: var(--know);
  }

  .btn-dontknow {
    background: rgba(248,113,113,0.1);
    border-color: var(--dontknow);
    color: var(--dontknow);
  }

  /* ALL CARDS VIEW */
  .all-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
  }

  .mini-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.25rem;
    transition: border-color 0.2s;
  }

  .mini-card.known { border-color: rgba(74,222,128,0.4); }
  .mini-card.unknown { border-color: rgba(248,113,113,0.25); }

  .mini-card-q {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }

  .mini-card-a {
    font-size: 0.8rem;
    color: var(--muted);
    line-height: 1.4;
  }

  .mini-card-badge {
    display: inline-block;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    margin-bottom: 0.6rem;
    font-weight: 500;
  }

  .badge-know { background: rgba(74,222,128,0.15); color: var(--know); }
  .badge-dontknow { background: rgba(248,113,113,0.15); color: var(--dontknow); }
  .badge-new { background: rgba(255,255,255,0.05); color: var(--muted); }

  /* TABS */
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid var(--border);
    padding-bottom: 0;
  }

  .tab {
    padding: 0.6rem 1.25rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
    margin-bottom: -1px;
    letter-spacing: 0.03em;
  }

  .tab.active { color: var(--accent); border-bottom-color: var(--accent); }

  /* LOADING */
  .loading-wrap {
    text-align: center;
    padding: 3rem;
  }

  .spinner {
    width: 36px; height: 36px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-text {
    color: var(--muted);
    font-size: 0.9rem;
  }

  /* ERROR */
  .error-box {
    background: rgba(248,113,113,0.1);
    border: 1px solid rgba(248,113,113,0.3);
    border-radius: 10px;
    padding: 1rem 1.25rem;
    color: var(--dontknow);
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }

  /* COMPLETION */
  .completion-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 3rem 2rem;
    text-align: center;
    margin-bottom: 2rem;
  }

  .completion-emoji { font-size: 3rem; margin-bottom: 1rem; }

  .completion-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .completion-sub { color: var(--muted); font-size: 0.9rem; margin-bottom: 2rem; }

  .completion-stats {
    display: flex;
    gap: 2rem;
    justify-content: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .stat-item { text-align: center; }
  .stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    font-weight: 700;
  }
  .stat-num.know { color: var(--know); }
  .stat-num.dontknow { color: var(--dontknow); }
  .stat-label { font-size: 0.75rem; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }

  .restart-btn {
    padding: 0.75rem 2rem;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border: none;
    border-radius: 10px;
    color: #0d0d0d;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .restart-btn:hover { opacity: 0.85; }
`;

export default function FlashcardApp() {
  const [topic, setTopic] = useState("");
  const [cardCount, setCardCount] = useState(8);
  const [cards, setCards] = useState([]);
  const [scores, setScores] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("study"); // "study" | "all"
  const [done, setDone] = useState(false);

  const generateCards = useCallback(async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    setCards([]);
    setScores({});
    setCurrentIdx(0);
    setIsFlipped(false);
    setDone(false);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Generate exactly ${cardCount} flashcards about: "${topic}".
Respond ONLY with a valid JSON array, no markdown, no explanation, no backticks.
Format: [{"q":"question text","a":"answer text"}, ...]
Make questions concise and answers clear and informative. Cover different aspects of the topic.`
          }]
        })
      });

      const data = await response.json();
      const raw = data.content?.map(b => b.text || "").join("") || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("No cards generated");
      setCards(parsed);
    } catch (e) {
      setError("Couldn't generate flashcards. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  }, [topic, cardCount]);

  const handleScore = (result) => {
    setScores(s => ({ ...s, [currentIdx]: result }));
    setTimeout(() => {
      if (currentIdx < cards.length - 1) {
        setCurrentIdx(i => i + 1);
        setIsFlipped(false);
      } else {
        setDone(true);
      }
    }, 300);
  };

  const restart = () => {
    setCurrentIdx(0);
    setScores({});
    setIsFlipped(false);
    setDone(false);
    setView("study");
  };

  const exportPDF = () => {
    const rows = cards.map((c, i) => {
      const s = scores[i];
      const status = s === "know" ? "✓ Know" : s === "dontknow" ? "✗ Review" : "—";
      return `<tr style="border-bottom:1px solid #eee">
        <td style="padding:10px;font-weight:600;width:40%">${c.q}</td>
        <td style="padding:10px;width:45%">${c.a}</td>
        <td style="padding:10px;text-align:center;color:${s==='know'?'green':s==='dontknow'?'red':'#999'}">${status}</td>
      </tr>`;
    }).join("");

    const html = `<!DOCTYPE html><html><head><title>Flashcards: ${topic}</title>
    <style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;color:#111}
    h1{font-size:2rem;margin-bottom:0.25rem}p{color:#666;margin-bottom:2rem}
    table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px;background:#f5f5f5;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.05em}
    </style></head><body>
    <h1>${topic}</h1><p>${cards.length} flashcards</p>
    <table><thead><tr><th>Question</th><th>Answer</th><th>Status</th></tr></thead>
    <tbody>${rows}</tbody></table></body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `flashcards-${topic.slice(0,20).replace(/\s/g,"-")}.html`;
    a.click(); URL.revokeObjectURL(url);
  };

  const knownCount = Object.values(scores).filter(v => v === "know").length;
  const dontknowCount = Object.values(scores).filter(v => v === "dontknow").length;
  const progressPct = cards.length > 0 ? Math.round((knownCount / cards.length) * 100) : 0;

  const card = cards[currentIdx];

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="container">
          <div className="header">
            <h1>FlashMind</h1>
            <p>AI-powered flashcards — learn anything, faster</p>
          </div>

          {/* INPUT */}
          <div className="input-card">
            <label className="input-label">Topic or Paste Your Notes</label>
            <textarea
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. 'Photosynthesis', 'JavaScript closures', or paste a paragraph of notes..."
            />
            <div className="input-row">
              <div className="count-selector">
                <span style={{color: "var(--muted)", fontSize:"0.8rem"}}>Cards:</span>
                <select value={cardCount} onChange={e => setCardCount(Number(e.target.value))}>
                  {[4,6,8,10,12,15].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <button
              className="generate-btn"
              onClick={generateCards}
              disabled={loading || !topic.trim()}
            >
              {loading ? "Generating..." : "✦ Generate Flashcards"}
            </button>
          </div>

          {error && <div className="error-box">⚠ {error}</div>}

          {loading && (
            <div className="loading-wrap">
              <div className="spinner" />
              <p className="loading-text">Crafting your flashcards…</p>
            </div>
          )}

          {cards.length > 0 && !loading && (
            <>
              {/* SCORE BAR */}
              <div className="score-bar">
                <div className="score-item">
                  <div className="score-dot know" />
                  <span className="score-label">Know</span>
                  <span className="score-num">&nbsp;{knownCount}</span>
                </div>
                <div className="score-item">
                  <div className="score-dot dontknow" />
                  <span className="score-label">Review</span>
                  <span className="score-num">&nbsp;{dontknowCount}</span>
                </div>
                <div className="score-item">
                  <div className="score-dot remaining" />
                  <span className="score-label">Left</span>
                  <span className="score-num">&nbsp;{cards.length - knownCount - dontknowCount}</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{width: `${progressPct}%`}} />
                </div>
                <button className="export-btn" onClick={exportPDF}>⤓ Export</button>
              </div>

              {/* TABS */}
              <div className="tabs">
                <button className={`tab${view==="study"?" active":""}`} onClick={() => setView("study")}>
                  Study Mode
                </button>
                <button className={`tab${view==="all"?" active":""}`} onClick={() => setView("all")}>
                  All Cards ({cards.length})
                </button>
              </div>

              {/* STUDY VIEW */}
              {view === "study" && (
                done ? (
                  <div className="completion-box">
                    <div className="completion-emoji">
                      {knownCount === cards.length ? "🏆" : knownCount > cards.length / 2 ? "🎯" : "💪"}
                    </div>
                    <div className="completion-title">Session Complete!</div>
                    <div className="completion-sub">You went through all {cards.length} cards</div>
                    <div className="completion-stats">
                      <div className="stat-item">
                        <div className="stat-num know">{knownCount}</div>
                        <div className="stat-label">Know it</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-num dontknow">{dontknowCount}</div>
                        <div className="stat-label">Need review</div>
                      </div>
                      <div className="stat-item">
                        <div className="stat-num" style={{color:"var(--accent)"}}>{progressPct}%</div>
                        <div className="stat-label">Score</div>
                      </div>
                    </div>
                    <button className="restart-btn" onClick={restart}>↺ Study Again</button>
                  </div>
                ) : (
                  <>
                    <div className="nav-row">
                      <button className="nav-btn" onClick={() => { setCurrentIdx(i => i-1); setIsFlipped(false); }} disabled={currentIdx === 0}>‹</button>
                      <div className="nav-counter"><span>{currentIdx + 1}</span> / {cards.length}</div>
                      <button className="nav-btn" onClick={() => { setCurrentIdx(i => i+1); setIsFlipped(false); }} disabled={currentIdx === cards.length - 1}>›</button>
                    </div>

                    <div className="card-scene" onClick={() => setIsFlipped(f => !f)}>
                      <div className={`card-inner${isFlipped ? " flipped" : ""}`}>
                        <div className="card-face card-front">
                          {scores[currentIdx] && (
                            <div style={{
                              position:"absolute", top:"1rem", right:"1rem",
                              fontSize:"0.7rem", letterSpacing:"0.1em", textTransform:"uppercase",
                              color: scores[currentIdx]==="know" ? "var(--know)" : "var(--dontknow)",
                              fontWeight:500
                            }}>
                              {scores[currentIdx]==="know" ? "✓ Know" : "✗ Review"}
                            </div>
                          )}
                          <div className="card-tag">Question</div>
                          <div className="card-text">{card?.q}</div>
                          <div className="card-hint">tap to reveal answer</div>
                        </div>
                        <div className="card-face card-back">
                          <div className="card-tag">Answer</div>
                          <div className="card-text">{card?.a}</div>
                        </div>
                      </div>
                    </div>

                    <div className="action-row">
                      <button className="action-btn btn-dontknow" onClick={() => handleScore("dontknow")}>✗ Need Review</button>
                      <button className="action-btn btn-know" onClick={() => handleScore("know")}>✓ Know It</button>
                    </div>
                  </>
                )
              )}

              {/* ALL CARDS VIEW */}
              {view === "all" && (
                <div className="all-cards-grid">
                  {cards.map((c, i) => {
                    const s = scores[i];
                    return (
                      <div key={i} className={`mini-card${s==="know"?" known":s==="dontknow"?" unknown":""}`}>
                        <div className={`mini-card-badge ${s==="know"?"badge-know":s==="dontknow"?"badge-dontknow":"badge-new"}`}>
                          {s==="know" ? "✓ Know" : s==="dontknow" ? "✗ Review" : `Card ${i+1}`}
                        </div>
                        <div className="mini-card-q">{c.q}</div>
                        <div className="mini-card-a">{c.a}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

