import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (phone, password) => {
    const res = await api.post('/auth/login', { phone, password });
    if (res.data.token) {
        localStorage.setItem('token', res.data.token);
    }
    return res.data;
};

export const register = async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
};

export const getWorkerDashboard = async () => {
    const res = await api.get('/workers/dashboard');
    return res.data;
};

export const getAdminOverview = async () => {
    const res = await api.get('/admin/overview');
    return res.data;
};

export const getAdminClaims = async () => {
    const res = await api.get('/claims');
    return res.data;
};

export const manualTrigger = async (data) => {
    const res = await api.post('/claims/trigger', data);
    return res.data;
};

export const reviewClaim = async (id, action) => {
    const res = await api.post(`/claims/${id}/action`, { action });
    return res.data;
};

export const createPolicy = async (data) => {
    const res = await api.post('/policies/create', data);
    return res.data;
};

export const renewPolicy = async () => {
    const res = await api.post('/policies/renew');
    return res.data;
};

export default api;
