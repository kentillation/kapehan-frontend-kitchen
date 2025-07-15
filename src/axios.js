import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    headers: {
        'Content-Type': process.env.VUE_APP_MIME_TYPE,
        'Accept': process.env.VUE_APP_MIME_TYPE
    },
    withCredentials: process.env.VUE_APP_WITH_CREDENTIALS
});

export default apiClient;
