import axios from 'axios';

// All admin requests go through the Vite dev-server proxy (/api -> backend)
// so the browser sees a single origin and avoids CORS/cookie headaches.
export const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sg_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('sg_token');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('sg_token')}` } });

// Build a fully-resolved media URL (images are served under /api/media via proxy)
export const assetUrl = (url?: string | null) => (url ? (url.startsWith('http') ? url : url) : '');
