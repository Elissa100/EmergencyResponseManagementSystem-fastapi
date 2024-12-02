import React from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';

const HomePage = ({ setShowRegister, setShowLogin }) => {
  return (
    <Container fluid className="p-5 bg-light">
      <Row className="mb-5">
        <Col>
          <h1 className="text-center">Welcome to the Emergency Management System</h1>
          <p className="text-center">
            Your one-stop solution for managing emergency situations efficiently and effectively.
          </p>
        </Col>
      </Row>
      <Row className="text-center mb-5">
        <Col>
          <Button variant="primary" size="lg" onClick={() => setShowRegister(true)}>Register</Button>
          {' '}
          <Button variant="secondary" size="lg" onClick={() => setShowLogin(true)}>Login</Button>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Img variant="top" src="/assets/earthquake.jpg" alt="Real-Time Analytics" />
            <Card.Body>
              <Card.Title>Real-Time Analytics</Card.Title>
              <Card.Text>
                Get up-to-date information on emergency situations and respond quickly with our real-time analytics.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Img variant="top" src="/assets/img2.jpg" alt="Emergency Reporting" />
            <Card.Body>
              <Card.Title>Emergency Reporting</Card.Title>
              <Card.Text>
                Report emergencies effortlessly and get immediate assistance from the nearest responders.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Img variant="top" src="/assets/img.jpg" alt="Admin Dashboard" />
            <Card.Body>
              <Card.Title>Admin Dashboard</Card.Title>
              <Card.Text>
                Admins can manage users, track emergencies, and access detailed reports through the dashboard.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
