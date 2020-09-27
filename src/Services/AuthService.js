import axios from "axios";

const register = (name, surname, email, password, role = null) => {
  return axios.post(process.env.REACT_APP_API_URL + "register", {
    name,
    surname,
    email,
    password,
    role
  });
};

const login = async (username, password) => {
  const response = await axios.post(process.env.REACT_APP_AUTH_URL, {
    username,
    password,
  });
  console.log(response);
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response;
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};
