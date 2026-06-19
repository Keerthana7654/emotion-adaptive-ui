import React, { useEffect, useRef, useState } from "react";
import "./CSS/EmotionAlert.css";

const EMOTION_META = {
  happy:     { emoji: "😄", color: "#f59e0b", label: "Happy!",     message: "You're glowing! Here are games to match your energy ✨" },
  sad:       { emoji: "😢", color: "#7b9fd4", label: "Sad",        message: "It's okay — we've got calming games just for you 💙" },
  angry:     { emoji: "😠", color: "#ef4444", label: "Angry!",     message: "Channel that rage into victory! ⚔️" },
  surprised: { emoji: "😲", color: "#a855f7", label: "Surprised!", message: "Whoa! Something unexpected awaits you 🌟" },
  neutral:   { emoji: "😐", color: "#a3a3a3", label: "Neutral",    message: "Calm and ready — pick anything and dive in 🎮" },
};

// Confetti particle config
const CONFETTI_COUNT = 60;
const CONFETTI_COLORS = ["#f59e0b","#ef4444","#a855f7","#00d4ff","#00ff9d","#e879f9","#fde047"];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function EmotionAlert({ emotion, onDismiss }) {
  const canvasRef   = useRef(null);
  const rafRef      = useRef(null);
  const particles   = useRef([]);
  const [visible, setVisible] = useState(false);

  const meta = EMOTION_META[emotion] || EMOTION_META.neutral;

  // Animate in
  useEffect(() => {
    if (!emotion || !EMOTION_META[emotion]) return;
    setTimeout(() => setVisible(true), 30);

    // Auto dismiss after 4s
    const t = setTimeout(() => handleDismiss(), 4000);
    return () => clearTimeout(t);
  }, [emotion]);

  // Confetti canvas
  useEffect(() => {
    if (!visible || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    // Spawn particles
    particles.current = Array.from({ length: CONFETTI_COUNT }, () => ({
      x:    randomBetween(0, canvas.width),
      y:    randomBetween(-80, -10),
      r:    randomBetween(5, 12),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      vx:   randomBetween(-2.5, 2.5),
      vy:   randomBetween(2, 6),
      rot:  randomBetween(0, 360),
      rotV: randomBetween(-4, 4),
      shape: Math.random() > 0.5 ? "rect" : "circle",
      alpha: 1,
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.5);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        p.x   += p.vx;
        p.y   += p.vy;
        p.rot += p.rotV;
        p.vy  += 0.1; // gravity
        if (p.y > canvas.height) p.alpha -= 0.05;
      });

      particles.current = particles.current.filter(p => p.alpha > 0);
      if (particles.current.length > 0) {
        rafRef.current = requestAnimationFrame(draw);
      }
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  const handleDismiss = () => {
    setVisible(false);
    cancelAnimationFrame(rafRef.current);
    setTimeout(() => onDismiss?.(), 400);
  };

  if (!emotion || !EMOTION_META[emotion]) return null;

  return (
    <div className={`ea-overlay ${visible ? "ea-visible" : ""}`}>
      {/* Screen flash */}
      <div className="ea-flash" style={{ background: meta.color }} />

      {/* Confetti canvas */}
      <canvas ref={canvasRef} className="ea-canvas" />

      {/* Alert card */}
      <div
        className={`ea-card ${visible ? "ea-card-in" : ""}`}
        style={{ "--accent": meta.color }}
        onClick={handleDismiss}
      >
        <div className="ea-glow" style={{ background: meta.color }} />

        <div className="ea-emoji-ring" style={{ borderColor: meta.color + "55", boxShadow: `0 0 30px ${meta.color}44` }}>
          <span className="ea-emoji">{meta.emoji}</span>
        </div>

        <div className="ea-detected-label">Emotion Detected</div>

        <div className="ea-emotion-name" style={{ color: meta.color, textShadow: `0 0 20px ${meta.color}88` }}>
          {meta.label}
        </div>

        <p className="ea-message">{meta.message}</p>

        <div className="ea-progress-bar">
          <div className="ea-progress-fill" style={{ background: meta.color }} />
        </div>

        <span className="ea-hint">tap to continue</span>
      </div>
    </div>
  );
}
