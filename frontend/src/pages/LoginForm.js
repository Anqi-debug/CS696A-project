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

      // Store token and userId in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id); // Save the userId to local storage

      // Navigate to the appropriate dashboard based on the user's role
      switch (user.role) {
        case 'admin':
          navigate('/dashboard-admin');
          break;
        case 'donor':
          navigate(`/dashboard-donor/${user.id}`);
          break;
        case 'creator':
          navigate(`/dashboard-creator/${user.id}`); // Pass user ID for personalized navigation
          break;
        default:
          setError('Invalid user role');
          break;
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
