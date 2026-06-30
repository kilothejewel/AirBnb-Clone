const Accommodation = require('../models/Accommodation');

// @desc    Create a new accommodation
// @route   POST /api/accommodations
// @access  Private
const createAccommodation = async (req, res) => {
  const { name, type, description, location, amenities, price, rating, image } = req.body;

  try {
    const accommodation = await Accommodation.create({
      name,
      type,
      description,
      location,
      amenities,
      price,
      rating,
      image,
      owner: req.user._id, // Set host to authenticated user
    });

    res.status(201).json(accommodation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all accommodations (with optional location query filtering)
// @route   GET /api/accommodations
// @access  Public
const getAccommodations = async (req, res) => {
  const { location } = req.query;

  try {
    const filter = location
      ? { location: new RegExp(location, 'i') } // Case-insensitive partial match
      : {};

    const accommodations = await Accommodation.find(filter).populate('owner', 'name email');
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get accommodation by ID
// @route   GET /api/accommodations/:id
// @access  Public
const getAccommodationById = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id).populate('owner', 'name email');

    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    res.json(accommodation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update accommodation details
// @route   PUT /api/accommodations/:id
// @access  Private
const updateAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    // Authorization check: Make sure request user owns the listing
    if (accommodation.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this listing' });
    }

    // Update fields
    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedAccommodation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete accommodation listing
// @route   DELETE /api/accommodations/:id
// @access  Private
const deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    // Authorization check: Make sure request user owns the listing
    if (accommodation.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    await accommodation.deleteOne();
    res.json({ message: 'Accommodation removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
};
