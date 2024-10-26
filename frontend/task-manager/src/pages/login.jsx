import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';  // Import Link for navigation
import './login.css';
import {loginUser } from '../api/auth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple validation for demo
    if (email == '' || password == '') {
      setError('Invalid email or password');
    } else {
      setError('');
      alert('Logged in successfully!');
    }
  };

  return (
    <div className="container">
      {/* Left Section with Background */}
      <div className="left-section">
        <img src="../public/back.png" alt="Background Image" className="background-image" /> 
        <img src="../Group-1.png" alt="Front Image" className="front-image" />
        <div className="welcome">
          <h1 className="welcome-text">Welcome aboard my friend</h1>
          <p className="text">Just a couple of clicks and we start</p>
        </div>
      </div>

      {/* Right Section for Login */}
      <div className="right-section">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">Login</button>
        </form>

        <p className="register-text">
          Don't have an account? <Link to="/register" className="register-btn">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
