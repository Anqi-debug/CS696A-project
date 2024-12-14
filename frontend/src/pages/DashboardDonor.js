import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardDonor = () => {
  const navigate = useNavigate();

  const handleNavigateToProfile = () => {
    navigate('/public-profile'); // Navigate to the PublicProfile page when the button is clicked
  };

  return (
    <div>
      <div>
        <h1>Donor Dashboard</h1>
        <button onClick={handleNavigateToProfile}>Go to Public Profile</button>
      </div>
      <div>
        <p>Welcome to your dashboard. Here you can manage your donations and track progress.</p>
        {/* Additional donor-related content can go here */}
      </div>
    </div>
  );
};

export default DashboardDonor;
