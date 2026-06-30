import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth, api } from '../context/AuthContext';
import './CreateListing.css'; // Reuse form layout styles

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

const UpdateListing = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('Entire home');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  // Fetch listing data on load
  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        const { data } = await api.get(`/accommodations/${id}`);
        
        // Owner verification check (just in case they accessed directly via URL)
        const ownerId = data.owner?._id || data.owner;
        if (ownerId !== user?._id) {
          alert('You are not authorized to edit this listing');
          return navigate('/admin/listings');
        }

        setName(data.name);
        setType(data.type);
        setDescription(data.description);
        setLocation(data.location);
        setPrice(data.price.toString());
        setImage(data.image || '');
        setSelectedAmenities(data.amenities || []);
      } catch (err) {
        setError('Failed to fetch listing details.');
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [id, user]);

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

    setUpdating(true);
    setError('');

    try {
      await api.put(`/accommodations/${id}`, {
        name,
        type,
        description,
        location,
        price: parseFloat(price),
        image: image.trim(),
        amenities: selectedAmenities,
      });

      alert('Listing updated successfully!');
      navigate('/admin/listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading-state">Loading listing details...</div>;

  return (
    <div className="create-listing-page">
      <div className="form-container-box">
        <div className="form-header">
          <h1>Update Accommodation Listing</h1>
          <p>Modify the details of your property listing below</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="listing-form-container">
          <div className="form-group">
            <label className="form-label" htmlFor="listing-name">Property Name</label>
            <input
              id="listing-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={updating}
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
                disabled={updating}
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
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={updating}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="listing-location">Location/City</label>
            <input
              id="listing-location"
              type="text"
              className="form-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={updating}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="listing-desc">Description</label>
            <textarea
              id="listing-desc"
              className="form-input text-area-input"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={updating}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="listing-image">Image URL</label>
            <input
              id="listing-image"
              type="url"
              className="form-input"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              disabled={updating}
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
                    disabled={updating}
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
              disabled={updating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={updating}
            >
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateListing;
