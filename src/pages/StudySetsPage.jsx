import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { studySets } from "../data/studySets";
import "./StudySetsPage.css";

export default function StudySetsPage() {
  const navigate = useNavigate();

  const practiceSets = studySets.filter(set => set.type === "practice");
  const acronymSets = studySets.filter(set => set.type === "acronym");

  return (
    <div className="studysets-page">
      <Container className="py-4">
        <Card className="studysets-card border-0">
          <Card.Body className="p-4">
            <div className="studysets-badge mb-4">Security+</div>

            <h2 className="studysets-title text-center mb-5">
              CompTIA Security+ Certification Exam SY0-701 Practice Sets
            </h2>

            <h3 className="section-title mb-3">Practice Tests</h3>
            <Row className="g-3 mb-5">
              {practiceSets.map((set) => (
                <Col md={6} key={set.id}>
                  <Button
                    className="set-button w-100 text-start"
                    onClick={() => navigate(`/flashcards/${set.id}`)}
                  >
                    {set.title}
                  </Button>
                </Col>
              ))}
            </Row>

            <h3 className="section-title mb-3">Acronyms Quizzes</h3>
            <Row className="g-3">
              {acronymSets.map((set) => (
                <Col md={6} key={set.id}>
                  <Button
                    className="set-button w-100 text-start"
                    onClick={() => navigate(`/flashcards/${set.id}`)}
                  >
                    {set.title}
                  </Button>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}