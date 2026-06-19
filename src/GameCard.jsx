import React, { useState } from "react";
import "./CSS/GameCard.css";

/**
 * GameCard — shows a click-to-play overlay instead of auto-loading the iframe.
 * Props:
 *   src   {string} — iframe URL
 *   title {string} — game title
 *   accent {string} — optional CSS colour for the play button glow (default cyan)
 */
export default function GameCard({ src, title, accent = "#00d4ff" }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="gc-wrap">
      {playing ? (
        <iframe
          src={src}
          title={title}
          allowFullScreen
          allow="gamepad *; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-gamepad"
          className="gc-iframe"
        />
      ) : (
        <div className="gc-overlay" onClick={() => setPlaying(true)}>
          {/* Thumbnail hint — blurred bg colour */}
          <div className="gc-bg" style={{ "--accent": accent }} />

          <div className="gc-content">
            <button
              className="gc-play-btn"
              style={{ "--accent": accent }}
              aria-label={`Play ${title}`}
            >
              <span className="gc-play-icon">▶</span>
            </button>
            <span className="gc-title">{title}</span>
            <span className="gc-hint">Click to load game</span>
          </div>

          {/* Corner brackets */}
          <div className="gc-corner gc-tl" style={{ borderColor: accent }} />
          <div className="gc-corner gc-br" style={{ borderColor: accent }} />
        </div>
      )}
    </div>
  );
}
