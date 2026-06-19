import React from 'react';
import GameCard from "./GameCard";
import "./CSS/Surprised.css";

const games = [
  { src: "https://games.crazygames.com/en_US/horse-family-animal-simulator-3d/index.html", title: "Horse Family Simulator" },
  { src: "https://games.crazygames.com/en_US/miniblox/index.html",                         title: "Miniblox" },
  { src: "https://games.crazygames.com/en_US/bloxdhop-io/index.html",                      title: "BloxdHop.io" },
  { src: "https://games.crazygames.com/en_US/heroes-assemble/index.html",                  title: "Heroes Assemble" },
  { src: "https://games.crazygames.com/en_US/obby-1-jump-per-click/index.html",            title: "Obby Jump" },
  { src: "https://games.crazygames.com/en_US/survive-the-disasters-obby/index.html",       title: "Survive the Disasters" },
  { src: "https://games.crazygames.com/en_US/mahjongg-solitaire/index.html",               title: "Mahjongg Solitaire" },
  { src: "https://games.crazygames.com/en_US/uno-online/index.html",                       title: "UNO Online" },
  { src: "https://games.crazygames.com/en_US/word-wipe/index.html",                        title: "Word Wipe" },
  { src: "https://games.crazygames.com/en_US/hypemaster/index.html",                       title: "Hypemaster" },
  { src: "https://games.crazygames.com/en_US/forest-spirit-farm-fight/index.html",         title: "Forest Spirit" },
  { src: "https://games.crazygames.com/en_US/black-light-escape-2/index.html",             title: "Black Light Escape 2" },
];

const stars = Array.from({ length: 12 });

export default function Surprised({ data, backendGames = [] }) {
  // Merge backend-added games (admin panel) with local list
  const backendSrcs = new Set(backendGames.map(g => g.src));
  const localOnly = games.filter(g => !backendSrcs.has(g.src));
  const mergedGames = [
    ...backendGames.map(g => ({ src: g.src, title: g.name })),
    ...localOnly,
  ];
  return (
    <div id="surprised">
      {/* Twinkling stars */}
      <div className="stars">
        {stars.map((_, i) => <div className="star" key={i} />)}
      </div>

      <div id="content">
        <div className="burst-icon">🌟</div>
        <div className="surprised-eyebrow">Whoa — Emotion Detected</div>

        <h1 className="surprised-title">
          Discover a<br />New Adventure!
        </h1>

        <p className="surprised-sub">Something unexpected awaits you</p>

        <div className="emotion-tag">
          <div className="spark-dot" />
          <span>Mood —&nbsp;</span>
          <strong>{data}</strong>
        </div>
      </div>

      <div className="section-label">
        <span>✦ Surprise Games for You</span>
      </div>

      <div className="games-grid">
        {mergedGames.map((game, i) => (
          <GameCard src={game.src} title={game.title} accent="#a855f7" />
        ))}
      </div>
    </div>
  );
}
