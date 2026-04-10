import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { studySets } from "../data/studySets";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <Container fluid className="py-5">
        <div className="hero-section text-center mb-5">
          <h1 className="homepage-title">Welcome to CySecPrep</h1>
          <p className="homepage-subtitle">
            Prepare for the CompTIA Security+ Exam
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
            <Button className="hero-btn hero-btn-green">
              Start Quiz
            </Button>

            <Button
              className="hero-btn hero-btn-blue"
              onClick={() => navigate("/flashcards")}
            >
              Study Flashcards
            </Button>

            <Button className="hero-btn hero-btn-orange">
              Practice Matching
            </Button>
          </div>
        </div>

        <div className="categories-section text-center">
          <h2 className="mb-2">Quiz Categories</h2>
          <p className="mb-4">Choose a topic to get started.</p>

          <Row className="g-4">
            {studySets.map((set) => (
              <Col xs={12} sm={6} lg={4} xl={3} key={set.id}>
                <Card
                  className="category-card h-100 border-0"
                  onClick={() => navigate(`/quiz/${set.id}`)}
                >
                  <Card.Body className="d-flex align-items-center justify-content-center text-center">
                    <Card.Title className="mb-0 category-card-title">
                      {set.title}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
}