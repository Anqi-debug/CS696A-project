import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import axios from '../services/api';
import './DonorProjects.css';

const DonorProjects = () => {
  const { donorId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonorProjects = async () => {
      try {
        const response = await axios.get(`/donations/donor/${donorId}/projects`);
        setProjects(response.data.projects || []); // Ensure projects is always an array
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch donor projects.');
        setLoading(false);
      }
    };

    fetchDonorProjects();
  }, [donorId]);

  const handleBackToMyPage = () => {
    navigate(`/dashboard-donor/${donorId}`); // Navigate back to donor dashboard
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`); // Navigate to the project details page
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="donor-projects-container">
      <div className="header">
        <h1>Projects You've Donated To</h1>
        <button
          onClick={handleBackToMyPage}
          className="back-button"
        >
          Back to My Page
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-message">You haven't donated to any projects yet.</div>
      ) : (
        <ul className="projects-list">
          {projects.map((project, index) => (
            project && ( // Null-check to ensure project exists
              <li
                key={index}
                className="project-card"
                onClick={() => handleProjectClick(project._id)} // Add click handler
                style={{ cursor: 'pointer' }} // Indicate the card is clickable
              >
                <h2>{project.campaignName || 'Unnamed Project'}</h2>
                <p><strong>Created By:</strong> {project.creatorName || 'Unknown'}</p>
                <p><strong>Description:</strong> {project.description || 'No description available'}</p>
                <p><strong>Goal Amount:</strong> ${project.goalAmount || 'N/A'}</p>
                <p><strong>Status:</strong> {project.status || 'Unknown'}</p>
              </li>
            )
          ))}
        </ul>
      )}
    </div>
  );
};

export default DonorProjects;
