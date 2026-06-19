import React from 'react';
import GameCard from "./GameCard";
import "./CSS/Sad.css";

const games = [
  { src: "https://games.crazygames.com/en_US/tile-farm-story-matching-game/index.html",       title: "Tile Farm Story" },
  { src: "https://games.crazygames.com/en_US/neko-sliding-cat-puzzle/index.html",             title: "Neko Cat Puzzle" },
  { src: "https://games.crazygames.com/en_US/wood-block-journey/index.html",                  title: "Wood Block Journey" },
  { src: "https://games.crazygames.com/en_US/merge-academy/index.html",                       title: "Merge Academy" },
  { src: "https://games.crazygames.com/en_US/magic-sorting-mna/index.html",                   title: "Magic Sorting" },
  { src: "https://games.crazygames.com/en_US/connect-the-dots---relaxing-puzzle/index.html",  title: "Connect the Dots" },
  { src: "https://games.crazygames.com/en_US/sprout-valley/index.html",                       title: "Sprout Valley" },
  { src: "https://games.crazygames.com/en_US/idle-cannon/index.html",                         title: "Idle Cannon" },
  { src: "https://games.crazygames.com/en_US/pot-pelting/index.html",                         title: "Pot Pelting" },
  { src: "https://games.crazygames.com/en_US/solitaire-home-story/index.html",                title: "Solitaire Home Story" },
  { src: "https://games.crazygames.com/en_US/syntaxia/index.html",                            title: "Syntaxia" },
  { src: "https://games.crazygames.com/en_US/age-of-thrones/index.html",                      title: "Age of Thrones" },
];

// 20 raindrops rendered as divs for CSS animation
const raindrops = Array.from({ length: 20 });

export default function Sad({ data, backendGames = [] }) {
  // Merge backend-added games (admin panel) with local list
  const backendSrcs = new Set(backendGames.map(g => g.src));
  const localOnly = games.filter(g => !backendSrcs.has(g.src));
  const mergedGames = [
    ...backendGames.map(g => ({ src: g.src, title: g.name })),
    ...localOnly,
  ];
  return (
    <div id="sad">
      {/* Rain layer */}
      <div className="rain">
        {raindrops.map((_, i) => (
          <div className="raindrop" key={i} />
        ))}
      </div>

      <div id="content">
        <div className="moon" />
        <div className="sad-eyebrow">Emotion Detected</div>

        <h1 className="sad-title">
          It's okay to feel<br /><em>what you feel.</em>
        </h1>

        <p className="sad-comfort">
          Take a breath. These gentle games are here to keep you company.
        </p>

        <div className="emotion-tag">
          <div className="sad-dot" />
          <span>Mood —&nbsp;</span>
          <strong>{data}</strong>
        </div>
      </div>

      <div className="section-label">
        <span>Relaxing Games for You</span>
      </div>

      <div className="games-grid">
        {mergedGames.map((game, i) => (
          <GameCard src={game.src} title={game.title} accent="#7b9fd4" />
        ))}
      </div>
    </div>
  );
}
