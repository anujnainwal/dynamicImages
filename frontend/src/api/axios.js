import axios from "axios";

let axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  // baseURL: "http://44.206.234.148:5000/api/v1",
});
export default axiosInstance;
