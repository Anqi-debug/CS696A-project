import React, { useState, useEffect } from 'react';
import axios from '../services/api';

const DashboardAdmin = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const [error, setError] = useState('');

  // Fetch pending fundraisers
  useEffect(() => {
    const fetchFundraisers = async () => {
      try {
        const response = await axios.get('/admin/fundraisers');
        setFundraisers(response.data.fundraisers);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch fundraisers');
      }
    };

    fetchFundraisers();
  }, []);

  // Approve a fundraiser
  const approveFundraiser = async (projectId) => {
    try {
      const response = await axios.patch(`/admin/fundraisers/${projectId}/approve`);
      alert(response.data.message);
      setFundraisers(fundraisers.filter((fundraiser) => fundraiser._id !== projectId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve fundraiser');
    }
  };

  // Reject a fundraiser
  const rejectFundraiser = async (projectId) => {
    const rejectionReason = prompt('Enter the reason for rejection:');
    if (!rejectionReason) return;

    try {
      const response = await axios.patch(`/admin/fundraisers/${projectId}/reject`, { rejectionReason });
      alert(response.data.message);
      setFundraisers(fundraisers.filter((fundraiser) => fundraiser._id !== projectId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject fundraiser');
    }
  };

  return (
    <div className="dashboard-admin">
      <h1>Welcome to the Admin Dashboard!</h1>
      {error && <p className="error">{error}</p>}
      <div className="fundraisers-list">
        <h2>Pending Fundraiser Applications</h2>
        {fundraisers.length === 0 ? (
          <p>No pending fundraisers.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Creator Name</th>
                <th>Campaign Title</th>
                <th>Description</th>
                <th>Goal Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fundraisers.map((fundraiser) => (
                <tr key={fundraiser._id}>
                  <td>{fundraiser.creatorId.name}</td>
                  <td>{fundraiser.campaignName}</td>
                  <td>{fundraiser.description}</td>
                  <td>${fundraiser.goalAmount}</td>
                  <td>
                    <button onClick={() => approveFundraiser(fundraiser._id)}>Approve</button>
                    <button onClick={() => rejectFundraiser(fundraiser._id)}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardAdmin;
