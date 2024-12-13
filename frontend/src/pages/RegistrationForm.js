import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', // Ensure initial value is an empty string
    email: '',
    password: '',
    role: 'donor', // Default value for the dropdown
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting registration data:', formData);
      const response = await axios.post('/users/registration', formData);
      if (response.status === 201) {
        const { role } = response.data.user || {}; // Handle case where user might be missing
        console.log('Registration successful:', response.data);
        if (role === 'creator') navigate('/dashboard-creator');
        else if (role === 'donor') navigate('/dashboard-donor');
        else if (role === 'admin') navigate('/dashboard-admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="registration-form">
      <h2>Create an Account</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username} // Always controlled
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email} // Always controlled
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password} // Always controlled
          onChange={handleChange}
          required
        />
        <select
          name="role"
          value={formData.role} // Always controlled
          onChange={handleChange}
        >
          <option value="donor">Donor</option>
          <option value="creator">Creator</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
