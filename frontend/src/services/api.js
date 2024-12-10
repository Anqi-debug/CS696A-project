import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Projects API
export const createRecurringFundraiser = (data) => instance.post('/projects/recurring-fundraiser', data);
export const getAllProjects = () => instance.get('/projects');
export const getProjectById = (projectId) => instance.get(`/projects/${projectId}`);
export const updateProject = (projectId, updates) => instance.put(`/projects/${projectId}`, updates);
export const deleteProject = (projectId) => instance.delete(`/projects/${projectId}`);

export default instance;
