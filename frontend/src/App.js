import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AdminUserManagement from './components/AdminUserManagement';
import Analytics from './components/Analytics';
import Dashboard from './components/Dashboard';
import EmergenciesList from './components/EmergenciesList';
import HomePage from './components/HomePage';
import Login from './components/Login';
import NavigationBar from './components/Navbar';
import Register from './components/Register';
import ReportEmergency from './components/ReportEmergency';
import Toast from './components/Toast';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showReportEmergency, setShowReportEmergency] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState('success');

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUserRole(user.role);
    setUserId(user.id);
    setShowLogin(false);
    setToastMessage('Login successful');
    setToastVariant('success');
    setShowToast(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    setUserId(null);
    setToastMessage('Logged out');
    setToastVariant('warning');
    setShowToast(true);
  };

  const handleActionSuccess = (message) => {
    setToastMessage(message);
    setToastVariant('success');
    setShowToast(true);
  };

  const handleActionError = (message) => {
    setToastMessage(message);
    setToastVariant('danger');
    setShowToast(true);
  };

  return (
    <Router>
      <div className="App">
        <NavigationBar
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          setShowRegister={setShowRegister}
          setShowLogin={setShowLogin}
          setShowReportEmergency={setShowReportEmergency}
        />
        <main className="App-main">
          <Routes>
            <Route path="/" element={<HomePage setShowRegister={setShowRegister} setShowLogin={setShowLogin} />} />
            <Route path="/emergencies" element={<EmergenciesList userRole={userRole} userId={userId} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            {userRole === 'admin' && (
              <Route path="/admin/users" element={<AdminUserManagement />} />
            )}
          </Routes>
        </main>

        <Toast show={showToast} setShow={setShowToast} message={toastMessage} variant={toastVariant} />

        <Modal show={showRegister} onHide={() => setShowRegister(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Register</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Register onSuccess={() => {
              setShowRegister(false);
              handleActionSuccess('Registration successful');
            }} />
          </Modal.Body>
        </Modal>

        <Modal show={showLogin} onHide={() => setShowLogin(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Login onLogin={handleLogin} onError={handleActionError} />
          </Modal.Body>
        </Modal>

        <Modal show={showReportEmergency} onHide={() => setShowReportEmergency(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Report Emergency</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ReportEmergency onSuccess={() => {
              setShowReportEmergency(false);
              handleActionSuccess('Emergency reported successfully');
            }} onError={handleActionError} />
          </Modal.Body>
        </Modal>
      </div>
    </Router>
  );
}

export default App;
