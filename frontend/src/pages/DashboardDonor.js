import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DashboardDonor.css';

const DashboardDonor = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects/approved', {
          params: { sortBy: sortOption },
        });
        setProjects(response.data.projects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      }
    };

    fetchProjects();
  }, [sortOption]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const renderProjectsList = () => (
    <div className="projects-section">
      <div className="projects-header">
        <h2>Approved Projects</h2>
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="sort-dropdown"
        >
          <option value="">Sort By</option>
          <option value="campaignName">Project Name</option>
          <option value="creatorName">Creator Name</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {projects.length === 0 ? (
        <div className="empty-projects">No approved projects available.</div>
      ) : (
        <ul className="projects-list">
          {projects.map((project) => (
            <li key={project._id} className="project-item">
              <h3>{project.campaignName}</h3>
              <p>Creator: {project.creatorName}</p>
              <p>Status: {project.status}</p>
              <p>Goal Amount: ${project.goalAmount}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const handleNavigateToProjectList = () => {
    navigate('/projects/approvedProjectsList');
  };

  return (
    <div className="donor-dashboard">
      <div className="dashboard-header">
        <h1>Donor Dashboard</h1>
        <button 
          className="project-list"
          onClick={handleNavigateToProjectList}
        >
          Go to Projects List
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3 className="card-title">Recent Donations</h3>
          <div className="card-content">
            Track your recent contribution history
          </div>
        </div>

        
      </div>

      <div className="projects-section-container">
        {renderProjectsList()}
      </div>
    </div>
  );
};

export default DashboardDonor;