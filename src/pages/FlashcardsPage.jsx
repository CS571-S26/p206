import { useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, ButtonGroup, Badge } from "react-bootstrap";
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Grid,
  Book,
  PencilSquare,
  Controller,
  Lightbulb,
  VolumeUp,
  Gear,
  ArrowsFullscreen
} from "react-bootstrap-icons";

import "./FlashcardsPage.css";







const flashcards = [
  {
    term: "CIA Triad",
    definition: "Confidentiality, Integrity, and Availability."
  },
  {
    term: "Phishing",
    definition: "A social engineering attack that tricks users into revealing sensitive information."
  },
  {
    term: "MFA",
    definition: "Multi-factor authentication requires two or more verification factors."
  },
  {
    term: "Firewall",
    definition: "A security system that monitors and filters incoming and outgoing network traffic."
  },
  {
    term: "Least Privilege",
    definition: "Giving users only the minimum access needed to perform their role."
  }
];

export default function FlashcardsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const { setId } = useParams();
  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) =>
      prev === 0 ? flashcards.length - 1 : prev - 1
    );
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * flashcards.length);
    setFlipped(false);
    setCurrentIndex(randomIndex);
  };

  return (
    <div className="flashcards-page">
      <Container fluid="lg" className="py-4">
        <Row>
          <Col lg={9}>
            <div className="mb-3">
              <div className="flashcards-breadcrumb mb-2">
                Security+ / Flashcards / Domain 1
              </div>
              <h1 className="flashcards-title mb-2">CySecPrep Flashcards</h1>
              <p className="flashcards-subtitle mb-0">
                Review key terms and concepts for the CompTIA Security+ exam.
              </p>
            </div>

            <Row className="g-3 mb-4">
              <Col md={6} xl={3}>
                <Button className="mode-btn mode-btn-active w-100">
                  <Book className="me-2" />
                  Flashcards
                </Button>
              </Col>

              <Col md={6} xl={3}>
                <Button className="mode-btn w-100">
                  <Grid className="me-2" />
                  Learn
                </Button>
              </Col>

              <Col md={6} xl={3}>
                <Button className="mode-btn w-100">
                  <PencilSquare className="me-2" />
                  Test
                </Button>
              </Col>

              <Col md={6} xl={3}>
                <Button className="mode-btn w-100">
                  <Controller className="me-2" />
                  Match
                </Button>
              </Col>
            </Row>

            <Card className="flashcard-shell border-0">
              <Card.Body className="p-3 p-md-4">
                <div className="d-flex justify-content-between align-items-center mb-3 flashcard-shell-top">
                  <div>
                    <Lightbulb className="me-2" />
                    <span>Tap the card to flip</span>
                  </div>

                  <div className="d-flex gap-3 fs-5">
                    <VolumeUp />
                    <Gear />
                  </div>
                </div>

                <Card
                  className="flashcard-main border-0"
                  onClick={() => setFlipped(!flipped)}
                >
                  <Card.Body className="d-flex justify-content-center align-items-center text-center">
                    <div>
                      <Badge bg="info" className="mb-3 flashcard-badge">
                        {flipped ? "Definition" : "Term"}
                      </Badge>
                      <h2 className="flashcard-text mb-0">
                        {flipped ? currentCard.definition : currentCard.term}
                      </h2>
                    </div>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>

            <div className="flashcard-controls mt-4 d-flex justify-content-center align-items-center flex-wrap gap-3">
              <Button className="control-btn rounded-circle" onClick={handlePrev}>
                <ChevronLeft size={22} />
              </Button>

              <div className="flashcard-counter">
                {currentIndex + 1} / {flashcards.length}
              </div>

              <Button className="control-btn rounded-circle" onClick={handleNext}>
                <ChevronRight size={22} />
              </Button>

              <Button className="control-btn rounded-circle" onClick={handleShuffle}>
                <Shuffle size={18} />
              </Button>

              <Button className="control-btn rounded-circle">
                <ArrowsFullscreen size={18} />
              </Button>
            </div>
          </Col>

          <Col lg={3} className="mt-4 mt-lg-0">
            <Card className="sidebar-card border-0">
              <Card.Body>
                <h5 className="mb-3">Study Set Info</h5>
                <p className="mb-2">
                  <strong>Category:</strong> Security+ Basics
                </p>
                <p className="mb-2">
                  <strong>Total Cards:</strong> {flashcards.length}
                </p>
                <p className="mb-0">
                  <strong>Focus:</strong> Terms, acronyms, and security concepts
                </p>
              </Card.Body>
            </Card>

            <Card className="sidebar-card border-0 mt-3">
              <Card.Body>
                <h5 className="mb-3">Card List</h5>
                <div className="d-grid gap-2">
                  {flashcards.map((card, index) => (
                    <Button
                      key={index}
                      className={`sidebar-list-btn text-start ${
                        currentIndex === index ? "sidebar-list-btn-active" : ""
                      }`}
                      onClick={() => {
                        setCurrentIndex(index);
                        setFlipped(false);
                      }}
                    >
                      {index + 1}. {card.term}
                    </Button>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}