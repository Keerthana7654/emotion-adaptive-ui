import React, { useState, useMemo } from "react";
import "./CSS/Explore.css";
import Footer from "./Footer";
import { GAMES, MOOD_META, ALL_MOODS } from "./gamesData";
import Nav from "./Nav";

const ALL_TAGS = [...new Set(GAMES.flatMap(g => g.tags))].sort();

function GameCard({ game, onClick }) {
  const meta = MOOD_META[game.mood];

  return (
    <div className="exp-card" onClick={onClick}>
      <div
        className="exp-card-accent"
        style={{ background: `linear-gradient(90deg, ${meta.color}, transparent)` }}
      />
      <div className="exp-card-body">
        <div className="exp-card-footer">
          <span className="exp-card-name">{game.name}</span>
          <div className="exp-card-play" style={{ borderColor: `${meta.color}55` }}>▶</div>
        </div>
        <div className="exp-card-tags">
          {game.tags.map(tag => (
            <span className="exp-card-tag" key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      
    </div>
  );
}

export default function Explore() {
  const [activeMood, setActiveMood] = useState("all");
  const [activeTag,  setActiveTag]  = useState(null);
  const [openGame,   setOpenGame]   = useState(null);

  const filtered = useMemo(() => {
    return GAMES.filter(g => {
      const moodMatch = activeMood === "all" || g.mood === activeMood;
      const tagMatch  = !activeTag || g.tags.includes(activeTag);
      return moodMatch && tagMatch;
    });
  }, [activeMood, activeTag]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(g => {
      if (!map[g.mood]) map[g.mood] = [];
      map[g.mood].push(g);
    });
    return map;
  }, [filtered]);

  const moodsToShow = activeMood === "all"
    ? ALL_MOODS.filter(m => grouped[m]?.length > 0)
    : [activeMood].filter(m => grouped[m]?.length > 0);

  return (
    <div id="exp">
      <Nav></Nav>
      {/* Header */}
      <div className="exp-header">
        <div>
          <div className="exp-title">Game Explorer</div>
          <div className="exp-subtitle">Browse all mood-matched games in one place</div>
        </div>
        <div className="exp-count">{filtered.length} GAMES</div>
      </div>

      {/* Mood filter */}
      <div className="exp-filters">
        <span className="exp-filter-label">Mood</span>
        <button
          className={`exp-filter-btn ${activeMood === "all" ? "active" : ""}`}
          style={activeMood === "all" ? { background: "#fff", color: "#000" } : {}}
          onClick={() => setActiveMood("all")}
        >
          All
        </button>
        {ALL_MOODS.map(mood => {
          const meta     = MOOD_META[mood];
          const isActive = activeMood === mood;
          return (
            <button
              key={mood}
              className={`exp-filter-btn ${isActive ? "active" : ""}`}
              style={isActive ? { background: meta.color, borderColor: meta.color } : {}}
              onClick={() => setActiveMood(mood)}
            >
              <span className="exp-filter-dot" style={{ background: meta.color }} />
              {meta.emoji} {meta.label}
            </button>
          );
        })}
      </div>

      {/* Tag filter */}
      <div className="exp-tag-filters">
        <span className="exp-filter-label">Tag</span>
        {ALL_TAGS.map(tag => (
          <button
            key={tag}
            className={`exp-tag-chip ${activeTag === tag ? "active" : ""}`}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Game sections */}
      {moodsToShow.length === 0 ? (
        <div className="exp-empty">
          <div className="exp-empty-icon">🎮</div>
          <div className="exp-empty-text">No games match your filters</div>
        </div>
      ) : (
        moodsToShow.map(mood => {
          const meta  = MOOD_META[mood];
          const games = grouped[mood];
          return (
            <div className="exp-section" key={mood}>
              <div className="exp-section-header">
                <span className="exp-section-emoji">{meta.emoji}</span>
                <span className="exp-section-name" style={{ color: meta.color }}>
                  {meta.label}
                </span>
                <div
                  className="exp-section-line"
                  style={{ background: `linear-gradient(90deg, ${meta.color}55, transparent)` }}
                />
                <span className="exp-section-count">{games.length} games</span>
              </div>

              <div className="exp-grid">
                {games.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onClick={() => setOpenGame(game)}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* Game overlay */}
      {openGame && (
        <div className="exp-game-overlay">
          <div className="exp-overlay-bar">
            <button className="exp-overlay-back" onClick={() => setOpenGame(null)}>
              ← Back
            </button>
            <span className="exp-overlay-title">{openGame.name}</span>
            <span className="exp-overlay-mood">
              {MOOD_META[openGame.mood].emoji} {openGame.mood}
            </span>
          </div>
          <iframe
            src={openGame.src}
            title={openGame.name}
            allowFullScreen
            allow="fullscreen; autoplay; gamepad"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-gamepad"
          />
        </div>
      )}
      <Footer />
    </div>
  );
}
