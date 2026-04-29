import { useMemo, useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Modal,
  Form
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  Lightbulb,
  VolumeUp,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  ArrowsFullscreen,
  PlusCircle,
  Trash
} from "react-bootstrap-icons";
import { studySets } from "../data/studySets";
import { SetContent } from "../data/SetContent";
import "./FlashcardsPage.css";

const CUSTOM_SETS_KEY = "customFlashcardSets";

export default function FlashcardsPage() {
  const navigate = useNavigate();
  const { setId } = useParams();
  const cardRef = useRef(null);

  const [customSets, setCustomSets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [displayedCards, setDisplayedCards] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [showAddSetModal, setShowAddSetModal] = useState(false);
  const [newSetTitle, setNewSetTitle] = useState("");
  const [newSetCategory, setNewSetCategory] = useState("Custom");
  const [newCards, setNewCards] = useState([
    { term: "", definition: "" }
  ]);

  useEffect(() => {
    const savedSets = JSON.parse(sessionStorage.getItem(CUSTOM_SETS_KEY)) || [];
    setCustomSets(savedSets);
  }, []);

  useEffect(() => {
    sessionStorage.setItem(CUSTOM_SETS_KEY, JSON.stringify(customSets));
  }, [customSets]);

  const allStudySets = useMemo(() => {
    return [...studySets, ...customSets];
  }, [customSets]);

  const activeSet = useMemo(() => {
    return allStudySets.find((set) => set.id === setId) || allStudySets[0];
  }, [setId, allStudySets]);

  const flashcards = useMemo(() => {
    if (!activeSet) return [];

    if (activeSet.isCustom) {
      return activeSet.cards || [];
    }

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
      activeSet.id,
      `${activeSet.id}-1`,
      specialSetMap[activeSet.id]
    ].filter(Boolean);

    return SetContent.filter((card) => possibleIds.includes(card.setId));
  }, [activeSet]);

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

  if (!activeSet) return null;

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
    if (isMobile) return; 
    if (!cardRef.current) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
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

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleCardChange = (index, field, value) => {
    setNewCards((prev) =>
      prev.map((card, i) =>
        i === index ? { ...card, [field]: value } : card
      )
    );
  };

  const handleAddCardRow = () => {
    setNewCards((prev) => [...prev, { term: "", definition: "" }]);
  };

  const handleRemoveCardRow = (index) => {
    setNewCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateSet = () => {
    const cleanedCards = newCards
      .filter((card) => card.term.trim() && card.definition.trim())
      .map((card, index) => ({
        id: `custom-card-${Date.now()}-${index}`,
        setId: `custom-${Date.now()}`,
        prompt: card.term.trim(),
        correctAnswers: [card.definition.trim()]
      }));


   

    if (!newSetTitle.trim() || cleanedCards.length === 0) return;

    const newSetId = `custom-${Date.now()}`;

    const createdSet = {
      id: newSetId,
      title: newSetTitle.trim(),
      category: newSetCategory.trim() || "Custom",
      isCustom: true,
      cards: cleanedCards.map((card) => ({
        ...card,
        setId: newSetId
      }))
    };

    setCustomSets((prev) => [...prev, createdSet]);

    setNewSetTitle("");
    setNewSetCategory("Custom");
    setNewCards([{ term: "", definition: "" }]);
    setShowAddSetModal(false);

    navigate(`/flashcards/${newSetId}`);
  };


   const handleDeleteSet = () => {
    if (!activeSet?.isCustom) return;

    const updatedSets = customSets.filter((set) => set.id !== activeSet.id);
    setCustomSets(updatedSets);

    const nextSetId = studySets[0]?.id;
    if (nextSetId) {
      navigate(`/flashcards/${nextSetId}`);
    }
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

              <h2 className="flashcards-title mb-2">CySecPrep Flashcards</h2>

              <p className="flashcards-subtitle mb-0">
                Review key terms and concepts for the CompTIA Security+ exam.
              </p>

              <div className="d-flex flex-wrap gap-2 mt-3">
                {!activeSet.isCustom && (
                  <Button
                    className="flashcards-btn"
                    onClick={() => navigate(`/quiz/${activeSet.id}`)}
                  >
                    Test this set
                  </Button>
                )}

                <Button
                  className="flashcards-btn flashcards-btn-green"
                  onClick={() => setShowAddSetModal(true)}
                >
                  <PlusCircle className="me-2" />
                  Add Set
                </Button>
                
                {activeSet.isCustom && (
                <Button
                  className="flashcards-btn flashcards-btn-red"
                  onClick={handleDeleteSet}
                >
                  <Trash className="me-2" />
                  Delete Set
                </Button>
              )}
                
                
              </div>
            </div>

            <Card className="flashcard-shell border-0">
              <Card.Body className="p-3 p-md-4">
                <div className="d-flex justify-content-between align-items-center mb-3 flashcard-shell-top">
                  <div>
                    <Lightbulb className="me-2" />
                    <span>Tap the card or press Space to flip. Use arrow keys to move cards.</span>
                  </div>

                  <div className="d-flex gap-3 fs-5">
                    <Button
                      variant="link"
                      className="icon-btn p-0 text-white"
                      onClick={handleVoiceReader}
                    >
                      <VolumeUp />
                    </Button>

                    <Button
                      variant="link"
                      className="icon-btn p-0 text-white"
                      onClick={handleFullscreenToggle}
                    >
                      <ArrowsFullscreen />
                    </Button>
                  </div>
                </div>

                <Card
                  className="flashcard-main border-0"
                  ref={cardRef}
                  tabIndex={0}
                  role="button"
                  aria-label={`Flashcard ${currentIndex + 1} of ${displayedCards.length}. Press space to flip, left arrow for previous card, right arrow for next card.`}
                  onClick={() => setFlipped(!flipped)}
                  onKeyDown={(e) => {
                    if (e.key === " ") {
                      e.preventDefault();
                      setFlipped((prev) => !prev);
                    }

                    if (e.key === "ArrowRight") {
                      e.preventDefault();
                      handleNext();
                    }

                    if (e.key === "ArrowLeft") {
                      e.preventDefault();
                      handlePrev();
                    }
                  }}
                >
                  <Card.Body className="d-flex justify-content-center align-items-center text-center">
                    {displayedCards.length > 0 ? (
                      <div>
                        <Badge bg="info" className="mb-3 flashcard-badge">
                          {flipped ? "Definition" : "Term"}
                        </Badge>

                        <h2 className="flashcard-text mb-0">
                          {flipped
                            ? currentCard?.correctAnswers?.join(", ")
                            : currentCard?.prompt}
                        </h2>
                      </div>
                    ) : (
                      <h2 className="flashcard-text mb-0">No cards yet</h2>
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
                {displayedCards.length
                  ? `${currentIndex + 1} / ${displayedCards.length}`
                  : "0 / 0"}
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
                <h3 className="mb-3">Study Set Info</h3>
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
                <h3 className="mb-3">All Study Sets</h3>

                <div className="scrollable-sets-box">
                  <div className="d-grid gap-2">
                    {allStudySets.map((set) => (
                      <Button
                        key={set.id}
                        className={`sidebar-list-btn text-start ${
                          activeSet.id === set.id ? "sidebar-list-btn-active" : ""
                        }`}
                        onClick={() => navigate(`/flashcards/${set.id}`)}
                      >
                        {set.title}
                        {set.isCustom && (
                          <Badge bg="success" className="ms-2">
                            Custom
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card className="sidebar-card border-0 mt-3">
              <Card.Body>
                <h3 className="mb-3">Card List</h3>

                <div className="sidebar-card-list d-grid gap-2">
                  {displayedCards.map((card, index) => (
                    <Button
                      key={card.id || index}
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

      <Modal
        show={showAddSetModal}
        onHide={() => setShowAddSetModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="custom-set-modal-header">
          <Modal.Title>Create Custom Flashcard Set</Modal.Title>
        </Modal.Header>

        <Modal.Body className="custom-set-modal-body">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Set Title</Form.Label>
              <Form.Control
                value={newSetTitle}
                onChange={(e) => setNewSetTitle(e.target.value)}
                placeholder="Example: Network Acronyms"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Category</Form.Label>
              <Form.Control
                value={newSetCategory}
                onChange={(e) => setNewSetCategory(e.target.value)}
                placeholder="Example: Networking"
              />
            </Form.Group>

            <h3 className="mb-3">Terms and Definitions</h3>

            {newCards.map((card, index) => (
              <div className="custom-card-row" key={index}>
                <Form.Control
                  value={card.term}
                  onChange={(e) =>
                    handleCardChange(index, "term", e.target.value)
                  }
                  placeholder="Term"
                />

                <Form.Control
                  value={card.definition}
                  onChange={(e) =>
                    handleCardChange(index, "definition", e.target.value)
                  }
                  placeholder="Definition"
                />

                {newCards.length > 1 && (
                  <Button
                    variant="danger"
                    className="custom-remove-btn"
                    onClick={() => handleRemoveCardRow(index)}
                  >
                    <Trash />
                  </Button>
                )}
              </div>
            ))}

            <Button
              className="flashcards-btn mt-2"
              type="button"
              onClick={handleAddCardRow}
            >
              Add another card
            </Button>
          </Form>
        </Modal.Body>

        <Modal.Footer className="custom-set-modal-footer">
          <Button
            variant="secondary"
            onClick={() => setShowAddSetModal(false)}
          >
            Cancel
          </Button>

          <Button
            className="flashcards-btn flashcards-btn-green"
            onClick={handleCreateSet}
          >
            Save Set
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}