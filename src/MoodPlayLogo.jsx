import React from "react";

export default function MoodPlayLogo({ size = 40, variant = "full" }) {
  // useId gives unique IDs so multiple logos on the same page don't clash
  const uid = React.useId().replace(/:/g, "");

  const irisId = `mpl-iris-${uid}`;
  const glowId = `mpl-glow-${uid}`;
  const clipId = `mpl-clip-${uid}`;

  return (
    <span className="mpl-root">

      {/* ── SVG ICON ── */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="mpl-svg"
      >
        <defs>
          {/* Cyan → Purple iris gradient — matches app glow palette */}
          <radialGradient id={irisId} cx="40%" cy="38%" r="60%">
            <stop offset="0%"   stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#b44dff" />
          </radialGradient>

          {/* Soft glow filter applied to the iris */}
          <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip path — keeps sweep line inside the orbit ring */}
          <clipPath id={clipId}>
            <circle cx="20" cy="20" r="16" />
          </clipPath>
        </defs>

        {/* ORBIT RING — dashed, slowly rotating via CSS animation */}
        <circle
          cx="20" cy="20" r="18.5"
          stroke="#00d4ff"
          strokeOpacity="0.3"
          strokeWidth="0.9"
          strokeDasharray="11 3.5 2.5 3.5"
          fill="none"
          style={{
            transformOrigin: "20px 20px",
            animation: "mplOrbit 8s linear infinite",
          }}
        />

        {/* INNER HALO RING */}
        <circle
          cx="20" cy="20" r="15.5"
          stroke="#b44dff"
          strokeOpacity="0.12"
          strokeWidth="0.5"
          fill="none"
        />

        {/* EYE WHITES (sclera) — lens-shaped path */}
        <path
          d="M 6 20 Q 20 9 34 20 Q 20 31 6 20 Z"
          fill="#060b14"
          stroke="#00d4ff"
          strokeOpacity="0.35"
          strokeWidth="0.7"
        />

        {/* IRIS — gradient filled, glowing */}
        <circle
          cx="20" cy="20" r="7"
          fill={`url(#${irisId})`}
          filter={`url(#${glowId})`}
          className="mpl-iris"
        />

        {/* PUPIL */}
        <circle cx="20" cy="20" r="3.2" fill="#03040a" />

        {/* HIGHLIGHT DOT */}
        <circle cx="21.6" cy="18.4" r="1.1" fill="white" fillOpacity="0.75" />

        {/* SCAN SWEEP — horizontal line that travels across the eye.
            Mirrors the sweep animation on the landing page camera frame. */}
        <g clipPath={`url(#${clipId})`}>
          <rect
            x="4" y="0" width="32" height="1.6"
            fill="#00d4ff"
            fillOpacity="0.5"
            style={{ animation: "mplSweep 3.2s ease-in-out infinite" }}
          />
        </g>

        {/* SMILE ARC — green, represents the emotion output */}
        <path
          d="M 13.5 27 Q 20 31.8 26.5 27"
          stroke="#00ff9d"
          strokeOpacity="0.75"
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
        />

        {/* SMILE END DOTS */}
        <circle cx="13.5" cy="27"  r="1"   fill="#00ff9d" fillOpacity="0.65" />
        <circle cx="26.5" cy="27"  r="1"   fill="#00ff9d" fillOpacity="0.65" />
        <circle cx="20"   cy="31.5" r="0.8" fill="#00ff9d" fillOpacity="0.4" />
      </svg>

      {/* WORDMARK — only in "full" variant */}
      {variant === "full" && (
        <span className="mpl-wordmark" aria-label="MoodPlay">
          <span className="mpl-word-mood">Mood</span>
          <span className="mpl-word-play">Play</span>
        </span>
      )}

      {/* Scoped keyframes — injected once, isolated to this component */}
      <style>{`
        @keyframes mplOrbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes mplSweep {
          0%   { transform: translateY(6px);  opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { transform: translateY(32px); opacity: 0; }
        }

        .mpl-root {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .mpl-svg {
          overflow: visible;
          display: block;
          transition: filter 0.25s ease;
          flex-shrink: 0;
        }
        .mpl-root:hover .mpl-svg {
          filter: drop-shadow(0 0 10px rgba(0,212,255,0.5));
        }
        .mpl-root:hover .mpl-iris {
          filter: brightness(1.2);
        }

        .mpl-wordmark {
          font-family: 'Orbitron', monospace;
          font-size: 1.05rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          line-height: 1;
          white-space: nowrap;
          user-select: none;
        }
        .mpl-word-mood {
          background: linear-gradient(135deg, #00d4ff 0%, #b44dff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .mpl-word-play {
          color: rgba(232,237,245,0.88);
        }
        .mpl-root:hover .mpl-wordmark {
          filter: drop-shadow(0 0 8px rgba(0,212,255,0.25));
        }
      `}</style>
    </span>
  );
}
