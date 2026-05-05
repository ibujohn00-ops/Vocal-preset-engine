import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Upload API
export const uploadAPI = {
  uploadAudio: (file: File) => {
    const formData = new FormData();
    formData.append('audio', file);
    return api.post('/upload/audio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadPreset: (file: File) => {
    const formData = new FormData();
    formData.append('preset', file);
    return api.post('/upload/preset', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Process API
export const processAPI = {
  processStandard: (audioPath: string, presetId: string, presetData: any) =>
    api.post('/process/standard', { audioPath, presetId, presetData }),
  processRemix: (audioPath: string, presetId: string, presetData: any) =>
    api.post('/process/remix', { audioPath, presetId, presetData }),
  getStatus: (jobId: string) => api.get(`/process/status/${jobId}`),
};

// Presets API
export const presetsAPI = {
  listPresets: () => api.get('/presets'),
  getPreset: (id: string) => api.get(`/presets/${id}`),
  savePreset: (data: any) => api.post('/presets', data),
  updatePreset: (id: string, data: any) => api.put(`/presets/${id}`, data),
  deletePreset: (id: string) => api.delete(`/presets/${id}`),
  sharePreset: (id: string) => api.post(`/presets/${id}/share`),
};

// Download API
export const downloadAPI = {
  downloadAudio: (jobId: string) => api.get(`/download/${jobId}`),
  downloadPreset: (jobId: string) => api.get(`/download/${jobId}/preset`),
};

export default api;
