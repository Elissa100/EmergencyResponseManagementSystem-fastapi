import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';

const emergencyTypes = [
  "Heart Attack", "Stroke", "Severe Allergic Reaction (Anaphylaxis)", "Choking", "Seizure", 
  "Severe Bleeding", "Poisoning", "Severe Burns", "Earthquake", "Flood", "Fire", "Tornado",
  "Hurricane", "Road Traffic Accident", "Fall", "Drowning", "Electrocution", "Epidemic Outbreak",
  "Pandemic", "Chemical Spill"
];

const ReportEmergency = () => {
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/emergencies/', { description: `${selectedType}: ${description}`, location });
      alert('Emergency reported successfully');
    } catch (error) {
      console.error('Error reporting emergency', error);
      alert('Reporting failed');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Report Emergency</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formType">
          <Form.Label>Type of Emergency</Form.Label>
          <Form.Control as="select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} required>
            <option value="">Select an emergency type</option>
            {emergencyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter detailed description" required />
        </Form.Group>
        <Form.Group controlId="formLocation">
          <Form.Label>Location</Form.Label>
          <Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter location" required />
        </Form.Group>
        <Button variant="danger" type="submit">
          Report Emergency
        </Button>
      </Form>
    </Container>
  );
};

export default ReportEmergency;
