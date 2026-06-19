import React from "react";
import GameCard from "./GameCard";
import "./CSS/Happy.css";

const games = [
  { src: "https://games.crazygames.com/en_US/happyville-merge-farm-gtu/index.html", title: "Happyville Merge Farm" },
  { src: "https://games.crazygames.com/en_US/skydom-reforged/index.html", title: "Skydom Reforged" },
  { src: "https://games.crazygames.com/en_US/fortzone-battle-royale-xkd/index.html", title: "Fortzone Battle Royale" },
  { src: "https://games.crazygames.com/en_US/pulse-ball/index.html", title: "Pulse Ball" },
  { src: "https://games.crazygames.com/en_US/ragdoll-archers/index.html", title: "Ragdoll Archers" },
  { src: "https://games.crazygames.com/en_US/immortal-dark-slayer/index.html", title: "Immortal Dark Slayer" },
  { src: "https://games.crazygames.com/embed/dragon-simulator-3d/index.html", title: "Dragon Simulator 3D" },
  { src: "https://games.crazygames.com/en_US/bubble-blast-pwd/index.html", title: "Bubble Blast" },
  { src: "https://games.crazygames.com/en_US/count-masters-stickman-games/index.html", title: "Count Masters" },
  { src: "https://games.crazygames.com/en_US/bubble-story/index.html", title: "Bubble Story" },
  { src: "https://games.crazygames.com/en_US/racing-limits/index.html", title: "Racing Limits" },
  { src: "https://games.crazygames.com/en_US/super-mx-last-season/index.html", title: "Super MX" },
  { src: "https://games.crazygames.com/en_US/atv-ultimate-offroad/index.html", title: "ATV Offroad" },
  { src: "https://games.crazygames.com/en_US/mr-racer---car-racing/index.html", title: "Mr. Racer" },
  { src: "https://games.crazygames.com/en_US/duck-life-space/index.html", title: "Duck Life Space" },
  { src: "https://games.crazygames.com/en_US/ludo-king/index.html", title: "Ludo King" },
];

export default function Happy({ data, backendGames = [] }) {
  // Merge backend-added games (admin panel) with local list
  const backendSrcs = new Set(backendGames.map(g => g.src));
  const localOnly = games.filter(g => !backendSrcs.has(g.src));
  const mergedGames = [
    ...backendGames.map(g => ({ src: g.src, title: g.name })),
    ...localOnly,
  ];
  return (
    <div className="happy-container">
      <div id="content">
        <div className="hero-badge">🟢 Live Detection</div>
        <h1 className="hero-title">
          You're feeling <span>Happy!</span> 😊
        </h1>
        <p className="hero-sub">Here are some games that match your vibe</p>
        <div className="emotion-pill">
          <span className="emotion-dot" />
          Detected Emotion: {data}
        </div>
      </div>

      <div className="section-divider">
        <span>🎮 Games for You</span>
      </div>

      <div className="games-grid">
        {mergedGames.map((game, i) => (
          <GameCard src={game.src} title={game.title} accent="#00d4ff" />
        ))}
      </div>
    </div>
  );
}
