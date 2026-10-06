import axios from "axios";

const api = axios.create({
  baseURL: "https://store-rating-platform-u2ai.onrender.com/api",
});

export default api;