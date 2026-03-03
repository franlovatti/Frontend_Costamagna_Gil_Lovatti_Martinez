import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const apiAxios = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true // <-- Esto hace que todas las peticiones envíen cookies automáticamente
});

apiAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})

export default apiAxios;
