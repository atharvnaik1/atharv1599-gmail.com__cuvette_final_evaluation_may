import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { loginUser } from '../api/auth';
import { FaRegEnvelope } from 'react-icons/fa';
import { RiLockLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { ClipLoader } from 'react-spinners'; // Import the loader component

function LoginPage() {
  const [email, setEmail] = useState('new3@gmail.com');
  const [password, setPassword] = useState('123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading indicator
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true); // Show the loader when login starts

    try {
      const responseData = await loginUser(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false); // Hide the loader once login is complete
    }
  };

  return (
    <div className="login-container">
      <div className="login-left-section">
        <img src="../Back.png" alt="Background" className="login-background-image" />
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
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
            </button>
          </div>

          {error && <p className="login-error-message">{error}</p>}

          <button type="submit" className="login-login-btn" disabled={loading}>
            {loading ? <ClipLoader size={20} color="#fff" /> : "Login"}
          </button>
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
