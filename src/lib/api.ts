import axios from 'axios';

const api = axios.create({
    baseURL: `${process.env.INTERNAL_API_URL || 'http://localhost:8080'}`,
    timeout: 5000,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);
export default api;