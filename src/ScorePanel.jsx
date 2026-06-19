import React, { useState, useEffect } from "react";
import "./CSS/ScorePanel.css";

const EMOTION_META = {
  happy:     { emoji: "😄", color: "#f59e0b", label: "Happy" },
  sad:       { emoji: "😢", color: "#7b9fd4", label: "Sad" },
  angry:     { emoji: "😠", color: "#ef4444", label: "Angry" },
  surprised: { emoji: "😲", color: "#a855f7", label: "Surprised" },
  neutral:   { emoji: "😐", color: "#a3a3a3", label: "Neutral" },
};

function loadScores() {
  try {
    return JSON.parse(sessionStorage.getItem("emotionScores") || "{}");
  } catch { return {}; }
}

function saveScores(scores) {
  sessionStorage.setItem("emotionScores", JSON.stringify(scores));
}

export function recordGamePlayed(emotion) {
  const scores = loadScores();
  scores[emotion] = (scores[emotion] || 0) + 1;
  saveScores(scores);
}

export default function ScorePanel() {
  const [scores, setScores] = useState(loadScores);

  // Re-sync when sessionStorage changes (cross-component)
  useEffect(() => {
    const sync = () => setScores(loadScores());
    window.addEventListener("emotionScoreUpdate", sync);
    return () => window.removeEventListener("emotionScoreUpdate", sync);
  }, []);

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxVal = Math.max(...Object.values(scores), 1);

  // Sort by play count desc
  const sorted = Object.entries(EMOTION_META).sort(
    (a, b) => (scores[b[0]] || 0) - (scores[a[0]] || 0)
  );

  const topEmotion = sorted.find(([k]) => scores[k] > 0);

  return (
    <div className="sp-panel">
      <div className="sp-header">
        <span className="sp-title">Performance</span>
        <span className="sp-total">{total} session{total !== 1 ? "s" : ""}</span>
      </div>

      {total === 0 ? (
        <div className="sp-empty">Play a game to start tracking</div>
      ) : (
        <>
          {/* Top emotion badge */}
          {topEmotion && (
            <div className="sp-top-badge" style={{ borderColor: EMOTION_META[topEmotion[0]].color + "55" }}>
              <span style={{ fontSize: "1.5rem" }}>{EMOTION_META[topEmotion[0]].emoji}</span>
              <div>
                <div className="sp-top-label">Most Played Mood</div>
                <div className="sp-top-name" style={{ color: EMOTION_META[topEmotion[0]].color }}>
                  {EMOTION_META[topEmotion[0]].label}
                </div>
              </div>
              <div className="sp-top-count" style={{ color: EMOTION_META[topEmotion[0]].color }}>
                ×{scores[topEmotion[0]]}
              </div>
            </div>
          )}

          {/* Bar chart */}
          <div className="sp-bars">
            {sorted.map(([key, meta]) => {
              const count = scores[key] || 0;
              const pct   = Math.round((count / maxVal) * 100);
              return (
                <div className="sp-bar-row" key={key}>
                  <span className="sp-bar-emoji">{meta.emoji}</span>
                  <span className="sp-bar-label">{meta.label}</span>
                  <div className="sp-bar-track">
                    <div
                      className="sp-bar-fill"
                      style={{ width: `${pct}%`, background: meta.color, boxShadow: count > 0 ? `0 0 8px ${meta.color}66` : "none" }}
                    />
                  </div>
                  <span className="sp-bar-count" style={{ color: count > 0 ? meta.color : undefined }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
