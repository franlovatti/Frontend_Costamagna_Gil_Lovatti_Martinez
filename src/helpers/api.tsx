import axios from "axios";

const apiAxios = axios.create({
  baseURL: "http://localhost:3000/api",
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
