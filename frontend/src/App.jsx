import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminHeader from './components/AdminHeader';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Admin Layout wrapper including header and central container
const AdminLayout = () => {
  return (
    <div className="admin-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminHeader />
      <main className="container" style={{ flex: 1, padding: '40px' }}>
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/listings" element={<div style={{ textAlign: 'left' }}><h2>Listings</h2><p>Manage listing items (Phase 4)...</p></div>} />
              <Route path="/admin/create-listing" element={<div style={{ textAlign: 'left' }}><h2>Create Listing</h2><p>Add new properties (Phase 4)...</p></div>} />
            </Route>
          </Route>

          {/* Root Redirects */}
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
