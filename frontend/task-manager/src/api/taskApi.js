import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks'; // Update to your backend server's URL

// Function to get Authorization Headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // Assumes token is stored in localStorage
  return token ? { Authorization: `Bearer ${token}` } : {};
};




// Fetch all tasks
export const fetchTasks = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders(), // Attach the auth headers
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Save a new task
export const saveTask = async (task) => {
  try {
    const response = await axios.post(API_URL, task, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saving task:", error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (_id, updatedTask) => {
  try {
    const response = await axios.put(`${API_URL}/${_id}`, updatedTask, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (_id) => {
  try {
    await axios.delete(`${API_URL}/${_id}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};




