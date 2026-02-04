import axios from "axios";
const BASE_API_URL = import.meta.env.BASE_API_URL || "http://localhost:8000/user";

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});
export default axiosInstance;