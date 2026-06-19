import React, { useState } from "react";
import "./CSS/AdminLogin.css";
import { BASE_URL } from "./api";
import Nav from "./Nav";

export default function AdminLogin({ onLogin }) {
  const [username,     setUsername]     = useState("");
  const [password,     setPassword]     = useState("");
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("bad credentials");
      const data = await res.json();
      // Token passed to parent via callback only — NOT stored in localStorage
      onLogin(data.token, data.username);
    } catch {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-root">
      <Nav />

      <div className="al-card">
        <div className="al-logo">
          <span className="al-logo-icon">◈</span>
          <span className="al-logo-text">MoodPlay</span>
        </div>

        <div className="al-eyebrow">ADMIN PORTAL</div>
        <h1 className="al-title">Sign in</h1>
        <p className="al-sub">Manage games and view analytics.</p>

        <form className="al-form" onSubmit={handleSubmit}>

          {/* Username */}
          <div className="al-field">
            <label className="al-label">Username</label>
            <input
              className="al-input"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              required
            />
          </div>

          {/* Password — eye toggle positioned entirely by CSS (.al-eye-btn) */}
          <div className="al-field al-field-password">
            <label className="al-label">Password</label>
            <input
              className="al-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="al-eye-btn"
              onClick={() => setShowPassword(prev => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                /* Eye-OFF — click to hide password */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.73-1.74 2.03-3.98 4.06-5.94" />
                  <path d="M9.9 4.24A10.9 10.9 0 0 1 12 4c5 0 9.27 3.89 11 8-.57 1.36-1.44 2.86-2.6 4.28" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                /* Eye-ON — click to show password */
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {error && <div className="al-error">⚠ {error}</div>}

          <button className="al-btn" type="submit" disabled={loading}>
            {loading ? <span className="al-spinner" /> : "Sign in →"}
          </button>
        </form>

        <div className="al-hint">
          Default credentials are in <code>application.properties</code>
        </div>
      </div>
    </div>
  );
}