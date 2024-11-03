import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './register.css';
import { registerUser } from '../api/auth';
import { FaRegUser, FaRegEnvelope } from 'react-icons/fa';
import { RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (name === '' || email === '' || password === '' || confirmPassword === '') {
      setError('All fields are required');
    } else if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      setError('');
      alert('Registered successfully!');
    }

    try {
      await registerUser(name, email, password);
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="container">
      <div className="left-section">
        <img src="../Back.png" alt="Background Image" className="background-image" />
        <img src="../Group-1.png" alt="Front Image" className="front-image" />
        <div className="welcome">
          <h1 className="welcome-text">Join us today!</h1>
          <p className="text">Create an account and get started!</p>
        </div>
      </div>

      <div className="right-section">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <FaRegUser className="icon" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <FaRegEnvelope className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
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

          <div className="input-group">
            <RiLockLine className="icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <RiEyeOffLine /> : <RiEyeLine />}
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="register-btn">Register</button>
        </form>

        <div className="login-section">
          <p>Have an account?</p>
          <Link to="/" className="login-btn">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
