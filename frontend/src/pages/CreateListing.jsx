import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';
import './CreateListing.css';

const AMENITIES_LIST = [
  'WiFi',
  'Pool',
  'Air Conditioning',
  'Kitchen',
  'Free Parking',
  'Gym',
  'TV',
  'Workspace'
];

const CreateListing = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Entire home');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle amenities checkbox toggle
  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // Form validation
  const validateForm = () => {
    if (!name.trim()) return 'Name is required';
    if (!description.trim()) return 'Description is required';
    if (!location.trim()) return 'Location is required';
    if (!price || parseFloat(price) <= 0) return 'Price per night must be a positive number';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/accommodations', {
        name,
        type,
        description,
        location,
        price: parseFloat(price),
        image: image.trim() || undefined, // Fallback to model default if empty
        amenities: selectedAmenities,
      });

      alert('Listing created successfully!');
      navigate('/admin/listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-listing-page">
      <div className="form-container-box">
        <div className="form-header">
          <h1>Create a New Listing</h1>
          <p>Provide details about your property to list it on our Airbnb clone site</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="listing-form-container">
          <div className="form-group">
            <label className="form-label" htmlFor="listing-name">Property Name</label>
            <input
              id="listing-name"
              type="text"
              className="form-input"
              placeholder="e.g. Modern Apartment with Ocean View"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="listing-type">Property Type</label>
              <select
                id="listing-type"
                className="form-input"
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled={loading}
              >
                <option value="Entire home">Entire home</option>
                <option value="Private room">Private room</option>
                <option value="Shared room">Shared room</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="listing-price">Price per Night ($)</label>
              <input
                id="listing-price"
                type="number"
                className="form-input"
                placeholder="100"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="listing-location">Location/City</label>
            <input
              id="listing-location"
              type="text"
              className="form-input"
              placeholder="e.g. Cape Town, Western Cape"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="listing-desc">Description</label>
            <textarea
              id="listing-desc"
              className="form-input text-area-input"
              placeholder="Provide a detailed description of your property, key highlights, and guest expectations..."
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="listing-image">Image URL</label>
            <input
              id="listing-image"
              type="url"
              className="form-input"
              placeholder="e.g. https://images.unsplash.com/..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Amenities checklist */}
          <div className="form-group">
            <label className="form-label">Amenities</label>
            <div className="amenities-selection-grid">
              {AMENITIES_LIST.map((amenity) => (
                <label key={amenity} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    disabled={loading}
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-buttons-row">
            <button
              type="button"
              className="btn btn-outline cancel-btn"
              onClick={() => navigate('/admin/listings')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
