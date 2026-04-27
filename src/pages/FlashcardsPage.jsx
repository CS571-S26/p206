import { useMemo, useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  Lightbulb,
  VolumeUp,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  ArrowsFullscreen
} from "react-bootstrap-icons";
import { studySets } from "../data/studySets";
import { SetContent } from "../data/SetContent";
import "./FlashcardsPage.css";

export default function FlashcardsPage() {
  const navigate = useNavigate();
  const { setId } = useParams();

  const activeSet = useMemo(() => {
    return studySets.find((set) => set.id === setId) || studySets[0];
  }, [setId]);

  const flashcards = useMemo(() => {
  const specialSetMap = {
    "threat-vectors": "attack-surfaces-1",
    "malware-attacks": "malware-1",
    "vulnerability-management": "vuln-management-1",
    "secure-protocols": "secure-protocols-1",
    "application-security": "application-security-1",
    "network-attacks": "network-attacks-1",
    "application-attacks": "application-attacks-1",
    "security-vulnerabilities": "security-vulnerabilities-1",
    "data-protection": "data-protection-1",
    "resilience-recovery": "resilience-recovery-1",
    "wireless-security": "wireless-security-1",
    "indicators-malicious": "indicators-malicious-1",
    "access-controls": "access-controls-1",
    "password-concepts": "password-concepts-1",
    "incident-response": "incident-response-1",
    "risk-management": "risk-management-1",
    "agreement-types": "agreement-types-1",
    "penetration-testing": "penetration-testing-1"
  };

  const possibleIds = [
    activeSet?.id,
    `${activeSet?.id}-1`,
    specialSetMap[activeSet?.id]
  ].filter(Boolean);

  return SetContent.filter((card) => possibleIds.includes(card.setId));
}, [activeSet]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [displayedCards, setDisplayedCards] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    setDisplayedCards(flashcards);
    setCurrentIndex(0);
    setFlipped(false);
  }, [flashcards]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (isSpeaking && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentIndex, flipped]);

  if (!activeSet) {
    return null;
  }

  const currentCard = displayedCards[currentIndex];

  const handleNext = () => {
    if (!displayedCards.length) return;
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % displayedCards.length);
  };

  const handlePrev = () => {
    if (!displayedCards.length) return;
    setFlipped(false);
    setCurrentIndex((prev) =>
      prev === 0 ? displayedCards.length - 1 : prev - 1
    );
  };

  const shuffleArray = (items) => {
    return [...items].sort(() => Math.random() - 0.5);
  };

  const handleShuffle = () => {
    if (displayedCards.length < 2) return;
    setFlipped(false);
    setDisplayedCards((prev) => shuffleArray(prev));
    setCurrentIndex(0);
  };

  const handleFullscreenToggle = async () => {
    if (!cardRef.current) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (cardRef.current.requestFullscreen) {
        await cardRef.current.requestFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  const handleVoiceReader = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = flipped
      ? `Definition: ${currentCard?.correctAnswers?.join(", ") || "No answer available"}`
      : `Term: ${currentCard?.prompt || "No question available"}`;

    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flashcards-page">
      <Container fluid="lg" className="py-4">
        <Row>
          <Col lg={9}>
            <div className="mb-3">
              <div className="flashcards-breadcrumb mb-2">
                Security+ / Flashcards / {activeSet.title}
              </div>
              <h1 className="flashcards-title mb-2">CySecPrep Flashcards</h1>
              <p className="flashcards-subtitle mb-0">
                Review key terms and concepts for the CompTIA Security+ exam.
              </p>
              <Button
                className="flashcards-btn mt-3"
                onClick={() => navigate(`/quiz/${activeSet.id}`)}
              >
                Test this set
              </Button>
            </div>

            <Card className="flashcard-shell border-0">
              <Card.Body className="p-3 p-md-4">
                <div className="d-flex justify-content-between align-items-center mb-3 flashcard-shell-top">
                  <div>
                    <Lightbulb className="me-2" />
                    <span>Tap the card to flip</span>
                  </div>

                  <div className="d-flex gap-3 fs-5">
                    <Button
                      variant="link"
                      className="icon-btn p-0 text-white"
                      onClick={handleVoiceReader}
                      aria-label={isSpeaking ? "Stop voice reader" : "Read card aloud"}
                    >
                      <VolumeUp />
                    </Button>
                    <Button
                      variant="link"
                      className="icon-btn p-0 text-white"
                      onClick={handleFullscreenToggle}
                      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    >
                      <ArrowsFullscreen />
                    </Button>
                  </div>
                </div>

                <Card
                  className="flashcard-main border-0"
                  ref={cardRef}
                  onClick={() => setFlipped(!flipped)}
                >
                  <Card.Body className="d-flex justify-content-center align-items-center text-center">
                    {displayedCards.length > 0 ? (
                      <div>
                        <Badge bg="info" className="mb-3 flashcard-badge">
                          {flipped ? "Definition" : "Term"}
                        </Badge>
                        <h2 className="flashcard-text mb-0">
                        {flipped
                          ? (currentCard?.correctAnswers?.join(", ") || "No answer available")
                          : (currentCard?.prompt || "No question available")}
                      </h2>
                      </div>
                    ) : (
                      <div>
                        <h2 className="flashcard-text mb-0">No cards yet</h2>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>

            <div className="flashcard-controls mt-4 d-flex justify-content-center align-items-center flex-wrap gap-3">
              <Button className="control-btn rounded-circle" onClick={handlePrev}>
                <ChevronLeft size={22} />
              </Button>

              <div className="flashcard-counter">
                {displayedCards.length ? `${currentIndex + 1} / ${displayedCards.length}` : "0 / 0"}
              </div>

              <Button className="control-btn rounded-circle" onClick={handleNext}>
                <ChevronRight size={22} />
              </Button>

              <Button className="control-btn rounded-circle" onClick={handleShuffle}>
                <Shuffle size={18} />
              </Button>

              <Button className="control-btn rounded-circle" onClick={handleFullscreenToggle}>
                <ArrowsFullscreen size={18} />
              </Button>
            </div>
          </Col>

          <Col lg={3} className="mt-4 mt-lg-0">
            <Card className="sidebar-card border-0">
              <Card.Body>
                <h5 className="mb-3">Study Set Info</h5>
                <p className="mb-2">
                  <strong>Category:</strong> {activeSet.category}
                </p>
                <p className="mb-2">
                  <strong>Total Cards:</strong> {displayedCards.length}
                </p>
                <p className="mb-0">
                  <strong>Focus:</strong> {activeSet.title}
                </p>
              </Card.Body>
            </Card>

            <Card className="sidebar-card border-0 mt-3">
              <Card.Body>
                <h5 className="mb-3">All Study Sets</h5>
                <div className="scrollable-sets-box">
                  <div className="d-grid gap-2">
                    {studySets.map((set) => (
                      <Button
                        key={set.id}
                        className={`sidebar-list-btn text-start ${
                          activeSet.id === set.id ? "sidebar-list-btn-active" : ""
                        }`}
                        onClick={() => navigate(`/flashcards/${set.id}`)}
                      >
                        {set.title}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="sidebar-card border-0 mt-3">
              <Card.Body>
                <h5 className="mb-3">Card List</h5>
                <div className="sidebar-card-list d-grid gap-2">
                  {displayedCards.map((card, index) => (
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
                      {index + 1}. {card.prompt}
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