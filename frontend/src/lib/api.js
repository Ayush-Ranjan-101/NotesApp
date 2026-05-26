import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login    = (data) => api.post('/auth/login', data);
export const logout   = ()     => api.post('/auth/logout');
export const updateProfile = (formData) => api.put('/auth/profile', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteProfile = () => api.delete('/auth/profile');

// Notes
export const getNotes    = ()           => api.get('/notes');
export const createNote  = (data)       => api.post('/notes', data);
export const updateNote  = (id, data)   => api.patch(`/notes/${id}`, data);
export const deleteNote  = (id)         => api.delete(`/notes/${id}`);

export default api;
