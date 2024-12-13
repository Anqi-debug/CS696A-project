import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApprovedProjects } from '../services/api';

const PublicProfile = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId'); // Fetch userId from local storage or global state

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
    <div>
      <h2>Approved Projects</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <h3>{project.campaignName}</h3>
            <p>Creator: {project.creatorId?.name || 'Unknown'}</p>
            <p>Goal: ${project.goalAmount}</p>
            {/* Pass donor userId to ProjectDetails */}
            <Link to={`/projects/${project._id}?donorId=${userId}`}>View Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PublicProfile;
