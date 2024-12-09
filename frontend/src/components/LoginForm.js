import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/login', { email, password });
      setMessage(response.data.message);

      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Navigate to the appropriate dashboard based on the user's role
      if (user.role === 'admin') {
        navigate('/dashboard-admin');
      } else if (user.role === 'donor') {
        navigate('/dashboard-donor');
      } else if (user.role === 'creator') {
        navigate('/dashboard-creator');
      } else {
        setError('Invalid user role');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError('User not found.');
      } else if (err.response?.status === 401) {
        setError('Invalid credentials.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
