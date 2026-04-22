import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { studySets } from "../data/studySets";
import "./HomePage.css";
import CardGrid from "../components/CardGrid";

export default function HomePage() {
  const navigate = useNavigate();

  const featuredSets = studySets.slice(0, 6);

  return (
    <div className="homepage">
      <Container className="py-5">
        <section className="hero-section text-center">
          <div className="hero-badge">Security+ Exam Prep</div>
          <h1 className="homepage-title">Welcome to CySecPrep</h1>
          <p className="homepage-subtitle">
            Study flashcards, take quizzes, and practice matching games to get
            ready for the CompTIA Security+ exam.
          </p>

          <div className="hero-actions">
            <Button
              className="hero-btn hero-btn-green"
              onClick={() => navigate("/quiz")}
            >
              Start Quiz
            </Button>

            <Button
              className="hero-btn hero-btn-blue"
              onClick={() => navigate("/flashcards")}
            >
              Study Flashcards
            </Button>

            <Button
              className="hero-btn hero-btn-orange"
              onClick={() => navigate("/matching")}
            >
              Practice Matching
            </Button>
          </div>
        </section>

        <section className="categories-section">
          <div className="section-header text-center">
            <h2 className="section-title">Popular Quiz Categories</h2>
            <p className="section-subtitle">
              Pick a topic and start practicing.
            </p>
          </div>

          <CardGrid
            items={featuredSets}
            getKey={(set) => set.id}
            renderContent={(set) => (
              <div className="home-card-content">
                <div className="home-card-icon">🛡️</div>
                <div className="home-card-title">{set.title}</div>
                <div className="home-card-subtitle">
                  {set.category || "Security+ practice set"}
                </div>
              </div>
            )}
            onItemClick={(set) => navigate(`/quiz/${set.id}`)}
            colProps={{ xs: 12, sm: 6, lg: 4 }}
            cardClassName="app-card home-card"
            rowClassName="g-4"
          />

          <div className="text-center mt-4">
            <Button className="browse-btn" onClick={() => navigate("/quiz")}>
              View All Quiz Categories
            </Button>
          </div>
        </section>
      </Container>
    </div>
  );
}