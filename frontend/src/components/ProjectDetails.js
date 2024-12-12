import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectById, updateProject } from '../services/api';

const ProjectDetails = () => {
  const { id: projectId } = useParams(); // Retrieve project ID from URL
  const [project, setProject] = useState(null);
  const [updates, setUpdates] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProjectById(projectId);
        setProject(response.data);
      } catch (err) {
        setError('Failed to fetch project details.');
      }
    };

    fetchProject();
  }, [projectId]);

  const handleChange = (e) => {
    setUpdates({ ...updates, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await updateProject(projectId, updates);
      setMessage(response.data.message);
      setProject({ ...project, ...updates });
    } catch (err) {
      setError('Failed to update project details.');
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {project ? (
        <div>
          <h2>{project.campaignName}</h2>
          <p>Creator: {project.creatorId?.name || 'Unknown'}</p>
          <p>Description: {project.description}</p>
          <p>Goal Amount: ${project.goalAmount}</p>
          <p>Status: {project.status}</p>
          <textarea
            name="description"
            placeholder="Update description"
            defaultValue={project.description}
            onChange={handleChange}
          />
          <button onClick={handleUpdate}>Update</button>
        </div>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
};

export default ProjectDetails;
