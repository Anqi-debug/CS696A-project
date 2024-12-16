import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../services/api';
//import './UserInfo.css'; 

const UserInfo = () => {
  const { userId } = useParams(); // Get userId from the URL params
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`/users/${userId}/portfolio`);
        setUserInfo(response.data.user);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch user information.');
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  if (loading) {
    return <div className="loading-state">Loading user information...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-info-container">
      <h1>User Information</h1>

      {userInfo && (
        <div className="user-info-content">
          <div className="user-info-group">
            <label>Bio:</label>
            <p>{userInfo.bio || 'No bio available'}</p>
          </div>

          {userInfo.role === 'creator' && (
            <div className="user-info-group">
              <label>Portfolio Items:</label>
              {userInfo.portfolioItems && userInfo.portfolioItems.length > 0 ? (
                <ul className="portfolio-list">
                  {userInfo.portfolioItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No portfolio items available</p>
              )}
            </div>
          )}

          <div className="user-info-group">
            <label>Social Media Links:</label>
            <p>{userInfo.socialMediaLinks || 'No social media links available'}</p>
          </div>

          <div className="user-info-group">
            <label>Role:</label>
            <p>{userInfo.role}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
