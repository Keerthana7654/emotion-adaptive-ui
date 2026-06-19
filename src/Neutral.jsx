import React from "react";
import GameCard from "./GameCard";
import "./CSS/Neutral.css";

const games = [
  { src: "https://games.crazygames.com/en_US/slingshot-fortress/index.html",          title: "Slingshot Fortress" },
  { src: "https://games.crazygames.com/en_US/lazergrrl/index.html",                   title: "Lazergrrl" },
  { src: "https://games.crazygames.com/en_US/idle-medieval-tower-defense/index.html", title: "Idle Medieval Tower Defense" },
  { src: "https://games.crazygames.com/en_US/chess-free/index.html",                  title: "Chess" },
  { src: "https://games.crazygames.com/en_US/skillwarz/index.html",                   title: "Skillwarz" },
  { src: "https://games.crazygames.com/en_US/tankcraft/index.html",                   title: "Tankcraft" },
  { src: "https://games.crazygames.com/en_US/link/index.html",                        title: "Link" },
  { src: "https://games.crazygames.com/en_US/merge-to-battle/index.html",             title: "Merge to Battle" },
  { src: "https://games.crazygames.com/en_US/cubic-frontier-zombie-robby/index.html", title: "Cubic Frontier" },
  { src: "https://games.crazygames.com/en_US/hedgies/index.html",                     title: "Hedgies" },
  { src: "https://games.crazygames.com/en_US/beach-club/index.html",                  title: "Beach Club" },
  { src: "https://games.crazygames.com/en_US/scavenger-hunt---multiplayer/index.html",title: "Scavenger Hunt" },
  { src: "https://games.crazygames.com/en_US/screw-out-bolts-and-nuts/index.html",    title: "Screw Out" },
];

export default function Neutral({ data, backendGames = [] }) {
  // Merge backend-added games (admin panel) with local list
  const backendSrcs = new Set(backendGames.map(g => g.src));
  const localOnly = games.filter(g => !backendSrcs.has(g.src));
  const mergedGames = [
    ...backendGames.map(g => ({ src: g.src, title: g.name })),
    ...localOnly,
  ];
  return (
    <div id="neutral">
      <div id="content">
        <div className="neutral-eyebrow">Emotion Detected</div>

        <h1 className="neutral-title">
          Feeling <em>Balanced?</em><br />Let's Play
        </h1>

        <p className="neutral-sub">A calm mind picks the best games</p>

        <div className="emotion-tag">
          <div className="neutral-dot" />
          <span>Mood —&nbsp;</span>
          <strong>{data}</strong>
        </div>
      </div>

      <div className="section-label">
        <span>Games for You</span>
      </div>

      <div className="games-grid">
        {mergedGames.map((game, i) => (
          <GameCard src={game.src} title={game.title} accent="#a3a3a3" />
        ))}
      </div>
    </div>
  );
}
