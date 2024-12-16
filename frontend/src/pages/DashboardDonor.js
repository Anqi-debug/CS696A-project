import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardDonor.css';

const DashboardDonor = () => {
  const navigate = useNavigate();
  const donorId = localStorage.getItem('userId'); 

  const handleNavigateToProjectList = () => {
    navigate('/projects/approvedProjectsList');
  };

  const handleNavigateToMyDonations = () => {
    if (donorId) {
      navigate(`/donations/donor/${donorId}/projects`);
    } else {
      alert('Donor ID is missing. Please log in again.');
    }
  };

  const handleNavigateToProfileEdit = () => {
    if (donorId) {
      navigate(`/users/${donorId}/portfolio`);
    } else {
      alert('User ID is missing. Please log in again.');
    }
  };

  return (
    <div className="donor-dashboard">
      <div className="dashboard-header">
        <h1>Donor Dashboard</h1>
      </div>

      <div className="dashboard-flex-container">
        <div
          className="dashboard-card"
          onClick={handleNavigateToMyDonations}
          style={{ cursor: 'pointer' }}
        >
          <h3 className="card-title">My Donations</h3>
          <div className="card-content">
            Track your contribution history
          </div>
        </div>

        <div
          className="dashboard-card"
          onClick={handleNavigateToProjectList}
          style={{ cursor: 'pointer' }}
        >
          <h3 className="card-title">Go to Projects List</h3>
          <div className="card-content">
            Track all active projects
          </div>
        </div>

        {/* New Profile Edit Tab */}
        <div
          className="dashboard-card"
          onClick={handleNavigateToProfileEdit}
          style={{ cursor: 'pointer' }}
        >
          <h3 className="card-title">Profile Edit</h3>
          <div className="card-content">
            Update your personal information and portfolio
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDonor;
