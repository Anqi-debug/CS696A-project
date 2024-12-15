import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail } from 'lucide-react';
import './LoginForm.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('/api/users/login', { email, password });
      setMessage(response.data.message);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      
      switch (user.role) {
        case 'admin':
          navigate('/dashboard-admin');
          break;
        case 'donor':
          navigate(`/dashboard-donor/${user.id}`);
          break;
        case 'creator':
          navigate(`/dashboard-creator/${user.id}`);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="logo-container">
          <div className="app-logo">
            <span>FMP</span>
          </div>
          <h1 className="login-title">Fund My Project</h1>
          <p className="login-subtitle">Sign in to manage your projects</p>
        </div>

        {error && (
          <div className="error-message">{error}</div>
        )}

        {message && (
          <div className="success-message">{message}</div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email address
            </label>
            <div className="input-container">
              <Mail className="input-icon" size={20} />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="input-container">
              <Lock className="input-icon" size={20} />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="signup-section">
          <span className="signup-text">
            Don't have an account?
            <a href="/signup" className="signup-link">
              Create one now
            </a>
          </span>
        </div>

        <div className="features-grid">
          <div className="feature">
            <div className="feature-title">Secure</div>
            <div className="feature-description">256-bit encryption</div>
          </div>
          <div className="feature">
            <div className="feature-title">24/7</div>
            <div className="feature-description">Support available</div>
          </div>
          <div className="feature">
            <div className="feature-title">Trusted</div>
            <div className="feature-description">By thousands</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;