import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const emergencyTypes = [
  "Heart Attack", "Stroke", "Severe Allergic Reaction (Anaphylaxis)", "Choking", "Seizure", 
  "Severe Bleeding", "Poisoning", "Severe Burns", "Earthquake", "Flood", "Fire", "Tornado",
  "Hurricane", "Road Traffic Accident", "Fall", "Drowning", "Electrocution", "Epidemic Outbreak",
  "Pandemic", "Chemical Spill"
];

const Dashboard = () => {
  const [data, setData] = useState({
    totalEmergencies: 0,
    totalUsers: 0,
    emergenciesByType: [],
    emergenciesByLocation: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://127.0.0.1:8000/analytics/');
        setData(result.data);
      } catch (error) {
        console.error('Error fetching analytics data', error);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body className="text-center">
              <Card.Title>Total Emergencies</Card.Title>
              <Card.Text className="display-4">{data.totalEmergencies}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body className="text-center">
              <Card.Title>Total Users</Card.Title>
              <Card.Text className="display-4">{data.totalUsers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Emergencies by Type</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.emergenciesByType.filter(type => emergencyTypes.includes(type.type))}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {data.emergenciesByType.filter(type => emergencyTypes.includes(type.type)).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Emergencies by Location</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.emergenciesByLocation}>
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
