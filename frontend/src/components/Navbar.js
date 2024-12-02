import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavigationBar = ({ isAuthenticated, handleLogout, setShowRegister, setShowLogin, setShowReportEmergency }) => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">ERMS</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/emergencies">Emergencies</Nav.Link>
          {isAuthenticated && <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>}
        </Nav>
        <Nav>
          {!isAuthenticated && (
            <>
              <Button variant="link" onClick={() => setShowRegister(true)}>Register</Button>
              <Button variant="link" onClick={() => setShowLogin(true)}>Login</Button>
            </>
          )}
          {isAuthenticated && (
            <>
              <Button variant="link" onClick={() => setShowReportEmergency(true)}>Report Emergency</Button>
              <Button variant="link" onClick={handleLogout}>Logout</Button>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
