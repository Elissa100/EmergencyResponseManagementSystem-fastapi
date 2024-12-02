import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Row, Col, Button, Modal, Form } from 'react-bootstrap';

const EmergenciesList = ({ userRole, userId }) => {
  const [emergencies, setEmergencies] = useState([]);
  const [showRespondModal, setShowRespondModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const result = await axios.get('http://127.0.0.1:8000/emergencies/');
        setEmergencies(result.data);
      } catch (error) {
        console.error('Error fetching emergencies', error);
      }
    };
    fetchEmergencies();
  }, []);

  const handleShowRespondModal = (emergency) => {
    setSelectedEmergency(emergency);
    setResponseText('');
    setShowRespondModal(true);
  };

  const handleShowResponseModal = (emergency) => {
    setSelectedEmergency(emergency);
    setShowResponseModal(true);
  };

  const handleRespond = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/emergencies/${selectedEmergency.id}/respond`, { responder_id: userId, response_text: responseText });
      setShowRespondModal(false);
      // Update the emergencies list after responding
      const updatedEmergencies = emergencies.map(emergency =>
        emergency.id === selectedEmergency.id ? { ...emergency, responder_id: userId, response_text: responseText } : emergency
      );
      setEmergencies(updatedEmergencies);
    } catch (error) {
      console.error('Error responding to emergency', error);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Emergencies</h2>
      {emergencies.map(emergency => (
        <Card className="mb-3" key={emergency.id}>
          <Card.Body>
            <Row>
              <Col md={8}>
                <Card.Title>{emergency.description}</Card.Title>
                <Card.Text><strong>Location:</strong> {emergency.location}</Card.Text>
                <Card.Text><strong>Status:</strong> {emergency.responder_id ? 'Responded' : 'Not Responded'}</Card.Text>
              </Col>
              <Col md={4} className="text-right">
                {userRole === 'responder' && !emergency.responder_id && (
                  <Button variant="success" onClick={() => handleShowRespondModal(emergency)}>Respond</Button>
                )}
                {emergency.responder_id && (
                  <Button variant="info" onClick={() => handleShowResponseModal(emergency)}>View Response</Button>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
      
      <Modal show={showRespondModal} onHide={() => setShowRespondModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Respond to Emergency</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formResponse">
              <Form.Label>Response</Form.Label>
              <Form.Control as="textarea" rows={3} value={responseText} onChange={(e) => setResponseText(e.target.value)} placeholder="Enter your response" required />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRespondModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleRespond}>
            Submit Response
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={showResponseModal} onHide={() => setShowResponseModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Response to Emergency</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Description:</strong> {selectedEmergency?.description}</p>
          <p><strong>Location:</strong> {selectedEmergency?.location}</p>
          <p><strong>Response:</strong> {selectedEmergency?.response_text}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResponseModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EmergenciesList;
