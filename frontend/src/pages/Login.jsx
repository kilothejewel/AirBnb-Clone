import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Custom client-side validation
  const validateForm = () => {
    if (isRegister && !name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card-header">
          {/* Logo icon representation */}
          <div className="logo-container">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ display: 'block', fill: '#FF385C', height: '40px', width: '40px' }}>
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415v.24c-.015 2.148-.751 4.02-2.235 5.342l-.233.2c-1.397 1.155-3.181 1.777-5.568 1.777-2.468 0-4.721-.86-6.861-2.61l-.226-.188c-.244-.207-.492-.413-.746-.62l-.747.62c-2.072 1.705-4.321 2.59-6.86 2.61a7.848 7.848 0 0 1-5.8-1.977c-1.484-1.322-2.22-3.194-2.236-5.342v-.24c.01-.924.253-1.805.92-3.396l.186-.45c.95-2.215 5.09-11.127 7.059-15.039l.534-1.025c1.288-2.306 2.743-3.269 4.752-3.269zm0 2.44c-1.09 0-1.88.544-2.678 1.97l-.544 1.05c-1.96 3.844-6.108 12.515-7.07 14.771l-.146.353c-.567 1.353-.755 2.016-.79 2.67l-.004.24v.2c.009 1.488.468 2.674 1.4 3.504.83.74 1.83 1.08 3.28 1.08 1.63 0 3.22-.61 4.97-1.92l.745-.62.746.62c1.75 1.31 3.34 1.92 4.97 1.92 1.45 0 2.45-.34 3.28-1.08 1.4-.83 1.88-2.016 1.4-3.504v-.24c-.035-.654-.223-1.317-.79-2.67l-.186-.45c-.96-2.256-5.11-10.927-7.07-14.771l-.544-1.05c-.798-1.426-1.588-1.97-2.678-1.97zm0 13.06a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 2.44a1.06 1.06 0 1 0 0 2.12 1.06 1.06 0 0 0 0-2.12z" />
            </svg>
          </div>
          <h1>{isRegister ? 'Create an Account' : 'Welcome Back'}</h1>
          <p className="login-subtitle">
            {isRegister ? 'Join our Airbnb clone community' : 'Sign in to access your dashboard'}
          </p>
        </div>

        {error && <div className="login-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit-btn"
            disabled={loading}
          >
            {loading ? 'Processing...' : isRegister ? 'Register' : 'Log In'}
          </button>
        </form>

        <div className="login-card-footer">
          <p>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              className="toggle-auth-btn"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              disabled={loading}
            >
              {isRegister ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
