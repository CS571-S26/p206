import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { studySets } from "../data/studySets";
import { SetContent } from "../data/SetContent";
import "./QuizSetsPage.css";
const QUIZ_PROGRESS_KEY = "quizProgress";

export default function QuizSetsPage() {
  const navigate = useNavigate();

  const getProgress = (setId) => {
  const saved =
    JSON.parse(sessionStorage.getItem(QUIZ_PROGRESS_KEY)) || {};

  const setProgress = saved[setId];

  if (!setProgress) return 0;

  return setProgress.currentIndex || 0;
};

  return (
    <div className="quizsets-page">
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="quizsets-title">Quiz Categories</h1>
          <p className="quizsets-subtitle">
            Choose a topic to enter quiz mode.
          </p>
        </div>

        <Row className="g-4">
          {studySets.map((set) => (
            <Col xs={12} sm={6} lg={4} xl={3} key={set.id}>
              <Card
               className="quizset-card h-100 border-0"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/quiz/${set.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate(`/quiz/${set.id}`);
                }
              }}
            >
                <Card.Body className="d-flex flex-column justify-content-center text-center">
                <Card.Title className="quizset-card-title mb-2">
                  {set.title}
                </Card.Title>

                <div className="quizset-category">{set.category}</div>

                {/* PROGRESS TEXT */}
                <div className="quiz-progress-text">
                  {getProgress(set.id)} / {
                    // total questions for this set
                    SetContent.filter(q =>
                      [set.id, `${set.id}-1`].includes(q.setId)
                    ).length
                  } completed
                </div>
              </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}