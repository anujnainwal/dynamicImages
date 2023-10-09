import axios from "axios";

let axiosInstance = axios.create({
  // baseURL: "http://localhost:5000/api/v1",
  baseURL: "http://16.171.3.157:5000/api/v1",
  timeout: 50000,
});
export default axiosInstance;
