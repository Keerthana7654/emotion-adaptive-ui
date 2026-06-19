import React from "react";
import "./CSS/EmotionConfidencePanel.css";

const EMOTION_META = {
  happy:     { emoji: "😄", color: "#f59e0b" },
  sad:       { emoji: "😢", color: "#7b9fd4" },
  angry:     { emoji: "😠", color: "#ef4444" },
  surprised: { emoji: "😲", color: "#a855f7" },
  neutral:   { emoji: "😐", color: "#a3a3a3" },
  fearful:   { emoji: "😨", color: "#34d399" },
  disgusted: { emoji: "🤢", color: "#84cc16" },
};

export default function EmotionConfidencePanel({ expressions, countdown }) {
  if (!expressions) {
    return (
      <div className="ecp-panel">
        <div className="ecp-header">
          <span className="ecp-title">Emotion Scanner</span>
          <span className="ecp-scanning">Initializing…</span>
        </div>
        <div className="ecp-placeholder">
          {Object.keys(EMOTION_META).map((key) => (
            <div className="ecp-row" key={key}>
              <span className="ecp-emoji">{EMOTION_META[key].emoji}</span>
              <span className="ecp-label">{key}</span>
              <div className="ecp-bar-track">
                <div className="ecp-bar-fill ecp-bar-empty" />
              </div>
              <span className="ecp-pct">—</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sort by confidence descending
  const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
  const topEmotion = sorted[0]?.[0];

  return (
    <div className="ecp-panel">
      <div className="ecp-header">
        <span className="ecp-title">Live Scan</span>
        <div className="ecp-countdown">
          <svg className="ecp-ring" viewBox="0 0 36 36">
            <circle className="ecp-ring-bg" cx="18" cy="18" r="15" />
            <circle
              className="ecp-ring-fill"
              cx="18" cy="18" r="15"
              style={{
                strokeDashoffset: 94.2 - (countdown / 5) * 94.2,
                stroke: EMOTION_META[topEmotion]?.color || "#fff",
              }}
            />
          </svg>
          <span className="ecp-countdown-num">{countdown}s</span>
        </div>
      </div>

      <div className="ecp-rows">
        {sorted.map(([emotion, score]) => {
          const meta  = EMOTION_META[emotion] || { emoji: "🙂", color: "#888" };
          const pct   = Math.round(score * 100);
          const isTop = emotion === topEmotion;
          return (
            <div className={`ecp-row ${isTop ? "ecp-row-top" : ""}`} key={emotion}>
              <span className="ecp-emoji">{meta.emoji}</span>
              <span className="ecp-label">{emotion}</span>
              <div className="ecp-bar-track">
                <div
                  className="ecp-bar-fill"
                  style={{
                    width: `${pct}%`,
                    background: meta.color,
                    boxShadow: isTop ? `0 0 8px ${meta.color}88` : "none",
                  }}
                />
              </div>
              <span className="ecp-pct" style={{ color: isTop ? meta.color : undefined }}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>

      <div className="ecp-footer">
        <span className="ecp-footer-dot" style={{ background: EMOTION_META[topEmotion]?.color }} />
        <span>
          Leading: <strong style={{ color: EMOTION_META[topEmotion]?.color }}>{topEmotion}</strong>
        </span>
      </div>
    </div>
  );
}
