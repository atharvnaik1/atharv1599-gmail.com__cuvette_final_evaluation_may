import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { ClipLoader } from 'react-spinners';

import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import Dashboard from './pages/Dashboard';
import AnalyticsPage from './pages/Analytics';
import SettingsPage from './pages/SettingsPage';
import PublicTaskView from './components/PublicTaskView';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); 
  const isAuthenticated = !!localStorage.getItem('token'); 

  useEffect(() => {
    const loadApp = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };
    loadApp();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/tasks/:taskId" element={<PublicTaskView />} />

         
          {isAuthenticated &&  (
            <>
              <Route path="/dashboard" element={<Dashboard tasks={tasks} setTasks={setTasks} />} />
              <Route path="/analytics" element={<AnalyticsPage tasks={tasks} />} />
              <Route path="/settings" element={<SettingsPage />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
