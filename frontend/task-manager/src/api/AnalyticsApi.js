import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const ANALYTICS_API_URL = `${BASE_URL}/api/tasks/analytics`// Update to your backend server's URL

// Function to get Authorization Headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // Assumes token is stored in localStorage
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch analytics data (status and priority distributions)
export const fetchAnalytics = async () => {
  try {
    const response = await axios.get(ANALYTICS_API_URL, {
      headers: getAuthHeaders(), // Attach the auth headers
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
};
