require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// ENV
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

// Routes
const userRoutes = require('./routes/usersRoutes');
const authUserRoutes = require('./routes/authRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// ======================
// Middleware
// ======================

// Enable CORS (optional but recommended)
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ======================
// Routes
// ======================

// Users
app.use('/v1/api/users', userRoutes);

// Auth
app.use('/v1/api/auth', authUserRoutes);

// Services 
app.use('/v1/api/services', servicesRoutes);

// ✅ Bookings (instead of orders)
app.use('/v1/api/bookings', bookingRoutes);



// ======================
// Health Check Route
// ======================
app.get('/', (req, res) => {
    res.send('API is running 🚀');
});


// ======================
// Database Connection
// ======================
mongoose.connect(uri)
    .then(() => {
        console.log('Database Connected');

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.log('DB Connection Error:', err.message);
    });