import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../services/api';
//import './EditProfile.css';

const EditProfile = () => {
  const { userId } = useParams(); // Get userId from the URL params
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    bio: '',
    portfolioItems: [],
    socialMediaLinks: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('User ID:', userId);
        const response = await axios.get(`/users/${userId}/portfolio`);
        console.log('User ID:', userId);
        const { bio, portfolioItems, socialMediaLinks } = response.data.user;
        setProfile({ bio, portfolioItems, socialMediaLinks });
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch profile data.');
      }
    };

    fetchProfile();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePortfolioChange = (index, value) => {
    const updatedPortfolio = [...profile.portfolioItems];
    updatedPortfolio[index] = value;
    setProfile({ ...profile, portfolioItems: updatedPortfolio });
  };

  const addPortfolioItem = () => {
    setProfile({ ...profile, portfolioItems: [...profile.portfolioItems, ''] });
  };

  const removePortfolioItem = (index) => {
    const updatedPortfolio = profile.portfolioItems.filter((_, i) => i !== index);
    setProfile({ ...profile, portfolioItems: updatedPortfolio });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/users/${userId}/portfolio`, profile);
      setSuccess(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update portfolio.');
      setSuccess('');
    }
  };

  const handleBackToDashboard = () => {
    navigate(`/dashboard-creator/${userId}`);
  };

  return (
    <div className="edit-profile-container">
      <h1>Edit Profile</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleFormSubmit} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleInputChange}
            placeholder="Write about yourself..."
          />
        </div>

        <div className="form-group">
          <label>Portfolio Items</label>
          {profile.portfolioItems.map((item, index) => (
            <div key={index} className="portfolio-item">
              <input
                type="text"
                value={item}
                onChange={(e) => handlePortfolioChange(index, e.target.value)}
                placeholder={`Portfolio item ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removePortfolioItem(index)}
                className="remove-item-btn"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPortfolioItem}
            className="add-item-btn"
          >
            Add Portfolio Item
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="socialMediaLinks">Social Media Links</label>
          <input
            type="text"
            id="socialMediaLinks"
            name="socialMediaLinks"
            value={profile.socialMediaLinks}
            onChange={handleInputChange}
            placeholder="Add your social media links..."
          />
        </div>

        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </form>

      <button onClick={handleBackToDashboard} className="back-btn">
        Back to Dashboard
      </button>
    </div>
  );
};

export default EditProfile;
