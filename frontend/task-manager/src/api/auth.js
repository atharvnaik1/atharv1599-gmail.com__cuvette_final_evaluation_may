import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = `${BASE_URL}/api/auth`; // Backend base URL

// Register a new user
export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { name, email, password });
    return response.data; // Assuming it returns a token or user info
  } catch (error) {
    console.error("Error registering user:", error);
    throw error.response?.data?.message || "Registration failed. Please try again.";
  }
};

// Login an existing user
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token } = response.data;

    // Store the token and set authorization header for future requests
    if (token) {
      localStorage.setItem('token', token);
      setAuthToken(token); // Apply the token globally to axios
    }
    return response.data; // Return data to handle in UI if needed
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error.response?.data?.message || "Login failed. Please check your credentials.";
  }
};
export const updatePassword = async ({ name, oldPassword, newPassword, email }) => {
  try {
    const response = await fetch(`${API_URL}/update-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ name, oldPassword, newPassword, email }), // Include 'email'
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update');
    }

    return data;
  } catch (error) {
    console.error('Update Password API error:', error);
    throw error;
  }
};

// Logout the user
export const logoutUser = () => {
  localStorage.removeItem('token'); // Remove token from localStorage
  setAuthToken(null); // Remove token from axios headers
};

// Helper to set Authorization header globally
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Check for token in localStorage on app load
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // Assumes token is stored in localStorage
  return token ? { Authorization: `Bearer ${token}` } : {};
};


// export const verifyToken = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/verify-token`, {
//       headers: getAuthHeaders()
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error verifying token:", error);
//     throw error.response?.data?.message || "Token verification failed. Please login again.";
//   }
// };

