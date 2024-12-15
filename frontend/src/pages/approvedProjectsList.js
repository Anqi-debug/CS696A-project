import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApprovedProjects } from '../services/api';
import './approvedProjectsList-styles.css';

const ApprovedProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchApprovedProjects = async () => {
      try {
        const response = await getApprovedProjects();
        setProjects(response.data.projects);
      } catch (err) {
        setError('Failed to fetch approved projects');
      }
    };
    fetchApprovedProjects();
  }, []);

  return (
    <div className="public-profile-container">
      <div className="profile-header">
        <h2>Approved Projects</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <ul className="projects-grid">
        {projects.map((project) => {
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
