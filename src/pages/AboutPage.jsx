import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, ListGroup, Button, Badge } from 'react-bootstrap'
import './AboutPage.css'

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <main className="about-page py-5" aria-labelledby="about-heading">
      <Container>
        <Card className="about-card p-4">
          <Card.Body>
            <Row className="g-4 align-items-start">
              <Col xs={12} lg={8}>
                <Badge pill bg="info" className="about-badge mb-3">
                  CySecPrep
                </Badge>
                <h2 id="about-heading" className="about-title">About This Project</h2>
                <p className="about-intro">
                  This project is a web-based cybersecurity learning platform designed to help users study and reinforce key concepts through interactive quizzes and flashcards.
                  It focuses on making complex topics—such as Security+ concepts, acronyms, and penetration testing—more approachable through active learning.
                </p>
                <p className="about-intro">
                  Learn more about the CompTIA Security+ certification on the official site at{' '}
                  <a
                    href="https://www.comptia.org/certifications/security"
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="Open CompTIA Security Plus official site in a new tab"
                    className="text-info"
                  >
                    comptia.org
                  </a>.
                </p>

                <section className="about-section mb-4">
                  <h2 className="section-heading">Purpose</h2>
                  <p>
                    The goal of this project is to create a more effective way to study cybersecurity topics by combining structured content with interactivity.
                    Traditional studying methods can be repetitive and inefficient, so this platform emphasizes practice, repetition, and immediate feedback to improve retention.
                  </p>
                  <p>
                    This project is also part of a broader effort to apply modern web development techniques—such as React, component-based design, and API integration—to build a functional and user-friendly application.
                  </p>
                </section>

                <section className="about-section mb-4">
                  <h2 className="section-heading">Technology</h2>
                  <p>
                    This application is built using modern web technologies, including React for the user interface and component structure, along with JavaScript for handling data and interactivity.
                    The design emphasizes modular components and reusable layouts to keep the codebase scalable and maintainable.
                  </p>
                </section>

                <section className="about-section">
                  <h2 className="section-heading">Ongoing Development</h2>
                  <p>
                    This project is actively being developed and improved. Future updates may include additional question sets, enhanced user tracking, and more advanced study tools to further support learning and exam preparation.
                  </p>
                </section>
              </Col>
              <Col xs={12} lg={4}>
                <Card className="feature-card">
                  <Card.Body>
                    <Card.Title as="h2">Features</Card.Title>
                    <ListGroup variant="flush" className="feature-list">
                      <ListGroup.Item>Interactive quizzes with instant feedback</ListGroup.Item>
                      <ListGroup.Item>Support for multiple question types, including multi-select</ListGroup.Item>
                      <ListGroup.Item>Flashcards for quick concept review</ListGroup.Item>
                      <ListGroup.Item>Organized topics for focused studying</ListGroup.Item>
                      <ListGroup.Item>Responsive and clean user interface</ListGroup.Item>
                    </ListGroup>
                    <div className="feature-card-actions mt-4 d-flex flex-column gap-2">
                      <Button variant="primary" onClick={() => navigate('/quiz')}>
                        Take a Quiz
                      </Button>
                      <Button variant="light" onClick={() => navigate('/flashcards')}>
                        Open Flashcards
                      </Button>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="resource-card mt-4">
                  <Card.Body>
                    <Card.Title as="h2">Other Resources</Card.Title>
                    <p className="resource-description">
                      Helpful study references for deeper learning and exam prep. Use these trusted resources to review course videos and official certification details.
                    </p>
                    <ListGroup variant="flush" className="resource-list">
                      <ListGroup.Item>
                        <a
                          href="https://www.youtube.com/c/professormesser"
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-info"
                        >
                          Professor Messer YouTube
                        </a>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <a
                          href="https://www.comptia.org/certifications/security"
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-info"
                        >
                          Official CompTIA Security+ site
                        </a>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </main>
  )
}
