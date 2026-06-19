import React,{ useEffect, useRef, useState, useMemo } from "react";
import * as faceapi from "face-api.js";
import "./CSS/MainLayout.css";
import Nav from "./Nav";
import Neutral from "./Neutral";
import Happy from "./Happy";
import Sad from "./Sad";
import Surprised from "./Surprised";
import Angry from "./Angry";
import EmotionTracker from "./EmotionTracker";
import EmotionConfidencePanel from "./EmotionConfidencePanel";
import GameFeedbackPanel from "./GameFeedbackPanel";
import ScorePanel, { recordGamePlayed } from "./ScorePanel";
import EmotionAlert from "./EmotionAlert";
import Footer from "./Footer";
import { useAdminGames, useSessionSaver, useFeedbackSaver } from "./useAdminGames";
import { GAMES as STATIC_GAMES } from "./gamesData";

const EMOTION_ORBS = [
  { key: "happy",     emoji: "😄", cls: "orb-happy",     label: "Happy",     color: "#f59e0b" },
  { key: "sad",       emoji: "😢", cls: "orb-sad",       label: "Sad",       color: "#7b9fd4" },
  { key: "angry",     emoji: "😠", cls: "orb-angry",     label: "Angry",     color: "#ef4444" },
  { key: "surprised", emoji: "😲", cls: "orb-surprised", label: "Surprised", color: "#a855f7" },
  { key: "neutral",   emoji: "😐", cls: "orb-neutral",   label: "Neutral",   color: "#a3a3a3" },
];

// Floating particle canvas
function ParticleCanvas() {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = canvas.width  = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      color: ["#00d4ff","#b44dff","#00ff9d"][Math.floor(Math.random() * 3)],
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="particle-canvas" />;
}

// Generate a stable session key per browser tab
function getSessionKey() {
  let k = sessionStorage.getItem("moodplay_session_key");
  if (!k) {
    k = "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2);
    sessionStorage.setItem("moodplay_session_key", k);
  }
  return k;
}

export default function MainLayout() {
  const videoRef = useRef();
  const sessionKey = React.useRef(getSessionKey()).current; // stable ref — runs once

  // ── Hooks (all at top — no hooks after conditions) ──
  const saveSession  = useSessionSaver();
  const saveFeedback = useFeedbackSaver();

  // Merge backend games with static fallback
  const allGames = useAdminGames(STATIC_GAMES);

  const [emotion, setEmotion]               = useState("Scanning...");
  const [videoEnded, setVideoEnded]         = useState(false);
  const [expressions, setExpressions]       = useState(null);
  const [countdown, setCountdown]           = useState(5);
  const [alertEmotion, setAlertEmotion]     = useState(null);
  const [moodIndex, setMoodIndex]           = useState(0);
  const [cursorVisible, setCursorVisible]   = useState(true);
  const [emotionHistory, setEmotionHistory] = useState(() => {
    const stored = sessionStorage.getItem("emotionHistory");
    return stored ? JSON.parse(stored) : [];
  });

  // Cycle mood label and cursor blink on landing
  useEffect(() => {
    if (videoEnded) return;
    const moodT   = setInterval(() => setMoodIndex(i => (i + 1) % EMOTION_ORBS.length), 2000);
    const cursorT = setInterval(() => setCursorVisible(v => !v), 530);
    return () => { clearInterval(moodT); clearInterval(cursorT); };
  }, [videoEnded]);

  useEffect(() => { startVideo(); loadModels(); }, []);

  const loadModels = async () => {
    const BASE_PATH = import.meta.env.PROD
  ? "/emotion-adaptive-ui/models"
  : "/models";
    await faceapi.nets.tinyFaceDetector.loadFromUri(BASE_PATH);
    await faceapi.nets.faceExpressionNet.loadFromUri(BASE_PATH);
    detectEmotion();
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => (videoRef.current.srcObject = stream));
  };

  const detectEmotion = () => {
    const startTime = Date.now();
    let finalEmotionSet = false;
    const intervalId = setInterval(async () => {
      if (!videoRef.current || finalEmotionSet) return;
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();
      const elapsed   = Date.now() - startTime;
      const remaining = Math.max(0, 5 - Math.floor(elapsed / 1000));
      setCountdown(remaining);
      if (detections?.expressions) {
        setExpressions(detections.expressions);
        if (elapsed >= 5000) {
          const exp = detections.expressions;
          const maxEmotion = Object.keys(exp).reduce((a, b) => exp[a] > exp[b] ? a : b);
          finalEmotionSet = true;
          clearInterval(intervalId);
          setEmotion(maxEmotion);
          saveToHistory(maxEmotion);
          recordGamePlayed(maxEmotion);
          window.dispatchEvent(new Event("emotionScoreUpdate"));
          setAlertEmotion(maxEmotion);
          // ── Save to backend ──
          saveSession({ emotion: maxEmotion, expressionsJson: JSON.stringify(exp), sessionKey });
          const stream = videoRef.current.srcObject;
          if (stream) stream.getTracks().forEach(t => t.stop());
          videoRef.current.srcObject = null;
          setVideoEnded(true);
        }
      }
    }, 500);
  };

  const saveToHistory = (detectedEmotion) => {
    setEmotionHistory(prev => {
      const updated = [{ emotion: detectedEmotion, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10);
      sessionStorage.setItem("emotionHistory", JSON.stringify(updated));
      return updated;
    });
  };

  // ── Save feedback to backend ──
  const handleFeedback = async (feedback) => {
    await saveFeedback({
      emotion:    feedback.emotion,
      rating:     feedback.rating,
      tags:       Array.isArray(feedback.tags) ? feedback.tags.join(",") : feedback.tags,
      note:       feedback.note,
      sessionKey,
    });
  };

  // Memoize filtered games per mood — avoids new array on every render
  const gamesByMood = useMemo(() => ({
    neutral:   allGames.filter(g => g.mood === "neutral"),
    happy:     allGames.filter(g => g.mood === "happy"),
    sad:       allGames.filter(g => g.mood === "sad"),
    angry:     allGames.filter(g => g.mood === "angry"),
    surprised: allGames.filter(g => g.mood === "surprised"),
  }), [allGames]);

  const gameDetected = ["neutral","happy","sad","angry","surprised"].includes(emotion);
  const activeMood   = EMOTION_ORBS[moodIndex];

  return (
    <div id="Apps">
      <Nav />

      {alertEmotion && (
        <EmotionAlert emotion={alertEmotion} onDismiss={() => setAlertEmotion(null)} />
      )}

      {/* ── LANDING / SCAN ── */}
      {!videoEnded && (
        <div className="scan-layout">
          <ParticleCanvas />
          <div className="aurora">
            <div className="aurora-blob aurora-b1" style={{ background: activeMood.color }} />
            <div className="aurora-blob aurora-b2" />
            <div className="aurora-blob aurora-b3" />
          </div>

          {/* LEFT */}
          <div className="scan-left">
            <div className="scan-eyebrow">
              <span className="scan-eyebrow-dot" />
              AI-Powered · Real-Time · Mood-Matched
            </div>
            <h1 className="scan-headline">
              <span className="headline-line1">Games that feel</span><br />
              <span className="scan-headline-mood" style={{ "--mood-color": activeMood.color }}>
                {activeMood.emoji}&nbsp;{activeMood.label}
                <span className={`cursor ${cursorVisible ? "cursor-on" : "cursor-off"}`}>|</span>
              </span>
            </h1>
            <p className="scan-desc">
              Look into the camera for 5 seconds.<br />
              Our AI reads your emotion and curates the perfect game for you.
            </p>
            <ul className="scan-features">
              <li style={{ "--delay": "0s" }}>
                <span className="feat-icon-wrap" style={{ background:"rgba(0,212,255,0.08)", borderColor:"rgba(0,212,255,0.2)" }}>
                  <span style={{ color:"#00d4ff" }}>◈</span>
                </span>
                AI face detection via face-api.js
              </li>
              <li style={{ "--delay": "0.08s" }}>
                <span className="feat-icon-wrap" style={{ background:"rgba(180,77,255,0.08)", borderColor:"rgba(180,77,255,0.2)" }}>
                  <span style={{ color:"#b44dff" }}>◈</span>
                </span>
                Live confidence scoring per emotion
              </li>
              <li style={{ "--delay": "0.16s" }}>
                <span className="feat-icon-wrap" style={{ background:"rgba(0,255,157,0.08)", borderColor:"rgba(0,255,157,0.2)" }}>
                  <span style={{ color:"#00ff9d" }}>◈</span>
                </span>
                50+ curated mood-matched games
              </li>
            </ul>
            <div className="emotion-orbs">
              {EMOTION_ORBS.map((o, i) => (
                <div key={o.key} className={`emotion-orb ${o.cls} ${i === moodIndex ? "orb-active" : ""}`}
                  title={o.label} style={{ "--orb-color": o.color }}>
                  <span className="orb-emoji">{o.emoji}</span>
                  <span className="orb-label">{o.label}</span>
                </div>
              ))}
            </div>
            <div className="scan-chips">
              <div className="scan-chip"><span className="scan-chip-dot" style={{ background:"#00d4ff", boxShadow:"0 0 6px #00d4ff" }} />AI Face Scan</div>
              <div className="scan-chip"><span className="scan-chip-dot" style={{ background:"#b44dff", boxShadow:"0 0 6px #b44dff" }} />Live Confidence</div>
              <div className="scan-chip"><span className="scan-chip-dot" style={{ background:"#00ff9d", boxShadow:"0 0 6px #00ff9d" }} />Mood-Matched Games</div>
            </div>
            <EmotionTracker emotionHistory={emotionHistory} />
          </div>

          {/* RIGHT */}
          <div className="scan-right">
            <div className="scan-ring-wrap">
              <div className="scan-ring scan-ring-1" style={{ borderTopColor: activeMood.color+"66", borderRightColor: activeMood.color+"22" }} />
              <div className="scan-ring scan-ring-2" />
              <div className="scan-ring scan-ring-3" />
              <div className="hud-corner hud-tl" /><div className="hud-corner hud-tr" />
              <div className="hud-corner hud-bl" /><div className="hud-corner hud-br" />
              <div className="video-frame">
                <video ref={videoRef} autoPlay muted />
                <div className="scan-sweep" />
                <div className="crosshair crosshair-h" />
                <div className="crosshair crosshair-v" />
              </div>
            </div>
            <div className="scan-readout">
              <span className="scan-readout-ping" />
              <span className="scan-readout-label">DETECTING</span>
              <span className="scan-readout-divider">|</span>
              <span className="scan-readout-value">◈ {emotion}</span>
              <span className="scan-readout-timer">{countdown}s</span>
            </div>
            <EmotionConfidencePanel expressions={expressions} countdown={countdown} />
          </div>
        </div>
      )}

      {/* ── GAME SCREEN ── */}
      {videoEnded && gameDetected && (
        <>
          <div className="history-bar">
            <EmotionTracker emotionHistory={emotionHistory} />
          </div>
          <div className="game-content">
            {emotion === "neutral"   && <Neutral   data={emotion} backendGames={gamesByMood.neutral} />}
            {emotion === "happy"     && <Happy     data={emotion} backendGames={gamesByMood.happy} />}
            {emotion === "sad"       && <Sad       data={emotion} backendGames={gamesByMood.sad} />}
            {emotion === "angry"     && <Angry     data={emotion} backendGames={gamesByMood.angry} />}
            {emotion === "surprised" && <Surprised data={emotion} backendGames={gamesByMood.surprised} />}
          </div>
          <div className="bottom-panels">
            <ScorePanel />
            <GameFeedbackPanel emotion={emotion} onFeedbackSubmit={handleFeedback} />
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
