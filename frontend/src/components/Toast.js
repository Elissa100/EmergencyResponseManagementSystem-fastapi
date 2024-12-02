import React from 'react';
import { ToastContainer, Toast as BootstrapToast } from 'react-bootstrap';

const Toast = ({ show, setShow, message, variant = "success" }) => (
  <ToastContainer position="top-center" className="p-3">
    <BootstrapToast onClose={() => setShow(false)} show={show} delay={3000} autohide bg={variant}>
      <BootstrapToast.Body>{message}</BootstrapToast.Body>
    </BootstrapToast>
  </ToastContainer>
);

export default Toast;
