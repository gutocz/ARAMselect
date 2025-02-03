import axios from 'axios';

const api = axios.create({
    baseURL: 'https://aramselect.onrender.com/', // URL do backend
});

export default api;
