import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Search from './Search';
import MoodPlayLogo from './MoodPlayLogo';
import "./CSS/Nav.css";

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef  = useRef();

  // Close drawer whenever the route changes (link was clicked)
  useEffect(() => { setMenuOpen(false); }, [location]);

  // Close drawer on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div id="navDiv" ref={menuRef}>
      <nav id="nav">
        <Link to="/" className="nav-logo-link" aria-label="MoodPlay home">
          {/* Full lockup — desktop */}
          <span className="nav-logo-full">
            <MoodPlayLogo size={40} variant="full" />
          </span>
          {/* Icon only — mobile (CSS hides the one above, shows this) */}
          <span className="nav-logo-icon">
            <MoodPlayLogo size={34} variant="icon" />
          </span>
        </Link>

        {/* Desktop nav links — hidden on ≤768px */}
        <div className="nav-links-desktop">
          <Link to="/"        className="nav-link">Home</Link>
          <Search />
          <Link to="/explore" className="nav-link">Explore</Link>
          <Link to="/admin"   className="nav-link nav-admin">⚙ Admin</Link>
        </div>

        {/*
          Hamburger — visible only on ≤768px.
          Three <span> bars animate to an × when menuOpen=true.
        */}
        <button
          className={`nav-hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div
        className={`nav-drawer ${menuOpen ? "drawer-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <Link to="/"        className="nav-link drawer-link">Home</Link>
        <Link to="/explore" className="nav-link drawer-link">Explore</Link>
        <Link to="/admin"   className="nav-link nav-admin drawer-link">⚙ Admin</Link>
        <div className="drawer-search"><Search /></div>
      </div>
    </div>
  );
};

export default Nav;
