import axios from "axios";

console.log("BASE URL:", api.defaults.baseURL);
console.log(import.meta.env.VITE_API_URL);
const api = axios.create(
    {
        baseURL: import.meta.env.VITE_API_URL,
        timeout: 60000
    }
)


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        return {
            success: true,
            data: response.data.apiData,
            message: response.data.apiMessage
        };
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = "/giris-ve-kayit";
        }

        console.log(error.response?.data);
        return Promise.resolve({
            success: false,
            data: error.response?.data,
            message:
            error.response?.data.apiMessage
        });
    }
);

export default api;