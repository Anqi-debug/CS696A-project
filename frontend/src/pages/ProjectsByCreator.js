import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../services/api';

const ProjectsByCreator = () => {
  const { creatorId } = useParams();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`/api/creator/${creatorId}/projects`);
        setProjects(response.data.projects);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch projects for the creator.');
      }
    };

    fetchProjects();
  }, [creatorId]);

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
            <h3>{project.campaignName}</h3>
            <p>{project.description}</p>
            <p>Goal Amount: ${project.goalAmount}</p>
            <p>Status: {project.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsByCreator;
