import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <h1>Welcome, {user?.name}! 👋</h1>
        <p>Manage your rental properties, check booking statuses, and view occupancy analytics.</p>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <h2 className="stat-value">0</h2>
          <p className="stat-label">Total Accommodations</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-value">0</h2>
          <p className="stat-label">Active Reservations</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-value">$0</h2>
          <p className="stat-label">Total Earnings</p>
        </div>
      </div>

      {/* Activity Overview Placeholders */}
      <div className="dashboard-content-grid">
        <div className="dashboard-panel">
          <h3>Recent Reservations</h3>
          <div className="empty-state">
            <p>No reservations recorded yet.</p>
          </div>
        </div>
        <div className="dashboard-panel">
          <h3>Quick Actions</h3>
          <div className="actions-list">
            <button className="action-btn">View My Listings</button>
            <button className="action-btn primary-action">Add New Listing</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
