const Reservation = require('../models/Reservation');
const Accommodation = require('../models/Accommodation');

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res) => {
  const { accommodation: accommodationId, startDate, endDate } = req.body;

  try {
    // 1. Check if accommodation exists
    const accommodation = await Accommodation.findById(accommodationId);
    if (!accommodation) {
      return res.status(404).json({ message: 'Accommodation not found' });
    }

    // 2. Prevent host from booking their own listing
    if (accommodation.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot reserve your own accommodation' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // 3. Date validation
    if (start >= end) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // 4. Check for overlapping reservations
    const overlapping = await Reservation.findOne({
      accommodation: accommodationId,
      status: 'confirmed',
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } },
      ],
    });

    if (overlapping) {
      return res.status(400).json({ message: 'These dates are already reserved for this accommodation' });
    }

    // 5. Calculate total cost
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = diffDays * accommodation.price;

    // 6. Create reservation
    const reservation = await Reservation.create({
      accommodation: accommodationId,
      guest: req.user._id,
      startDate: start,
      endDate: end,
      totalPrice,
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's reservations (Guest bookings)
// @route   GET /api/reservations/my-bookings
// @access  Private
const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ guest: req.user._id })
      .populate({
        path: 'accommodation',
        select: 'name location price image type',
        populate: { path: 'owner', select: 'name email' }
      });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reservations on host's listings (Host bookings)
// @route   GET /api/reservations/host-bookings
// @access  Private
const getHostReservations = async (req, res) => {
  try {
    // Find all accommodations owned by the host
    const accommodations = await Accommodation.find({ owner: req.user._id });
    const accommodationIds = accommodations.map((acc) => acc._id);

    // Find all reservations for these accommodations
    const reservations = await Reservation.find({
      accommodation: { $in: accommodationIds },
    })
      .populate('guest', 'name email')
      .populate('accommodation', 'name location price image type');

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel/Delete a reservation
// @route   DELETE /api/reservations/:id
// @access  Private
const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('accommodation');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Authorization: User must be either the guest who booked or the host of the accommodation
    const isGuest = reservation.guest.toString() === req.user._id.toString();
    const isHost = reservation.accommodation.owner.toString() === req.user._id.toString();

    if (!isGuest && !isHost) {
      return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
    }

    await reservation.deleteOne();
    res.json({ message: 'Reservation cancelled and deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReservation,
  getUserReservations,
  getHostReservations,
  cancelReservation,
};
