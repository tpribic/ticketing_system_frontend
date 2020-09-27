import axios from "axios";
import authHeader from "./AuthHeader";

const getPublicContent = () => {
  return axios.get(process.env.REACT_APP_API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(process.env.REACT_APP_API_URL + "dashboard/user", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(process.env.REACT_APP_API_URL + "dashboard/employee", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(process.env.REACT_APP_API_URL + "dashboard/admin", { headers: authHeader() });
};

export default {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};