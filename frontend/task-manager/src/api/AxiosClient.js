import axios from "axios";
import queryString from "query-string";

// const baseUrl = import.meta.env.VITE_APP_BASE_URL;
const API_URL = 'http://localhost:5000/api/';
const getToken = () => localStorage.getItem("token");
const axiosClient = axios.create({
  baseURL: API_URL,
  paramsSerializer: (params) => queryString.stringify({ params }),
});

axiosClient.interceptors.request.use(async (config) => {
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      token: getToken(),
    },
  };
});
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  (err) => {
    if (!err.response) {
      return console.log(err);
    }
    throw err.response;
  }
);

export default axiosClient;