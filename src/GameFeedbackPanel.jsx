import React, { useState } from "react";
import "./CSS/GameFeedbackPanel.css";

const RATINGS = [
  { value: 5, emoji: "🤩", label: "Amazing" },
  { value: 4, emoji: "😄", label: "Fun" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 2, emoji: "😕", label: "Boring" },
  { value: 1, emoji: "😤", label: "Terrible" },
];

const TAGS = ["Too Easy", "Too Hard", "Great Graphics", "Laggy", "Addictive", "Short", "Would Replay"];

export default function GameFeedbackPanel({ emotion, onFeedbackSubmit }) {
  const [selected, setSelected]     = useState(null);
  const [activeTags, setActiveTags] = useState([]);
  const [note, setNote]             = useState("");
  const [submitted, setSubmitted]   = useState(false);

  const toggleTag = (tag) => {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (!selected) return;
    const feedback = {
      rating: selected,
      tags: activeTags,
      note,
      emotion,
      time: new Date().toLocaleTimeString(),
    };
    // Persist to sessionStorage
    const existing = JSON.parse(sessionStorage.getItem("gameFeedback") || "[]");
    sessionStorage.setItem("gameFeedback", JSON.stringify([feedback, ...existing].slice(0, 20)));
    onFeedbackSubmit?.(feedback);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelected(null);
    setActiveTags([]);
    setNote("");
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="gfp-panel">
        <div className="gfp-success">
          <div className="gfp-success-icon">✓</div>
          <p className="gfp-success-title">Thanks for the feedback!</p>
          <p className="gfp-success-sub">
            You rated this a{" "}
            <strong>{RATINGS.find(r => r.value === selected)?.label}</strong>{" "}
            {RATINGS.find(r => r.value === selected)?.emoji}
          </p>
          <button className="gfp-reset-btn" onClick={handleReset}>
            Rate Another Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gfp-panel">
      <div className="gfp-header">
        <span className="gfp-title">How was the game?</span>
        <span className="gfp-mood-badge">Mood: {emotion}</span>
      </div>

      {/* Star / emoji rating */}
      <div className="gfp-ratings">
        {RATINGS.map((r) => (
          <button
            key={r.value}
            className={`gfp-rating-btn ${selected === r.value ? "gfp-rating-active" : ""}`}
            onClick={() => setSelected(r.value)}
            title={r.label}
          >
            <span className="gfp-rating-emoji">{r.emoji}</span>
            <span className="gfp-rating-label">{r.label}</span>
          </button>
        ))}
      </div>

      {/* Tag chips */}
      <div className="gfp-section-label">Quick tags</div>
      <div className="gfp-tags">
        {TAGS.map(tag => (
          <button
            key={tag}
            className={`gfp-tag ${activeTags.includes(tag) ? "gfp-tag-active" : ""}`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Optional note */}
      <div className="gfp-section-label">Note (optional)</div>
      <textarea
        className="gfp-textarea"
        placeholder="Anything else to add…"
        value={note}
        onChange={e => setNote(e.target.value)}
        rows={3}
        maxLength={200}
      />

      <button
        className={`gfp-submit ${selected ? "gfp-submit-ready" : ""}`}
        onClick={handleSubmit}
        disabled={!selected}
      >
        Submit Feedback
      </button>
    </div>
  );
}
