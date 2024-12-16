import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from '../services/api';

const ProjectsByCreator = () => {
  const { creatorId } = useParams();
  const navigate = useNavigate(); // Initialize navigate hook
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`/projects/creator/${creatorId}`);
        setProjects(response.data.projects);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch projects for the creator.');
      }
    };

    fetchProjects();
  }, [creatorId]);

  const handleNavigateToConfirm = (projectId) => {
    navigate(`/project-confirm/${projectId}`); // Navigate to ProjectConfirm page with projectId
  };

  const handleBackToHome = () => {
    navigate(`/dashboard-creator/${creatorId}`); // Navigate to DashboardCreator with creatorId
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!projects.length) {
    return <p>No projects found for this creator.</p>;
  }

  return (
    <div>
      <h2>Projects by Creator</h2>
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <h3
              style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => handleNavigateToConfirm(project._id)}
            >
              {project.campaignName}
            </h3>
            <p>{project.description}</p>
            <p>Goal Amount: ${project.goalAmount}</p>
            <p>Status: {project.status}</p>
          </li>
        ))}
      </ul>
      <button
        onClick={handleBackToHome}
        style={{
          marginTop: '20px',
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
    </div>
  );
};

export default ProjectsByCreator;
