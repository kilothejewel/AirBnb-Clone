const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    accommodation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Accommodation',
      required: [true, 'Accommodation reference is required'],
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Guest reference is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative'],
    },
    status: {
      type: String,
      default: 'confirmed',
      enum: ['confirmed', 'cancelled'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reservation', reservationSchema);
