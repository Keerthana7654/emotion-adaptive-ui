import React from "react";
import "./CSS/Footer.css";

const MOOD_LINKS = [
  { emoji: "😄", label: "Happy",     color: "#f59e0b" },
  { emoji: "😠", label: "Angry",     color: "#ef4444" },
  { emoji: "😢", label: "Sad",       color: "#7b9fd4" },
  { emoji: "😐", label: "Neutral",   color: "#a3a3a3" },
  { emoji: "😲", label: "Surprised", color: "#a855f7" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Top divider with glow */}
      <div className="footer-top-line" />

      <div className="footer-inner">

        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon">◈</span>
            <span className="footer-logo-text">MoodPlay</span>
          </div>
          <p className="footer-tagline">
            Games that match how you feel.<br />
            Powered by real-time emotion AI.
          </p>
          <div className="footer-badge">
            <span className="footer-badge-dot" />
            AI Face Detection Active
          </div>
        </div>

        {/* Moods */}
        <div className="footer-col">
          <div className="footer-col-title">Moods</div>
          <ul className="footer-links">
            {MOOD_LINKS.map(m => (
              <li key={m.label}>
                <span className="footer-mood-dot" style={{ background: m.color, boxShadow: `0 0 6px ${m.color}` }} />
                <span>{m.emoji} {m.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech */}
        <div className="footer-col">
          <div className="footer-col-title">Built With</div>
          <ul className="footer-links">
            <li><span className="footer-link-icon" style={{ color: "#61dafb" }}>⬡</span> React</li>
            <li><span className="footer-link-icon" style={{ color: "#f59e0b" }}>◈</span> face-api.js</li>
            <li><span className="footer-link-icon" style={{ color: "#00d4ff" }}>◈</span> CrazyGames Embed</li>
            <li><span className="footer-link-icon" style={{ color: "#a855f7" }}>◈</span> CSS Animations</li>
          </ul>
        </div>

        {/* Status */}
        <div className="footer-col">
          <div className="footer-col-title">System</div>
          <ul className="footer-links footer-status">
            <li>
              <span className="status-dot status-ok" />
              <span>Face Detection</span>
              <span className="status-label">Online</span>
            </li>
            <li>
              <span className="status-dot status-ok" />
              <span>Game Engine</span>
              <span className="status-label">Ready</span>
            </li>
            <li>
              <span className="status-dot status-ok" />
              <span>Emotion Models</span>
              <span className="status-label">Loaded</span>
            </li>
            <li>
              <span className="status-dot status-warn" />
              <span>Camera</span>
              <span className="status-label">Awaiting</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span className="footer-copy">© {new Date().getFullYear()} MoodPlay · Emotion-Adaptive Gaming</span>
        <div className="footer-bottom-orbs">
          {MOOD_LINKS.map(m => (
            <span
              key={m.label}
              className="footer-mini-orb"
              title={m.label}
              style={{ background: m.color, boxShadow: `0 0 8px ${m.color}55` }}
            />
          ))}
        </div>
      </div>
    </footer>
  );
}
