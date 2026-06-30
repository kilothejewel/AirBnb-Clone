import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';
import './Locations.css';

const Locations = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter States
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('Any');

  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameters (e.g., ?search=Cape+Town)
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';

  // Fetch data
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/accommodations');
        setAccommodations(data);
      } catch (err) {
        setError('Failed to retrieve accommodations. Please reload.');
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodations();
  }, []);

  // Filter Logic
  useEffect(() => {
    let listings = [...accommodations];

    // 1. Filter by search query (Location name)
    if (searchQuery) {
      listings = listings.filter((item) =>
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2. Filter by property type
    if (selectedType !== 'All') {
      listings = listings.filter((item) => item.type === selectedType);
    }

    // 3. Filter by price range
    if (selectedPriceRange !== 'Any') {
      if (selectedPriceRange === 'under100') {
        listings = listings.filter((item) => item.price < 100);
      } else if (selectedPriceRange === '100to200') {
        listings = listings.filter((item) => item.price >= 100 && item.price <= 200);
      } else if (selectedPriceRange === 'over200') {
        listings = listings.filter((item) => item.price > 200);
      }
    }

    setFilteredListings(listings);
  }, [accommodations, searchQuery, selectedType, selectedPriceRange]);

  if (loading) return <div className="loading-state">Searching accommodations...</div>;

  return (
    <div className="locations-page">
      {/* Search Result Top Header Bar */}
      <header className="locations-header-nav">
        <div className="locations-header-container container">
          <div className="brand-logo" onClick={() => navigate('/')}>
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ display: 'block', fill: '#FF385C', height: '34px', width: '34px' }}>
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415v.24c-.015 2.148-.751 4.02-2.235 5.342l-.233.2c-1.397 1.155-3.181 1.777-5.568 1.777-2.468 0-4.721-.86-6.861-2.61l-.226-.188c-.244-.207-.492-.413-.746-.62l-.747.62c-2.072 1.705-4.321 2.59-6.86 2.61a7.848 7.848 0 0 1-5.8-1.977c-1.484-1.322-2.22-3.194-2.236-5.342v-.24c.01-.924.253-1.805.92-3.396l.186-.45c.95-2.215 5.09-11.127 7.059-15.039l.534-1.025c1.288-2.306 2.743-3.269 4.752-3.269zm0 2.44c-1.09 0-1.88.544-2.678 1.97l-.544 1.05c-1.96 3.844-6.108 12.515-7.07 14.771l-.146.353c-.567 1.353-.755 2.016-.79 2.67l-.004.24v.2c.009 1.488.468 2.674 1.4 3.504.83.74 1.83 1.08 3.28 1.08 1.63 0 3.22-.61 4.97-1.92l.745-.62.746.62c1.75 1.31 3.34 1.92 4.97 1.92 1.45 0 2.45-.34 3.28-1.08 1.4-.83 1.88-2.016 1.4-3.504v-.24c-.035-.654-.223-1.317-.79-2.67l-.186-.45c-.96-2.256-5.11-10.927-7.07-14.771l-.544-1.05c-.798-1.426-1.588-1.97-2.678-1.97zm0 13.06a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 2.44a1.06 1.06 0 1 0 0 2.12 1.06 1.06 0 0 0 0-2.12z" />
            </svg>
            <span className="brand-name">airbnb</span>
          </div>

          <div className="locations-mini-search" onClick={() => navigate('/')}>
            <span>{searchQuery || 'Start your search'}</span>
            <div className="mini-search-icon">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ display: 'block', fill: '#FFFFFF', height: '12px', width: '12px' }}>
                <path d="M13 24a11 11 0 1 1 11-11 11 11 0 0 1-11 11zm0-2a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm13.12 4.53L24.6 25a11.96 11.96 0 0 0 2.25-3.14l1.52 1.52a1 1 0 0 1-1.25 1.15z" />
              </svg>
            </div>
          </div>

          <div>
            <button className="become-host-btn" onClick={() => navigate('/login')}>Sign In</button>
          </div>
        </div>
      </header>

      {/* Filter Toolbar Section */}
      <section className="filter-toolbar">
        <div className="filter-toolbar-container container">
          {/* Property Type Dropdown */}
          <div className="filter-item">
            <span className="filter-label">Property Type</span>
            <select
              className="filter-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Entire home">Entire home</option>
              <option value="Private room">Private room</option>
              <option value="Shared room">Shared room</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
            </select>
          </div>

          {/* Price Range Dropdown */}
          <div className="filter-item">
            <span className="filter-label">Price per night</span>
            <select
              className="filter-select"
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
            >
              <option value="Any">Any Price</option>
              <option value="under100">Under $100</option>
              <option value="100to200">$100 - $200</option>
              <option value="over200">Over $200</option>
            </select>
          </div>

          <div className="filter-summary">
            <p>Showing {filteredListings.length} results {searchQuery && `in "${searchQuery}"`}</p>
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <main className="locations-content container">
        {error && <div className="error-alert">{error}</div>}

        {filteredListings.length === 0 ? (
          <div className="empty-results">
            <h2>No Results Found</h2>
            <p>We couldn't find any listings matching your search or filters. Try removing some filters or searching for a different city.</p>
            <button className="btn btn-primary" onClick={() => { setSelectedType('All'); setSelectedPriceRange('Any'); navigate('/locations'); }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="locations-grid-layout">
            {filteredListings.map((item) => (
              <div
                key={item._id}
                className="location-public-card"
                onClick={() => navigate(`/listings/${item._id}`)}
              >
                <div className="card-image-container">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80'}
                    alt={item.name}
                    className="card-image"
                  />
                  <div className="card-rating-badge">★ {item.rating}</div>
                </div>

                <div className="card-body">
                  <div className="card-header-row">
                    <span className="card-type-label">{item.type}</span>
                    <span className="card-location-label">{item.location}</span>
                  </div>
                  <h3 className="card-title-text">{item.name}</h3>
                  
                  {/* Amenities teaser */}
                  {item.amenities && item.amenities.length > 0 && (
                    <p className="card-amenities-teaser">
                      {item.amenities.slice(0, 3).join(' · ')}
                      {item.amenities.length > 3 && ' · ...'}
                    </p>
                  )}

                  <div className="card-price-row">
                    <span className="card-price-value">${item.price}</span>
                    <span className="card-price-unit"> night</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Locations;
