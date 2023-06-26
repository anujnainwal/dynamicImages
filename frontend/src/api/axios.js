import axios from "axios";

let axiosInstance = axios.create({
  // baseURL: "http://localhost:5000/api/v1",
  baseURL: "http://13.234.238.121:5000/api/v1",
});
export default axiosInstance;
