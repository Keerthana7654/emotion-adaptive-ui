import React, { useState, useRef, useEffect } from "react";
import "./CSS/Search.css";
import { GAMES, MOOD_META } from "./gamesData";

// Map gamesData format to search format (src → url)
const ALL_GAMES = GAMES.map(g => ({ name: g.name, url: g.src, mood: g.mood }));

const MOOD_COLORS = Object.fromEntries(
  Object.entries(MOOD_META).map(([key, val]) => [
    key, { dot: val.color }
  ])
);

export default function Search() {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState([]);
  const [open, setOpen]         = useState(false);
  const [selected, setSelected] = useState(null);
  const inputRef  = useRef(null);
  const wrapperRef = useRef(null);

  // Filter on keystroke
  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSelected(null);
    if (val.trim().length === 0) {
      setResults([]);
      setOpen(false);
      return;
    }
    const filtered = ALL_GAMES.filter(g =>
      g.name.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 8);
    setResults(filtered);
    setOpen(true);
  };

  // Click a result → open game in iframe overlay
  const handleSelect = (game) => {
    setSelected(game);
    setQuery(game.name);
    setOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    setSelected(null);
    inputRef.current?.focus();
  };

  return (
    <>
      <div className="search-wrapper" ref={wrapperRef}>
        {/* Input */}
        <div className={`search-input-row ${open ? "active" : ""}`}>
          <span className="search-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search a game…"
            value={query}
            onChange={handleChange}
            onFocus={() => results.length > 0 && setOpen(true)}
            autoComplete="off"
          />
          {query && (
            <button className="search-clear" onClick={clearSearch} aria-label="Clear">
              ✕
            </button>
          )}
        </div>

        {/* Dropdown */}
        {open && results.length > 0 && (
          <ul className="search-dropdown">
            {results.map((game, i) => {
              const mc = MOOD_COLORS[game.mood] || MOOD_COLORS.neutral;
              return (
                <li key={i} className="search-item" onClick={() => handleSelect(game)}>
                  <span className="search-item-dot" style={{ background: mc.dot }} />
                  <span className="search-item-name">
                    {highlightMatch(game.name, query)}
                  </span>
                  <span className="search-item-mood" style={{ color: mc.dot }}>
                    {game.mood}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {open && results.length === 0 && query.trim().length > 0 && (
          <div className="search-empty">No games found for "{query}"</div>
        )}
      </div>

      {/* Game overlay */}
      {selected && (
        <div className="game-overlay">
          <div className="game-overlay-header">
            <span className="game-overlay-title">{selected.name}</span>
            <button className="game-overlay-close" onClick={() => setSelected(null)}>
              ✕ Close
            </button>
          </div>
          <iframe
            src={selected.url}
            title={selected.name}
            allowFullScreen
            allow="fullscreen; autoplay; gamepad"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-gamepad"
          />
        </div>
      )}
    </>
  );
}

// Bold the matching substring in the result label
function highlightMatch(name, query) {
  const idx = name.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return name;
  return (
    <>
      {name.slice(0, idx)}
      <strong>{name.slice(idx, idx + query.length)}</strong>
      {name.slice(idx + query.length)}
    </>
  );
}