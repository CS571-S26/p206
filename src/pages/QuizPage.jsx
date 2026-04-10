import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Button, Row, Col, Alert, ProgressBar } from "react-bootstrap";
import { studySets } from "../data/studySets";
import { setContent } from "../data/setContent";
import "./QuizPage.css";

export default function QuizPage() {
  const { setId } = useParams();

  const selectedSet = studySets.find((set) => set.id === setId);
  const questions = useMemo(() => setContent[setId] || [], [setId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);

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

  const handleChoiceClick = (choice) => {
    if (answered) return;

    setSelectedChoice(choice);
    const correct = choice === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setAnswered(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedChoice("");
      setAnswered(false);
      setIsCorrect(null);
    } else {
      setCurrentIndex(questions.length);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedChoice("");
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
              <h1 className="mb-3">Quiz Complete</h1>
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
                <div className="quiz-label mb-2">
                  {currentQuestion.promptType === "definition" ? "Definition" : "Term"}
                </div>
                <h2 className="quiz-set-title mb-0">{selectedSet.title}</h2>
              </div>

              <div className="quiz-counter">
                {currentIndex + 1} of {questions.length}
              </div>
            </div>

            <ProgressBar now={progressPercent} className="quiz-progress mb-4" />

            <div className="quiz-prompt mb-5">
              {currentQuestion.prompt}
            </div>

            <h5 className="quiz-subheading mb-4">Choose an answer</h5>

            <Row className="g-3">
              {currentQuestion.choices.map((choice) => {
                let buttonClass = "answer-btn";

                if (answered) {
                  if (choice === currentQuestion.correctAnswer) {
                    buttonClass += " answer-correct";
                  } else if (choice === selectedChoice) {
                    buttonClass += " answer-wrong";
                  }
                }

                return (
                  <Col md={6} key={choice}>
                    <Button
                      className={buttonClass}
                      onClick={() => handleChoiceClick(choice)}
                    >
                      {choice}
                    </Button>
                  </Col>
                );
              })}
            </Row>

            {answered && (
              <div className="mt-4">
                {isCorrect ? (
                  <Alert variant="success" className="feedback-alert mb-0">
                    Correct. Your score is now {score}.
                  </Alert>
                ) : (
                  <Alert variant="danger" className="feedback-alert mb-0">
                    Incorrect. Correct answer: <strong>{currentQuestion.correctAnswer}</strong>
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