import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>CySecPrep</h2>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/quiz" style={styles.link}>Quizzes</Link>
        <Link to="/flashcards" style={styles.link}>Flashcards</Link>
        <Link to="/matching" style={styles.link}>Matching</Link>
        <Link to="/about" style={styles.link}>About</Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#020617",
    borderBottom: "1px solid #1e293b",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },

  logo: {
    color: "#38bdf8",
    margin: 0
  },

  links: {
    display: "flex",
    gap: "1.5rem"
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500"
  }
};