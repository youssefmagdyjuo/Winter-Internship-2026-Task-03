require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

// Import routes
const userRoutes = require('./routes/usersRoutes');
const authUserRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productsRoutes');
const orderRoutes = require('./routes/orderRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');

// ===== Middleware =====

// CORS setup
const allowedOrigins = [process.env.FRONTEND_URL];
app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true); // allow non-browser requests (like Postman)
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Handle preflight requests
app.options('*', cors({
    origin: allowedOrigins,
    methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== Routes =====
app.use('/v1/api/users', userRoutes);
app.use('/v1/api/auth', authUserRoutes);
app.use('/v1/api/categories', categoryRoutes);
app.use('/v1/api/products', productRoutes);
app.use('/v1/api/orders', orderRoutes);
app.use('/v1/api/statistics', statisticsRoutes);

// Simple test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// ===== Connect Database & Start Server =====
mongoose.connect(uri)
    .then(() => {
        console.log('Database Connected');
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    })
    .catch(err => {
        console.error('Database connection error:', err.message);
    });
