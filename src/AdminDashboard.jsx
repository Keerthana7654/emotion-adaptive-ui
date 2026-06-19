import React, { useState, useEffect, useCallback } from "react";
import "./CSS/AdminDashboard.css";
import { BASE_URL, authHeaders } from "./api";

const API = `${BASE_URL}/api/admin`;

const MOODS = [ "neutral", "happy", "angry", "sad", "surprised"];
const MOOD_COLORS = { happy:"#f59e0b", angry:"#ef4444", sad:"#7b9fd4", neutral:"#a3a3a3", surprised:"#a855f7" };
const MOOD_EMOJI  = { happy:"😄",     angry:"😠",     sad:"😢",       neutral:"😐",       surprised:"😲" };
const RATING_EMOJI = { love:"❤️", good:"👍", meh:"😐", bad:"👎", hate:"💔" };

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────
function StatCard({ label, value, color = "#00d4ff" }) {
  return (
    <div className="ad-stat">
      <div className="ad-stat-value" style={{ color }}>{value ?? "—"}</div>
      <div className="ad-stat-label">{label}</div>
    </div>
  );
}

function MoodBadge({ emotion }) {
  const color = MOOD_COLORS[emotion] || "#aaa";
  return (
    <span className="ad-mood-badge"
      style={{ background: color + "22", color, border: `1px solid ${color}44` }}>
      {MOOD_EMOJI[emotion] || "🎭"} {emotion}
    </span>
  );
}

function fmt(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString();
}

// ─────────────────────────────────────────
// Add Game Form
// ─────────────────────────────────────────
function AddGameForm({ token, onAdded }) {
  const [url,  setUrl]  = useState("https://games.crazygames.com/en_US/game-name/index.html");
  const [name, setName] = useState("");
  const [mood, setMood] = useState("neutral");
  const [tags, setTags] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg,  setMsg]  = useState(null);

  // Auto-fill game name from URL slug
  const handleUrlBlur = () => {
    if (url && !name) {
      const parts = url.replace(/\/index\.html$/, "").split("/").filter(Boolean);
      const slug  = parts[parts.length - 1] || "";
      setName(slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      const res = await fetch(`${API}/games`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({ name, src: url, mood, tags }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMsg({ ok: true, text: `✓ "${data.name}" added to ${mood} games — live in UI now!` });
      setUrl(""); setName(""); setTags(""); setMood("happy");
      onAdded(data);
      // Auto-clear success message after 10 seconds
      setTimeout(() => setMsg(null), 10000);
    } catch (err) {
      setMsg({ ok: false, text: err.message || "Failed to add game." });
      // Auto-clear error message after 10 seconds too
      setTimeout(() => setMsg(null), 10000);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="ad-add-form" onSubmit={handleSubmit}>
      <div className="ad-field">
        <label>CrazyGames URL</label>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          onBlur={handleUrlBlur}
          // placeholder="https://games.crazygames.com/en_US/game-name/index.html"
          required
        />
      </div>

      <div className="ad-field-row-3">
        <div className="ad-field">
          <label>Game Name</label>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Auto-filled from URL" required />
        </div>
        <div className="ad-field">
          <label>Mood</label>
          <select value={mood} onChange={e => setMood(e.target.value)}>
            {MOODS.map(m => <option key={m} value={m}>{MOOD_EMOJI[m]} {m}</option>)}
          </select>
        </div>
        <div className="ad-field">
          <label>Tags (comma-separated)</label>
          <input value={tags} onChange={e => setTags(e.target.value)} placeholder="puzzle, casual" />
        </div>
      </div>

      {msg && (
        <div className={`ad-msg ${msg.ok ? "ad-msg-ok" : "ad-msg-err"}`}>
          <span>{msg.text}</span>
          <div className="ad-msg-bar" />
        </div>
      )}

      <button className="ad-submit-btn" disabled={busy}>
        {busy ? "Adding…" : "+ Add Game to UI"}
      </button>
    </form>
  );
}

// ─────────────────────────────────────────
// Games Table
// ─────────────────────────────────────────
function GamesTable({ token, games, onToggle, onDelete }) {
  const toggle = async (id) => {
    const res = await fetch(`${API}/games/${id}/toggle`, {
      method: "PUT", headers: authHeaders(token),
    });
    if (res.ok) { const g = await res.json(); onToggle(g); }
  };

  const del = async (id) => {
    if (!window.confirm("Permanently delete this game?")) return;
    await fetch(`${API}/games/${id}`, { method: "DELETE", headers: authHeaders(token) });
    onDelete(id);
  };

  return (
    <div className="ad-table-wrap">
      <table className="ad-table">
        <thead>
          <tr><th>Name</th><th>Mood</th><th>Tags</th><th>Added by</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {games.map(g => (
            <tr key={g.id} className={g.active ? "" : "ad-row-inactive"}>
              <td>
                <a href={g.src} target="_blank" rel="noreferrer" className="ad-game-link">{g.name}</a>
              </td>
              <td><MoodBadge emotion={g.mood} /></td>
              <td className="ad-muted">{g.tags || "—"}</td>
              <td className="ad-muted">{g.addedBy || "—"}</td>
              <td>
                <span className={`ad-status ${g.active ? "ad-status-on" : "ad-status-off"}`}>
                  {g.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="ad-actions">
                <button className="ad-toggle-btn" onClick={() => toggle(g.id)}>
                  {g.active ? "Disable" : "Enable"}
                </button>
                <button className="ad-del-btn" onClick={() => del(g.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {games.length === 0 && (
            <tr><td colSpan={6} className="ad-empty">No games yet — add one above!</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────
// Sessions Table
// backend returns: { id, sessionKey, emotion, expressionsJson, createdAt }
// ─────────────────────────────────────────
function SessionsList({ sessions }) {
  return (
    <div className="ad-table-wrap">
      <table className="ad-table">
        <thead>
          <tr><th>#</th><th>Time</th><th>Emotion</th><th>Session Key</th></tr>
        </thead>
        <tbody>
          {sessions.map((s, i) => (
            <tr key={s.id}>
              <td className="ad-muted">{i + 1}</td>
              <td className="ad-ts">{fmt(s.createdAt)}</td>
              <td><MoodBadge emotion={s.emotion} /></td>
              <td className="ad-muted ad-mono">{s.sessionKey || "—"}</td>
            </tr>
          ))}
          {sessions.length === 0 && <tr><td colSpan={4} className="ad-empty">No sessions yet</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────
// Feedback Table
// backend returns: { id, sessionKey, emotion, rating, tags, note, createdAt }
// ─────────────────────────────────────────
function FeedbackList({ feedback }) {
  return (
    <div className="ad-table-wrap">
      <table className="ad-table">
        <thead>
          <tr><th>#</th><th>Time</th><th>Emotion</th><th>Rating</th><th>Tags</th><th>Note</th></tr>
        </thead>
        <tbody>
          {feedback.map((f, i) => (
            <tr key={f.id}>
              <td className="ad-muted">{i + 1}</td>
              <td className="ad-ts">{fmt(f.createdAt)}</td>
              <td><MoodBadge emotion={f.emotion} /></td>
              <td>{RATING_EMOJI[f.rating] || f.rating || "—"}</td>
              <td className="ad-muted">{f.tags || "—"}</td>
              <td className="ad-note">{f.note || "—"}</td>
            </tr>
          ))}
          {feedback.length === 0 && <tr><td colSpan={6} className="ad-empty">No feedback yet</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────
// Overview — Emotion breakdown bars
// backend returns: { totalSessions, totalFeedback, totalGames,
//                   topEmotion, emotionBreakdown, ratingBreakdown }
// ─────────────────────────────────────────
function Overview({ stats, games }) {
  const activeCount = games.filter(g => g.active).length;

  const emotionBreakdown = stats?.emotionBreakdown || {};
  const ratingBreakdown  = stats?.ratingBreakdown  || {};
  const totalEmotions    = Object.values(emotionBreakdown).reduce((a, b) => a + b, 0);
  const totalRatings     = Object.values(ratingBreakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="ad-content">
      {/* Stat cards */}
      <div className="ad-stats-grid">
        <StatCard label="Total Scans"    value={stats?.totalSessions} color="#00d4ff" />
        <StatCard label="Total Feedback" value={stats?.totalFeedback}  color="#b44dff" />
        <StatCard label="Active Games"   value={activeCount}           color="#00ff9d" />
        <StatCard label="Top Emotion"    value={stats?.topEmotion ? `${MOOD_EMOJI[stats.topEmotion]} ${stats.topEmotion}` : "—"} color="#f59e0b" />
      </div>

      {/* Emotion breakdown */}
      <div className="ad-section-title">Emotion Breakdown</div>
      {totalEmotions === 0
        ? <p className="ad-empty">No scan data yet</p>
        : <div className="ad-emotion-bars">
            {Object.entries(emotionBreakdown).map(([emotion, count]) => {
              const pct = Math.round((count / totalEmotions) * 100);
              return (
                <div key={emotion} className="ad-ebar">
                  <div className="ad-ebar-label">
                    <span>{MOOD_EMOJI[emotion]} {emotion}</span>
                    <span>{count} scans</span>
                  </div>
                  <div className="ad-ebar-track">
                    <div className="ad-ebar-fill" style={{ width: `${pct}%`, background: MOOD_COLORS[emotion] }} />
                  </div>
                  <div className="ad-ebar-pct">{pct}%</div>
                </div>
              );
            })}
          </div>
      }

      {/* Rating breakdown */}
      <div className="ad-section-title" style={{ marginTop: 32 }}>Feedback Rating Breakdown</div>
      {totalRatings === 0
        ? <p className="ad-empty">No feedback data yet</p>
        : <div className="ad-emotion-bars">
            {Object.entries(ratingBreakdown).map(([rating, count]) => {
              const pct = Math.round((count / totalRatings) * 100);
              return (
                <div key={rating} className="ad-ebar">
                  <div className="ad-ebar-label">
                    <span>{RATING_EMOJI[rating] || rating}</span>
                    <span>{count}</span>
                  </div>
                  <div className="ad-ebar-track">
                    <div className="ad-ebar-fill" style={{ width: `${pct}%`, background: "#b44dff" }} />
                  </div>
                  <div className="ad-ebar-pct">{pct}%</div>
                </div>
              );
            })}
          </div>
      }
    </div>
  );
}

// ─────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────
const TABS = [
  { id: "overview", label: "📊 Overview"  },
  { id: "games",    label: "🎮 Games"     },
  { id: "sessions", label: "🎭 Sessions"  },
  { id: "feedback", label: "💬 Feedback"  },
];

export default function AdminDashboard({ token, username, onLogout }) {
  const [tab,      setTab]      = useState("overview");
  const [stats,    setStats]    = useState(null);
  const [sessions, setSessions] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [games,    setGames]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const h = authHeaders(token);
      const [s, se, fe, gm] = await Promise.all([
        fetch(`${API}/stats`,    { headers: h }).then(r => r.json()),
        fetch(`${API}/sessions`, { headers: h }).then(r => r.json()),
        fetch(`${API}/feedback`, { headers: h }).then(r => r.json()),
        fetch(`${API}/games`,    { headers: h }).then(r => r.json()),
      ]);
      setStats(s); setSessions(Array.isArray(se) ? se : []);
      setFeedback(Array.isArray(fe) ? fe : []);
      setGames(Array.isArray(gm) ? gm : []);
    } catch {
      setError("Failed to load data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleGameAdded  = g => setGames(prev => [g, ...prev]);
  const handleGameToggle = g => setGames(prev => prev.map(x => x.id === g.id ? g : x));
  const handleGameDelete = id => setGames(prev => prev.filter(g => g.id !== id));

  return (
    <div className="ad-root">
      {/* Sidebar */}
      <aside className="ad-sidebar">
        <div className="ad-brand">
          <span className="ad-brand-icon">◈</span>
          <span className="ad-brand-text">MoodPlay</span>
        </div>
        <div className="ad-admin-tag">ADMIN</div>
        <div className="ad-admin-name">{username}</div>

        <nav className="ad-nav">
          {TABS.map(t => (
            <button key={t.id}
              className={`ad-nav-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>

        <button className="ad-logout" onClick={onLogout}>Sign out</button>
      </aside>

      {/* Main content */}
      <main className="ad-main">
        <div className="ad-topbar">
          <h2 className="ad-page-title">{TABS.find(t => t.id === tab)?.label}</h2>
          <button className="ad-refresh" onClick={load} disabled={loading}>
            {loading ? "Loading…" : "↻ Refresh"}
          </button>
        </div>

        {error && <div className="ad-error-banner">{error}</div>}

        {tab === "overview" && <Overview stats={stats} games={games} />}

        {tab === "games" && (
          <div className="ad-content">
            <div className="ad-section-title">Add a New Game</div>
            <AddGameForm token={token} onAdded={handleGameAdded} />
            <div className="ad-section-title" style={{ marginTop: 32 }}>
              All Games ({games.length})
            </div>
            <GamesTable
              token={token}
              games={games}
              onToggle={handleGameToggle}
              onDelete={handleGameDelete}
            />
          </div>
        )}

        {tab === "sessions" && (
          <div className="ad-content">
            <div className="ad-section-title">Recent Sessions ({sessions.length})</div>
            <SessionsList sessions={sessions} />
          </div>
        )}

        {tab === "feedback" && (
          <div className="ad-content">
            <div className="ad-section-title">Recent Feedback ({feedback.length})</div>
            <FeedbackList feedback={feedback} />
          </div>
        )}
      </main>
    </div>
  );
}