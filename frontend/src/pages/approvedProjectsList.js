import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { getApprovedProjects } from '../services/api';
import './approvedProjectsList-styles.css';

const ApprovedProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filterOption, setFilterOption] = useState(''); // Track the selected filter option
  const [searchTerm, setSearchTerm] = useState(''); // Track the input value
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch approved projects on component load
  useEffect(() => {
    const fetchApprovedProjects = async () => {
      try {
        const response = await getApprovedProjects();
        setProjects(response.data.projects);
        setFilteredProjects(response.data.projects); // Initialize filteredProjects
      } catch (err) {
        setError('Failed to fetch approved projects');
      }
    };
    fetchApprovedProjects();
  }, []);

  // Filter projects dynamically
  useEffect(() => {
    if (filterOption && searchTerm) {
      const filtered = projects.filter((project) => {
        if (filterOption === 'campaignName') {
          return project.campaignName.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (filterOption === 'creatorName') {
          return (project.creatorName || '')
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        }
        return true;
      });
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects); // Reset to all projects if no filter or search term
    }
  }, [filterOption, searchTerm, projects]);

  const handleBackToHome = () => {
    navigate(`/dashboard-donor/${userId}`); // Navigate to DashboardDonor with userId
  };

  return (
    <div className="public-profile-container">
      <div className="profile-header">
        <h2>Projects</h2>
      </div>

      {/* Back to Home Button */}
      <button
        onClick={handleBackToHome}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Back to My Home Page
      </button>

      {/* Filter Options */}
      <div className="filter-container">
        <label htmlFor="filterOption" className="filter-label">
          Filter By:
        </label>
        <select
          id="filterOption"
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="filter-select"
        >
          <option value="">Select</option>
          <option value="campaignName">Campaign Name</option>
          <option value="creatorName">Creator Name</option>
        </select>

        {filterOption && (
          <input
            type="text"
            placeholder={`Search by ${filterOption === 'campaignName' ? 'Campaign Name' : 'Creator Name'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <ul className="projects-grid">
        {filteredProjects.map((project) => {
          const isFundingComplete = project.totalRaised >= project.goalAmount;

          return (
            <li
              key={project._id}
              className={`project-card ${isFundingComplete ? 'project-completed' : ''}`}
            >
              <h3>{project.campaignName}</h3>
              <div className="project-info">
                <div className="creator-name">
                  <span>Created by {project.creatorName || 'Unknown'}</span>
                </div>
                <div className="goal-amount">
                  Goal: ${project.goalAmount.toLocaleString()}
                </div>
                <div className="project-description">
                  {project.description}
                </div>
              </div>
              {isFundingComplete ? (
                <div className="view-details-disabled">Funding Complete</div>
              ) : (
                <Link
                  to={`/projects/${project._id}?donorId=${userId}`}
                  className="view-details-link"
                >
                  View Details
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ApprovedProjectsList;
