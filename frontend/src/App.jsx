import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminHeader from './components/AdminHeader';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Listings from './pages/Listings';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Home from './pages/Home';
import Locations from './pages/Locations';
import ListingDetails from './pages/ListingDetails';

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
              <Route path="/admin/listings" element={<Listings />} />
              <Route path="/admin/create-listing" element={<CreateListing />} />
              <Route path="/admin/update-listing/:id" element={<UpdateListing />} />
            </Route>
          </Route>

          {/* Public Frontend Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/listings/:id" element={<ListingDetails />} />

          {/* Root Redirects */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
