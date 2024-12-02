import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'chart.js/auto';
import { Container } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await axios.get('http://127.0.0.1:8000/analytics/');
        setAnalytics(result.data);
      } catch (error) {
        console.error('Error fetching analytics', error);
      }
    };
    fetchAnalytics();
  }, []);

  if (!analytics) {
    return <p>Loading analytics...</p>;
  }

  const data = {
    labels: analytics.emergenciesByType.map(item => item.type),
    datasets: [
      {
        data: analytics.emergenciesByType.map(item => item.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
      },
    ],
  };

  return (
    <Container className="mt-5">
      <h2>Analytics</h2>
      <Pie data={data} />
    </Container>
  );
};

export default Analytics;
