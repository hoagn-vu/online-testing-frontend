import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BASE_URL;

const ApiService = {
  get: (url, config = {}) => axios.get(`${API_BASE_URL}${url}`, config),
  post: (url, data, config = {}) => axios.post(`${API_BASE_URL}${url}`, data, config),
  put: (url, data, config = {}) => axios.put(`${API_BASE_URL}${url}`, data, config),
  delete: (url, config = {}) => axios.delete(`${API_BASE_URL}${url}`, config),
};

export default ApiService;