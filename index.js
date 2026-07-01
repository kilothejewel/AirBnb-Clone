require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const accommodationRoutes = require('./routes/accommodationRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/reservations', reservationRoutes);

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running smoothly' });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, 'frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
  });
}

// Start Server Immediately
if (!process.env.MONGODB_URI) {
  console.error('================================================================');
  console.error('CRITICAL ERROR: MONGODB_URI is not defined in environment vars!');
  console.error('Please configure MONGODB_URI under settings in the dashboard.');
  console.error('================================================================');
  process.exit(1);
}

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
