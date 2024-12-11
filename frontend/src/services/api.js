import axios from 'axios';

// Base Axios Instance
const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Multipart Axios Instance
const multipartInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Projects API
export const createRecurringFundraiser = (data) =>
  multipartInstance.post('/projects/recurring-fundraiser', data); // Use multipart instance for file uploads
export const getAllProjects = () => instance.get('/projects');
export const getProjectById = (projectId) => instance.get(`/projects/${projectId}`);
export const updateProject = (projectId, updates) => instance.put(`/projects/${projectId}`, updates);
export const deleteProject = (projectId) => instance.delete(`/projects/${projectId}`);

export default instance;

