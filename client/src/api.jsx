import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Replace with backend API URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;