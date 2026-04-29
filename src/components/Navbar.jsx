import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="app-navbar">
      <div className="navbar-brand-group">
        <h1 className="navbar-logo">CySecPrep</h1>
        <button
          type="button"
          className="navbar-toggle"
          aria-controls="navbar-menu"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div id="navbar-menu" className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className="navbar-link" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link to="/quiz" className="navbar-link" onClick={() => setMenuOpen(false)}>
          Quizzes
        </Link>
        <Link to="/flashcards" className="navbar-link" onClick={() => setMenuOpen(false)}>
          Flashcards
        </Link>
        <Link to="/matching" className="navbar-link" onClick={() => setMenuOpen(false)}>
          Matching
        </Link>
        <Link to="/about" className="navbar-link" onClick={() => setMenuOpen(false)}>
          About
        </Link>
      </div>
    </nav>
  );
}
