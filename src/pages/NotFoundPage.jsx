import '../App.css'
import { Card, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="w-100 min-vh-100 d-flex justify-content-center align-items-center">
      <Card className="m-4 p-3 shadow border-0">
        <Card.Body className="text-center">
          <h1>404 — Page Not Found</h1>
          <p>The page you requested does not exist.</p>

          <Button as={Link} to="/" className="mt-3">
            Go back home
          </Button>
        </Card.Body>
      </Card>
    </div>
  )
}