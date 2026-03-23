require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const meetingTypesRoutes = require('./routes/meetingTypes');
const availabilityRoutes = require('./routes/availability');
const bookingsRoutes = require('./routes/bookings');
const hostBookingsRoutes = require('./routes/hostBookings');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/meeting-types', meetingTypesRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/book', bookingsRoutes);
app.use('/api/bookings', hostBookingsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Calendly API running on http://localhost:${PORT}`);
});
