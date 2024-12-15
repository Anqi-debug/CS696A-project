import React, { useEffect, useState } from 'react';
import { getAllProjects, deleteProject } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './ProjectsList.css';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    <div className="projects-container">
      <div className="projects-header">
        <h2>All Projects</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      {projects.length === 0 ? (
        <div className="empty-state">No projects found.</div>
      ) : (
        <ul className="projects-grid">
          {projects.map((project) => (
            <li key={project._id} className="project-card">
              <div className="card-content">
                <h3 className="project-title">{project.campaignName}</h3>
                <div className="project-creator">
                  <span>Created by {project.creatorId.name}</span>
                </div>
                <div className="project-goal">
                  Goal: ${project.goalAmount.toLocaleString()}
                </div>
              </div>
              <div className="card-actions">
                <button 
                  onClick={() => handleDelete(project._id)}
                  className="delete-button"
                >
                  Delete Project
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectsList;