import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});

export default axiosSecure;
