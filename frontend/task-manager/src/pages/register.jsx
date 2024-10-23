import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';  // Import Link for navigation
import './register.css';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    // Basic validation for name, email, and password
    if (name === '' || email === '' || password === '' || confirmPassword === '') {
      setError('All fields are required');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
      alert('Registered successfully!');
    }
  };

  return (
    <div className="container">
      {/* Left Section with Background */}
      <div className="left-section">
        <img src="../public/back.png" alt="Background Image" className="background-image" /> 
        <img src="../Group-1.png" alt="Front Image" className="front-image" />
        <div className="welcome">
          <h1 className="welcome-text">Join us today!</h1>
          <p className="text">Create an account and get started!</p>
        </div>
      </div>

      {/* Right Section for Registration */}
      <div className="right-section">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          {/* Name Input */}
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
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

          {/* Password Input */}
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

          {/* Confirm Password Input */}
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="register-btn">Register</button>
        </form>

        <p className="login-text">
          Already have an account? <Link to="/login" className="login-btn">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
