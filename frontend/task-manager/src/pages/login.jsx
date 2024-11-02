import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { loginUser } from '../api/auth';
import { FaRegEnvelope } from 'react-icons/fa';
import { RiLockLine } from "react-icons/ri";
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
    <div className="login-container">
      <div className="login-left-section">
        <img src="../back.png" alt="Background" className="login-background-image" /> 
        <img src="../Group-1.png" alt="Front" className="login-front-image" />
        <div className="login-welcome">
          <h1 className="login-welcome-text">Welcome aboard my friend</h1>
          <p className="login-text">Just a couple of clicks and we start</p>
        </div>
      </div>

      <div className="login-right-section">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="login-input-group">
            <FaRegEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-input-group">
            <RiLockLine className="icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="login-error-message">{error}</p>}

          <button type="submit" className="login-login-btn">Login</button>
        </form>

        <div className="login-register-section">
          <p>Have no account yet?</p>
          <Link to="/register" className="login-register-btn">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
