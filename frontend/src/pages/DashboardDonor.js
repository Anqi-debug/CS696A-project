import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardDonor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to PublicProfile page after login
    navigate('/public-profile');
  }, [navigate]);

  return null; // No UI is rendered as this is purely for redirection
};

export default DashboardDonor;
