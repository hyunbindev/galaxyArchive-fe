import axios from 'axios';

const api = axios.create({
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);
export default api;