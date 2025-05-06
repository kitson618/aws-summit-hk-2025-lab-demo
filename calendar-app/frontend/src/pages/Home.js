import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h1 className="display-4 mb-4">Welcome to Calendar Management</h1>
          <p className="lead mb-4">
            A simple and effective way to manage your schedule, appointments, and events.
          </p>
          
          {isAuthenticated ? (
            <Button as={Link} to="/calendar" variant="primary" size="lg">
              Go to Calendar
            </Button>
          ) : (
            <div>
              <Button as={Link} to="/login" variant="primary" size="lg" className="me-3">
                Login
              </Button>
              <Button as={Link} to="/register" variant="outline-primary" size="lg">
                Register
              </Button>
            </div>
          )}
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Easy Scheduling</Card.Title>
              <Card.Text>
                Create, edit, and manage your events with an intuitive interface.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Multiple Views</Card.Title>
              <Card.Text>
                View your calendar by day, week, or month to suit your needs.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title>Secure Access</Card.Title>
              <Card.Text>
                Your calendar data is secure and only accessible by you.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;