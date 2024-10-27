import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { loginUser } from '../api/auth';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      // Call the login API function and store token on success
      const responseData = await loginUser(email, password);

      // Redirect to dashboard or another secure route after successful login
      navigate('/dashboard'); // Adjust '/dashboard' to the route you need
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="container">
      <div className="left-section">
        <img src="../public/back.png" alt="Background" className="background-image" /> 
        <img src="../Group-1.png" alt="Front" className="front-image" />
        <div className="welcome">
          <h1 className="welcome-text">Welcome aboard my friend</h1>
          <p className="text">Just a couple of clicks and we start</p>
        </div>
      </div>

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
