// frontend/PeopleApi.js
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = `${BASE_URL}/api/people`; // Update this to match your backend server's URL

// Function to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // Assumes token is stored in localStorage
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getPeople = async () => {
  try {
    const response = await axios.get(API_URL, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    console.error("Error fetching people:", error);
    throw error;
  }
};

export const addPerson = async (email) => {
  try {
    const response = await axios.post(
      API_URL,
      { email },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding person:", error);
    throw error;
  }
};
