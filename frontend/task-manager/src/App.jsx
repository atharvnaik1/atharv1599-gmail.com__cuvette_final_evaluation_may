import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login';  // Import LoginPage component
import RegisterPage from './pages/register';  // Import RegisterPage component
import Dashboard from './pages/Dashboard';
import './App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Define routes for login and register */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
           <Route path="/d" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
