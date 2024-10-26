import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Backend base URL

export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { name, email, password });
    return response.data; // Contains the JWT token or user info
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // Contains the JWT token or user info
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token'); // Remove token from localStorage
};

// Helper to set Authorization header
