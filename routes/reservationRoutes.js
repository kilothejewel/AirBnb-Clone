const express = require('express');
const router = express.Router();
const {
  createReservation,
  getUserReservations,
  getHostReservations,
  cancelReservation,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

// All reservation endpoints are protected by default
router.use(protect);

router.post('/', createReservation);
router.get('/my-bookings', getUserReservations);
router.get('/host-bookings', getHostReservations);
router.delete('/:id', cancelReservation);

module.exports = router;
