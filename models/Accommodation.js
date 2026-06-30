const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Accommodation name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Type of accommodation is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [0, 'Price cannot be negative'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    image: {
      type: String,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner/Host is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Accommodation', accommodationSchema);
