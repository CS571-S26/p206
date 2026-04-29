import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Button, Row, Col, Alert, ProgressBar } from "react-bootstrap";
import { studySets } from "../data/studySets";
import { SetContent } from "../data/SetContent";
import "./QuizPage.css";

export default function QuizPage() {
  const { setId } = useParams();

  const selectedSet = useMemo(() => {
    return studySets.find((set) => set.id === setId);
  }, [setId]);

  const questions = useMemo(() => {
    const specialSetMap = {
      "threat-vectors": "attack-surfaces-1",
      "malware-attacks": "malware-1",
      "vulnerability-management": "vuln-management-1",
      "secure-protocols": "secure-protocols-1",
      "application-security": "application-security-1",
      "network-attacks": "network-attacks-1",
      "application-attacks": "application-attacks-1",
      "security-vulnerabilities": "vulnerabilities-1",
      "data-protection": "data-protection-1",
      "resilience-recovery": "resilience-recovery-1",
      "wireless-security": "wireless-security-1",
      "indicators-malicious": "ioc-1",
      "access-controls": "access-controls-1",
      "password-concepts": "passwords-1",
      "incident-response": "incident-response-1",
      "risk-management": "risk-management-1",
      "agreement-types": "agreements-1",
      "penetration-testing": "pentesting-1"
    };

    const possibleIds = [
      setId,
      `${setId}-1`,
      specialSetMap[setId]
    ].filter(Boolean);

    return SetContent.filter((question) => possibleIds.includes(question.setId));
  }, [setId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState([]);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedChoices([]);
    setAnswered(false);
    setIsCorrect(null);
    setScore(0);
  }, [setId]);

  if (!selectedSet) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Quiz set not found.</Alert>
      </Container>
    );
  }

  if (questions.length === 0) {
    return (
      <Container className="py-5">
        <Alert variant="warning">No quiz questions found for this set yet.</Alert>
      </Container>
    );
  }

  const currentQuestion = questions[currentIndex];
  const quizFinished = currentIndex >= questions.length;
  const correctAnswers = (currentQuestion?.correctAnswers || []).map(String);
  const requiredSelections = currentQuestion?.select || 1;
  const isMultiSelect = requiredSelections > 1;

  const resetQuestionState = () => {
    setSelectedChoices([]);
    setAnswered(false);
    setIsCorrect(null);
  };

  const handleChoiceClick = (choice) => {
    if (answered) return;

    const choiceStr = String(choice);

    if (!isMultiSelect) {
      const correct = correctAnswers.includes(choiceStr);
      setSelectedChoices([choiceStr]);
      setIsCorrect(correct);
      setAnswered(true);

      if (correct) {
        setScore((prev) => prev + 1);
      }
      return;
    }

    setSelectedChoices((prev) => {
      if (prev.includes(choiceStr)) {
        return prev.filter((item) => item !== choiceStr);
      }

      if (prev.length < requiredSelections) {
        return [...prev, choiceStr];
      }

      return prev;
    });
  };

  const handleSubmitAnswer = () => {
    if (answered || !isMultiSelect) return;
    if (selectedChoices.length !== requiredSelections) return;

    const selectedSorted = [...selectedChoices].sort();
    const correctSorted = [...correctAnswers].sort();

    const correct =
      selectedSorted.length === correctSorted.length &&
      selectedSorted.every((choice, index) => choice === correctSorted[index]);

    setIsCorrect(correct);
    setAnswered(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetQuestionState();
    } else {
      setCurrentIndex(questions.length);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedChoices([]);
    setAnswered(false);
    setIsCorrect(null);
    setScore(0);
  };

  if (quizFinished) {
    const percent = Math.round((score / questions.length) * 100);

    return (
      <div className="quiz-page">
        <Container className="py-5">
          <Card className="quiz-card border-0 result-card">
            <Card.Body className="p-4 p-md-5 text-center">
              <h2 className="mb-3">Quiz Complete</h2>
              <h3 className="mb-3">{selectedSet.title}</h3>
              <p className="result-score">
                Score: {score} / {questions.length}
              </p>
              <p className="result-percent">{percent}%</p>

              <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
                <Button className="quiz-next-btn" onClick={handleRestart}>
                  Restart Quiz
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="quiz-page">
      <Container className="py-5">
        <Card className="quiz-card border-0">
          <Card.Body className="p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
              <div>
                <div className="quiz-label mb-2">Question</div>
                <h2 className="quiz-set-title mb-0">{selectedSet.title}</h2>
              </div>

              <div className="quiz-counter">
                {currentIndex + 1} of {questions.length}
              </div>
            </div>

            <ProgressBar now={progressPercent} className="quiz-progress mb-4" />

            <div className="quiz-prompt mb-3">{currentQuestion.prompt}</div>

            <h3 className="quiz-subheading mb-2">
              {isMultiSelect
                ? `Select ${requiredSelections} answers`
                : "Choose an answer"}
            </h3>

            {isMultiSelect && !answered && (
              <p className="mb-4 text-light">
                Selected {selectedChoices.length} of {requiredSelections}
              </p>
            )}

            <Row className="g-3">
              {currentQuestion.choices.map((choice, index) => {
                const choiceStr = String(choice);
                let buttonClass = "answer-btn";

                if (answered) {
                  if (correctAnswers.includes(choiceStr)) {
                    buttonClass += " answer-correct";
                  } else if (selectedChoices.includes(choiceStr)) {
                    buttonClass += " answer-wrong";
                  }
                } else if (selectedChoices.includes(choiceStr)) {
                  buttonClass += " answer-selected";
                }

                return (
                  <Col md={6} key={`${choiceStr}-${index}`}>
                    <Button
                      className={buttonClass}
                      onClick={() => handleChoiceClick(choice)}
                    >
                      {choiceStr}
                    </Button>
                  </Col>
                );
              })}
            </Row>

            {!answered && isMultiSelect && (
              <div className="mt-4">
                <Button
                  className="quiz-next-btn"
                  onClick={handleSubmitAnswer}
                  disabled={selectedChoices.length !== requiredSelections}
                >
                  Submit Answer
                </Button>
              </div>
            )}

            {answered && (
              <div className="mt-4">
                {isCorrect ? (
                  <Alert variant="success" className="feedback-alert mb-0">
                    Correct. Your score is now {score}.
                  </Alert>
                ) : (
                  <Alert variant="danger" className="feedback-alert mb-0">
                    Incorrect. Correct answer{correctAnswers.length > 1 ? "s" : ""}:{" "}
                    <strong>{correctAnswers.join(", ")}</strong>
                  </Alert>
                )}
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4">
              <div className="score-display">
                Score: {score} / {questions.length}
              </div>

              <Button
                className="quiz-next-btn"
                onClick={handleNext}
                disabled={!answered}
              >
                {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}