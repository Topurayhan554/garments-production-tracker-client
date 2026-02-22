import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "https://garments-production-tracker-server.vercel.app",
});

export default axiosSecure;
