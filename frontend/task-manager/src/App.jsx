import React, { lazy, Suspense, useEffect,useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login';  // Import LoginPage component
import RegisterPage from './pages/register';  // Import RegisterPage component
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import './App.css';
import AnalyticsPage from './pages/Analytics';
import SettingsPage from './pages/SettingsPage';
const AppLayout = lazy(() => import("./AppContext/AppLayout")); 

function App() {
  const [tasks, setTasks] = useState([]);

  return (
    <Router>
      <div className="App">
      <Sidebar />
        <Routes>
          {/* Define routes for login and register */}
          <Route path="/" element={<LoginPage />} />
          {/* <Route path="/*" element={<AppLayout />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<AnalyticsPage tasks={tasks} />} />
          <Route path="/settings" element={<SettingsPage/>} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
