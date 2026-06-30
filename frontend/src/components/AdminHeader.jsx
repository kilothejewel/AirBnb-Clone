import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminHeader.css';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="admin-header">
      <div className="admin-header-container">
        {/* Logo */}
        <Link to="/admin/dashboard" className="admin-logo">
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ display: 'block', fill: '#FF385C', height: '32px', width: '32px' }}>
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415v.24c-.015 2.148-.751 4.02-2.235 5.342l-.233.2c-1.397 1.155-3.181 1.777-5.568 1.777-2.468 0-4.721-.86-6.861-2.61l-.226-.188c-.244-.207-.492-.413-.746-.62l-.747.62c-2.072 1.705-4.321 2.59-6.86 2.61a7.848 7.848 0 0 1-5.8-1.977c-1.484-1.322-2.22-3.194-2.236-5.342v-.24c.01-.924.253-1.805.92-3.396l.186-.45c.95-2.215 5.09-11.127 7.059-15.039l.534-1.025c1.288-2.306 2.743-3.269 4.752-3.269zm0 2.44c-1.09 0-1.88.544-2.678 1.97l-.544 1.05c-1.96 3.844-6.108 12.515-7.07 14.771l-.146.353c-.567 1.353-.755 2.016-.79 2.67l-.004.24v.2c.009 1.488.468 2.674 1.4 3.504.83.74 1.83 1.08 3.28 1.08 1.63 0 3.22-.61 4.97-1.92l.745-.62.746.62c1.75 1.31 3.34 1.92 4.97 1.92 1.45 0 2.45-.34 3.28-1.08 1.4-.83 1.88-2.016 1.4-3.504v-.24c-.035-.654-.223-1.317-.79-2.67l-.186-.45c-.96-2.256-5.11-10.927-7.07-14.771l-.544-1.05c-.798-1.426-1.588-1.97-2.678-1.97zm0 13.06a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 2.44a1.06 1.06 0 1 0 0 2.12 1.06 1.06 0 0 0 0-2.12z" />
          </svg>
          <span className="admin-logo-text">airbnb <span className="logo-badge">admin</span></span>
        </Link>

        {/* Navigation */}
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/listings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Listings
          </NavLink>
          <NavLink to="/admin/create-listing" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Create Listing
          </NavLink>
        </nav>

        {/* Profile Menu Dropdown */}
        <div className="admin-user-menu">
          <button className="user-menu-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="avatar">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
          </button>

          {dropdownOpen && (
            <>
              <div className="dropdown-backdrop" onClick={() => setDropdownOpen(false)}></div>
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <p className="user-name">{user?.name}</p>
                  <p className="user-email">{user?.email}</p>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/admin/listings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  My Listings
                </Link>
                <Link to="/admin/create-listing" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  Add New Listing
                </Link>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
