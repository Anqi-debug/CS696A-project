import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import './DashboardAdmin.css';

const DashboardAdmin = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const [pendingFundraisers, setPendingFundraisers] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // "pending" or "all"

  // Fetch pending fundraisers
  useEffect(() => {
    const fetchPendingFundraisers = async () => {
      try {
        const response = await axios.get('/admin/pendingfundraisers');
        setPendingFundraisers(response.data.fundraisers);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch pending fundraisers');
      }
    };

    fetchPendingFundraisers();
  }, []);

  // Fetch all fundraisers
  useEffect(() => {
    const fetchAllFundraisers = async () => {
      try {
        const response = await axios.get('/admin/fundraisers');
        setFundraisers(response.data.projects);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch all fundraisers');
      }
    };

    fetchAllFundraisers();
  }, []);

  // Approve a fundraiser
  const approveFundraiser = async (projectId) => {
    try {
      const response = await axios.patch(`/admin/fundraisers/${projectId}/approve`);
      alert(response.data.message);
      setPendingFundraisers((prev) => prev.filter((fundraiser) => fundraiser._id !== projectId));
      setFundraisers((prev) =>
        prev.map((fundraiser) =>
          fundraiser._id === projectId ? { ...fundraiser, status: 'Approved' } : fundraiser
        )
      );
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
      setPendingFundraisers((prev) => prev.filter((fundraiser) => fundraiser._id !== projectId));
      setFundraisers((prev) =>
        prev.map((fundraiser) =>
          fundraiser._id === projectId ? { ...fundraiser, status: 'Rejected' } : fundraiser
        )
      );
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject fundraiser');
    }
  };

  return (
    <div className="dashboard-admin">
      <h1>Welcome to the Admin Dashboard!</h1>
      {error && <p className="error">{error}</p>}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Fundraiser Applications
        </button>
        <button
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Fundraisers
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'pending' ? (
        <div className="fundraisers-list">
          <h2>Pending Fundraiser Applications</h2>
          {pendingFundraisers.length === 0 ? (
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
                {pendingFundraisers.map((fundraiser) => (
                  <tr key={fundraiser._id}>
                    <td>{fundraiser.creatorName}</td>
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
      ) : (
        <div className="fundraisers-list">
          <h2>All Fundraisers</h2>
          {fundraisers.length === 0 ? (
            <p>No fundraisers available.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Creator Name</th>
                  <th>Campaign Title</th>
                  <th>Description</th>
                  <th>Goal Amount</th>
                  <th>Funds Raised</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {fundraisers.map((fundraiser) => (
                  <tr key={fundraiser._id}>
                    <td>{fundraiser.creatorName}</td>
                    <td>{fundraiser.campaignName}</td>
                    <td>{fundraiser.description}</td>
                    <td>${fundraiser.goalAmount}</td>
                    <td>${fundraiser.fundsRaised || 0}</td>
                    <td>{fundraiser.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
