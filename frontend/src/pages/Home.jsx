import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/locations?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/locations');
    }
  };

  const selectCity = (city) => {
    navigate(`/locations?search=${encodeURIComponent(city)}`);
  };

  return (
    <div className="home-container">
      {/* Public Top Header Navigation (Airbnb styled) */}
      <header className="public-header">
        <div className="public-header-container">
          <div className="brand-logo" onClick={() => navigate('/')}>
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ display: 'block', fill: '#FF385C', height: '34px', width: '34px' }}>
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.01.415v.24c-.015 2.148-.751 4.02-2.235 5.342l-.233.2c-1.397 1.155-3.181 1.777-5.568 1.777-2.468 0-4.721-.86-6.861-2.61l-.226-.188c-.244-.207-.492-.413-.746-.62l-.747.62c-2.072 1.705-4.321 2.59-6.86 2.61a7.848 7.848 0 0 1-5.8-1.977c-1.484-1.322-2.22-3.194-2.236-5.342v-.24c.01-.924.253-1.805.92-3.396l.186-.45c.95-2.215 5.09-11.127 7.059-15.039l.534-1.025c1.288-2.306 2.743-3.269 4.752-3.269zm0 2.44c-1.09 0-1.88.544-2.678 1.97l-.544 1.05c-1.96 3.844-6.108 12.515-7.07 14.771l-.146.353c-.567 1.353-.755 2.016-.79 2.67l-.004.24v.2c.009 1.488.468 2.674 1.4 3.504.83.74 1.83 1.08 3.28 1.08 1.63 0 3.22-.61 4.97-1.92l.745-.62.746.62c1.75 1.31 3.34 1.92 4.97 1.92 1.45 0 2.45-.34 3.28-1.08 1.4-.83 1.88-2.016 1.4-3.504v-.24c-.035-.654-.223-1.317-.79-2.67l-.186-.45c-.96-2.256-5.11-10.927-7.07-14.771l-.544-1.05c-.798-1.426-1.588-1.97-2.678-1.97zm0 13.06a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 2.44a1.06 1.06 0 1 0 0 2.12 1.06 1.06 0 0 0 0-2.12z" />
            </svg>
            <span className="brand-name">airbnb</span>
          </div>

          <div className="public-nav-links">
            <span className="nav-item active">Places to stay</span>
            <span className="nav-item">Experiences</span>
            <span className="nav-item">Online Experiences</span>
          </div>

          <div className="public-auth-actions">
            <button className="become-host-btn" onClick={() => navigate('/admin/dashboard')}>
              Become a Host
            </button>
            <button className="login-btn-circle" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="hero-section">
        <div className="hero-image-container">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
            alt="Beautiful beach escape"
            className="hero-image"
          />
          <div className="hero-overlay-content">
            <h2>Not sure where to go? Perfect.</h2>
            <button className="btn flexible-btn" onClick={() => navigate('/locations')}>
              I'm flexible
            </button>
          </div>
        </div>

        {/* Floating Search Bar */}
        <div className="floating-search-container">
          <form onSubmit={handleSearch} className="search-form-layout">
            <div className="search-field">
              <label htmlFor="search-input">Location</label>
              <input
                id="search-input"
                type="text"
                placeholder="Where are you going?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="divider-line"></div>
            <div className="search-field">
              <label>Check In / Out</label>
              <span className="search-placeholder">Add dates</span>
            </div>
            <div className="divider-line"></div>
            <div className="search-field">
              <label>Guests</label>
              <span className="search-placeholder">Add guests</span>
            </div>
            <button type="submit" className="search-submit-circle">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style={{ display: 'block', fill: '#FFFFFF', height: '16px', width: '16px' }}>
                <path d="M13 24a11 11 0 1 1 11-11 11 11 0 0 1-11 11zm0-2a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm13.12 4.53L24.6 25a11.96 11.96 0 0 0 2.25-3.14l1.52 1.52a1 1 0 0 1-1.25 1.15z" />
              </svg>
            </button>
          </form>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="inspiration-section container">
        <h2 className="section-title">Inspiration for your next trip</h2>
        <div className="inspiration-grid">
          <div className="inspiration-card card-rose" onClick={() => selectCity('Cape Town')}>
            <img src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=400&q=80" alt="Cape Town" />
            <div className="inspiration-info">
              <h3>Cape Town</h3>
              <p>Coastlines and vineyards</p>
            </div>
          </div>
          <div className="inspiration-card card-orange" onClick={() => selectCity('Kruger National Park')}>
            <img src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=400&q=80" alt="Kruger National Park" />
            <div className="inspiration-info">
              <h3>Kruger Park</h3>
              <p>Wildlife safaris</p>
            </div>
          </div>
          <div className="inspiration-card card-blue" onClick={() => selectCity('Johannesburg')}>
            <img src="https://images.unsplash.com/photo-1542931287-023b922fa89b?auto=format&fit=crop&w=400&q=80" alt="Johannesburg" />
            <div className="inspiration-info">
              <h3>Johannesburg</h3>
              <p>Urban culture history</p>
            </div>
          </div>
          <div className="inspiration-card card-dark" onClick={() => selectCity('Durban')}>
            <img src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80" alt="Durban" />
            <div className="inspiration-info">
              <h3>Durban</h3>
              <p>Warm beaches and surf</p>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Experiences Section */}
      <section className="experiences-section container">
        <h2 className="section-title">Discover Airbnb Experiences</h2>
        <div className="experiences-grid">
          <div className="experience-banner banner-left">
            <div className="banner-content">
              <h3>Things to do<br />on your trip</h3>
              <button className="btn btn-outline-white" onClick={() => navigate('/locations')}>
                Experiences
              </button>
            </div>
          </div>
          <div className="experience-banner banner-right">
            <div className="banner-content">
              <h3>Things to do<br />from home</h3>
              <button className="btn btn-outline-white" onClick={() => navigate('/locations')}>
                Online Experiences
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ShopAirbnb / Future Getaways Section */}
      <section className="shop-section container">
        <div className="shop-banner">
          <div className="shop-content">
            <h2>Shop Airbnb</h2>
            <p>Explore unique design items curated from host spaces around the globe.</p>
            <button className="btn btn-dark" onClick={() => navigate('/locations')}>
              Explore Shop
            </button>
          </div>
          <div className="shop-image">
            <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80" alt="Airbnb Shop Interior" />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="public-footer">
        <div className="footer-container container">
          <div className="footer-column">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">AirCover</a>
            <a href="#">Safety information</a>
            <a href="#">Supporting people with disabilities</a>
            <a href="#">Cancellation options</a>
            <a href="#">Our COVID-19 Response</a>
          </div>
          <div className="footer-column">
            <h4>Community</h4>
            <a href="#">Airbnb.org: disaster relief housing</a>
            <a href="#">Support Afghan refugees</a>
            <a href="#">Combating discrimination</a>
          </div>
          <div className="footer-column">
            <h4>Hosting</h4>
            <a href="#">Try hosting</a>
            <a href="#">AirCover for Hosts</a>
            <a href="#">Explore hosting resources</a>
            <a href="#">Visit our community forum</a>
            <a href="#">How to host responsibly</a>
          </div>
          <div className="footer-column">
            <h4>Airbnb</h4>
            <a href="#">Newsroom</a>
            <a href="#">Learn about new features</a>
            <a href="#">Letters from our founders</a>
            <a href="#">Careers</a>
            <a href="#">Investors</a>
          </div>
        </div>
        <div className="footer-bottom container">
          <p>© 2026 Airbnb, Inc. · Privacy · Terms · Sitemap</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
