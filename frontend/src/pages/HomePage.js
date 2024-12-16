import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="nav-logo">FundMyDream</div>
        <div className="nav-buttons">
          <button 
            className="nav-button login"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          <button 
            className="nav-button register"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
      </nav>

      <main className="hero-section">
        <h1>Turn Your Creative Dreams into Reality</h1>
        <p className="hero-subtitle">
          Connect with donors who believe in your vision and help make it happen
        </p>

        <div className="cta-buttons">
          <button 
            className="cta-button primary"
            onClick={() => navigate('/register')}
          >
            Start Your Project
          </button>
          <button 
            className="cta-button secondary"
            onClick={() => navigate('/projects/approved')}
          >
            Browse Projects
          </button>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <h3>For Creators</h3>
            <p>Launch your project and connect with supporters who share your passion</p>
          </div>
          <div className="feature-card">
            <h3>For Donors</h3>
            <p>Discover and support creative projects that inspire you</p>
          </div>
          <div className="feature-card">
            <h3>Track Progress</h3>
            <p>Follow project milestones and see your impact grow</p>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About FundMyDream</h4>
            <p>A platform connecting creative minds with supportive donors</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li onClick={() => navigate('/login')}>Login</li>
              <li onClick={() => navigate('/register')}>Register</li>
              <li onClick={() => navigate('/projects/approved')}>Browse Projects</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 FundMyDream. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;