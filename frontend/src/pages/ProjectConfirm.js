import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, updateProject, deleteProject } from '../services/api';

const ProjectConfirm = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [updates, setUpdates] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProjectById(projectId);
        setProject(response.data.project);
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
      setMessage('Project updated successfully.');
      setProject({ ...project, ...updates });
    } catch (err) {
      setError('Failed to update project.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProject(projectId);
      navigate('/projects/recurring-fundraiser'); // Redirect to the projects list page after deletion
    } catch (err) {
      setError('Failed to delete project.');
    }
  };

  return (
    <div>
      <h1>Project Confirmation</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {project ? (
        <div>
          <h2>{project.campaignName}</h2>
          <p>Creator: {project.creatorId?.name || 'Unknown'}</p>
          <p>Description: {project.description}</p>
          <p>Goal Amount: ${project.goalAmount}</p>
          <p>Status: {project.status}</p>
          <p>Funds Raised: ${project.fundsRaised || 0}</p>

          <h3>Update Project</h3>
          <input
            type="text"
            name="campaignName"
            placeholder="Campaign Name"
            defaultValue={project.campaignName}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Update description"
            defaultValue={project.description}
            onChange={handleChange}
          />
          <input
            type="number"
            name="goalAmount"
            placeholder="Goal Amount"
            defaultValue={project.goalAmount}
            onChange={handleChange}
          />
          <select
            name="status"
            defaultValue={project.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button onClick={handleUpdate}>Update Project</button>

          <h3>Delete Project</h3>
          <button
            style={{ backgroundColor: 'red', color: 'white' }}
            onClick={handleDelete}
          >
            Delete Project
          </button>
        </div>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
};

export default ProjectConfirm;