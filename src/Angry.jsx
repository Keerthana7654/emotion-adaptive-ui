import React from 'react';
import GameCard from "./GameCard";
import "./CSS/Angry.css";

const games = [
  { src: "https://games.crazygames.com/en_US/iron-legion/index.html",                    title: "Iron Legion" },
  { src: "https://games.crazygames.com/en_US/fragen/index.html",                         title: "Fragen" },
  { src: "https://games.crazygames.com/en_US/zombiecraftio/index.html",                  title: "ZombieCraft.io" },
  { src: "https://games.crazygames.com/en_US/gun-master-3d---fps-shooting-game/index.html", title: "Gun Master 3D" },
  { src: "https://games.crazygames.com/en_US/unmatched-basketball/index.html",           title: "Unmatched Basketball" },
  { src: "https://games.crazygames.com/en_US/8-ball-pool-wyr/index.html",                title: "8-Ball Pool" },
  { src: "https://games.crazygames.com/en_US/doomsday-shooter/index.html",               title: "Doomsday Shooter" },
  { src: "https://games.crazygames.com/en_US/path-of-survivor/index.html",               title: "Path of Survivor" },
  { src: "https://games.crazygames.com/en_US/traffic-rider-vvq/index.html",              title: "Traffic Rider" },
  { src: "https://games.crazygames.com/en_US/mx-offroad-master/index.html",              title: "MX Offroad Master" },
];

export default function Angry({ data, backendGames = [] }) {
  // Merge backend-added games (admin panel) with local list
  const backendSrcs = new Set(backendGames.map(g => g.src));
  const localOnly = games.filter(g => !backendSrcs.has(g.src));
  const mergedGames = [
    ...backendGames.map(g => ({ src: g.src, title: g.name })),
    ...localOnly,
  ];
  return (
    <div id="angry">
      <div id="cont">
        <div className="warning-strip">RAGE MODE ACTIVATED</div>

        <h1 className="anger-title">
          Turn Your
          <span className="highlight">Rage</span>
          Into Victory
        </h1>

        <div className="emotion-bar">
          <div className="anger-pulse" />
          <span>DETECTED EMOTION —&nbsp;</span>
          <strong>{data}</strong>
        </div>
      </div>

      <div className="battle-header">
        <h2>⚔ BATTLE ARENA</h2>
        <div className="battle-line" />
      </div>

      <div className="games-grid">
        {mergedGames.map((game, i) => (
          <GameCard src={game.src} title={game.title} accent="#ef4444" />
        ))}
      </div>
    </div>
  );
}
