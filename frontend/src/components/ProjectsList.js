import React, { useEffect, useState } from 'react';
import { getAllProjects, deleteProject } from '../services/api';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getAllProjects();
        setProjects(response.data.projects);
      } catch (err) {
        setError('Failed to fetch projects');
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjects(projects.filter((project) => project._id !== projectId));
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  return (
    <div>
      <h2>All Projects</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <h3>{project.campaignName}</h3>
            <p>Creator: {project.creatorId.name}</p>
            <p>Goal: ${project.goalAmount}</p>
            <button onClick={() => handleDelete(project._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsList;
