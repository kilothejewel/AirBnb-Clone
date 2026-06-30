import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, api } from '../context/AuthContext';
import './Listings.css';

const Listings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all listings and filter by current user (host)
  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/accommodations');
      // Filter list to only show listings owned by the logged-in user
      const myListings = data.filter((item) => {
        const ownerId = item.owner?._id || item.owner;
        return ownerId === user?._id;
      });
      setListings(myListings);
    } catch (err) {
      setError('Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [user]);

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      await api.delete(`/accommodations/${id}`);
      setListings(listings.filter((item) => item._id !== id));
      alert('Listing deleted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing.');
    }
  };

  if (loading) return <div className="loading-state">Loading your listings...</div>;

  return (
    <div className="admin-listings-page">
      <div className="listings-header">
        <div>
          <h1>My Listings</h1>
          <p>Manage all your rental properties and details</p>
        </div>
        <Link to="/admin/create-listing" className="btn btn-primary">
          + Add New Listing
        </Link>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {listings.length === 0 ? (
        <div className="empty-listings">
          <h2>No Listings Found</h2>
          <p>Get started by adding your first accommodation listing.</p>
          <Link to="/admin/create-listing" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Add Listing
          </Link>
        </div>
      ) : (
        <div className="listings-grid">
          {listings.map((item) => (
            <div key={item._id} className="listing-card-admin">
              <div className="listing-image-wrapper">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80'}
                  alt={item.name}
                  className="listing-image"
                />
                <span className="listing-type-badge">{item.type}</span>
              </div>
              <div className="listing-details">
                <h3>{item.name}</h3>
                <p className="listing-location">{item.location}</p>
                <div className="listing-meta">
                  <span className="listing-price">${item.price} <span className="price-unit">/ night</span></span>
                  <span className="listing-rating">★ {item.rating}</span>
                </div>
                <div className="listing-actions">
                  <Link to={`/admin/update-listing/${item._id}`} className="btn btn-outline edit-btn">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(item._id)} className="btn btn-outline delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Listings;
