import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, api } from '../context/AuthContext';
import './ListingDetails.css';

// Premium default interior/exterior fallback images for the 4 grid slots
const DEFAULT_GRID_IMAGES = [
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'
];

const ListingDetails = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState('1');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Cost calculator calculations
  const [numNights, setNumNights] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [serviceFee, setServiceFee] = useState(25);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/accommodations/${id}`);
        setListing(data);
      } catch (err) {
        setError('Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  // Handle calculator dates update
  useEffect(() => {
    if (startDate && endDate && listing) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end > start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNumNights(diffDays);
        const base = diffDays * listing.price;
        setBasePrice(base);
        setTotalPrice(base + serviceFee);
      } else {
        setNumNights(0);
        setBasePrice(0);
        setTotalPrice(0);
      }
    } else {
      setNumNights(0);
      setBasePrice(0);
      setTotalPrice(0);
    }
  }, [startDate, endDate, listing]);

  const handleReserve = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please log in or create an account to book this listing.');
      return navigate('/login');
    }

    if (numNights <= 0) {
      setBookingError('Please enter a valid check-out date after your check-in date.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess(false);

    try {
      await api.post('/reservations', {
        accommodation: listing._id,
        startDate,
        endDate,
      });
      setBookingSuccess(true);
      alert('Reservation successfully booked!');
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to book reservation. Please check dates.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="loading-state">Loading property details...</div>;
  if (error || !listing) return <div className="error-alert container" style={{ marginTop: '40px' }}>{error || 'Listing not found.'}</div>;

  return (
    <div className="listing-details-page">
      {/* Mini public header for navigation */}
      <header className="details-header-nav">
        <div className="details-header-container container">
          <div className="brand-logo" onClick={() => navigate('/')}>
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ display: 'block', fill: '#FF385C', height: '34px', width: '34px' }}>
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415v.24c-.015 2.148-.751 4.02-2.235 5.342l-.233.2c-1.397 1.155-3.181 1.777-5.568 1.777-2.468 0-4.721-.86-6.861-2.61l-.226-.188c-.244-.207-.492-.413-.746-.62l-.747.62c-2.072 1.705-4.321 2.59-6.86 2.61a7.848 7.848 0 0 1-5.8-1.977c-1.484-1.322-2.22-3.194-2.236-5.342v-.24c.01-.924.253-1.805.92-3.396l.186-.45c.95-2.215 5.09-11.127 7.059-15.039l.534-1.025c1.288-2.306 2.743-3.269 4.752-3.269zm0 2.44c-1.09 0-1.88.544-2.678 1.97l-.544 1.05c-1.96 3.844-6.108 12.515-7.07 14.771l-.146.353c-.567 1.353-.755 2.016-.79 2.67l-.004.24v.2c.009 1.488.468 2.674 1.4 3.504.83.74 1.83 1.08 3.28 1.08 1.63 0 3.22-.61 4.97-1.92l.745-.62.746.62c1.75 1.31 3.34 1.92 4.97 1.92 1.45 0 2.45-.34 3.28-1.08 1.4-.83 1.88-2.016 1.4-3.504v-.24c-.035-.654-.223-1.317-.79-2.67l-.186-.45c-.96-2.256-5.11-10.927-7.07-14.771l-.544-1.05c-.798-1.426-1.588-1.97-2.678-1.97zm0 13.06a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 2.44a1.06 1.06 0 1 0 0 2.12 1.06 1.06 0 0 0 0-2.12z" />
            </svg>
            <span className="brand-name">airbnb</span>
          </div>
          <div>
            <button className="become-host-btn" onClick={() => navigate('/login')}>Sign In</button>
          </div>
        </div>
      </header>

      <div className="container details-content-body">
        {/* Headings */}
        <div className="details-header-section">
          <h1>{listing.name}</h1>
          <div className="details-header-meta">
            <span>★ {listing.rating}</span>
            <span>·</span>
            <span className="location-link">{listing.location}</span>
          </div>
        </div>

        {/* Gallery: 1 large on left, 4 small on right */}
        <div className="details-image-gallery">
          <div className="gallery-main-image">
            <img
              src={listing.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'}
              alt={listing.name}
            />
          </div>
          <div className="gallery-sub-images">
            {DEFAULT_GRID_IMAGES.map((imgUrl, idx) => (
              <img key={idx} src={imgUrl} alt={`Interior detail ${idx + 1}`} />
            ))}
          </div>
        </div>

        {/* Main Columns */}
        <div className="details-two-columns">
          {/* Information Column (Left) */}
          <div className="details-info-column">
            <div className="host-info-block">
              <h2>{listing.type} hosted by {listing.owner?.name || 'Local Host'}</h2>
              <p className="host-badge">Guest favorite · Verified amenities</p>
            </div>

            <div className="info-divider"></div>

            <div className="description-block">
              <h3>About this space</h3>
              <p className="description-text">{listing.description}</p>
            </div>

            <div className="info-divider"></div>

            {/* Amenities Grid */}
            <div className="amenities-block">
              <h3>What this place offers</h3>
              <div className="amenities-icons-grid">
                {listing.amenities && listing.amenities.length > 0 ? (
                  listing.amenities.map((item) => (
                    <div key={item} className="amenity-icon-item">
                      <span className="amenity-bullet">✦</span>
                      <span className="amenity-name">{item}</span>
                    </div>
                  ))
                ) : (
                  <p>Standard features (WiFi, kitchen, essentials)</p>
                )}
              </div>
            </div>
          </div>

          {/* Booking / Pricing Calculator Widget Column (Right) */}
          <div className="details-widget-column">
            <div className="booking-widget-card">
              <div className="widget-price-row">
                <span className="widget-price">${listing.price} <span className="widget-unit">night</span></span>
                <span className="widget-rating">★ {listing.rating}</span>
              </div>

              {bookingError && <div className="booking-error">{bookingError}</div>}
              {bookingSuccess && (
                <div className="booking-success">
                  Your reservation is confirmed! Manage it in your dashboard.
                </div>
              )}

              <form onSubmit={handleReserve} className="booking-form-box">
                <div className="booking-inputs-grid">
                  <div className="booking-input-field border-right">
                    <label htmlFor="check-in">Check-in</label>
                    <input
                      id="check-in"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      disabled={bookingLoading}
                      required
                    />
                  </div>
                  <div className="booking-input-field">
                    <label htmlFor="check-out">Check-out</label>
                    <input
                      id="check-out"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      disabled={bookingLoading}
                      required
                    />
                  </div>
                  <div className="booking-input-field border-top span-two">
                    <label htmlFor="guests-select">Guests</label>
                    <select
                      id="guests-select"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      disabled={bookingLoading}
                    >
                      <option value="1">1 guest</option>
                      <option value="2">2 guests</option>
                      <option value="3">3 guests</option>
                      <option value="4">4 guests</option>
                      <option value="5">5 guests</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary reserve-submit-btn"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Reserving...' : token ? 'Reserve' : 'Log In to Reserve'}
                </button>
              </form>

              {/* Cost Calculator Breakdown */}
              {numNights > 0 && (
                <div className="cost-breakdown-box">
                  <p className="calculator-tip">You won't be charged yet</p>
                  
                  <div className="breakdown-row">
                    <span>${listing.price} x {numNights} nights</span>
                    <span>${basePrice}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Airbnb service fee</span>
                    <span>${serviceFee}</span>
                  </div>

                  <div className="breakdown-divider"></div>

                  <div className="breakdown-row total-row">
                    <span>Total before taxes</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
