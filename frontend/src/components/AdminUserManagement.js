import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Container } from 'react-bootstrap';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch current user to check admin status
        const currentUserResponse = await axios.get('http://127.0.0.1:8000/users/current', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setIsAdmin(currentUserResponse.data.role === 'admin');

        if (currentUserResponse.data.role === 'admin') {
          // Fetch all users if admin
          const response = await axios.get('http://127.0.0.1:8000/users/', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
          setUsers(response.data);
        }
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/users/${userId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  if (!isAdmin) {
    return <p>You do not have permission to view this page.</p>;
  }

  return (
    <Container>
      <h2>User Management</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminUserManagement;
