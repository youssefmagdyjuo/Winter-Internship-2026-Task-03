require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;
const userRoutes = require('./routes/usersRoutes');
const authUserRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productsRoutes');
const orderRoutes = require('./routes/orderRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const path = require('path');

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));

// Routes
// Use user routes
app.use('/v1/api/users', userRoutes);
// Use auth user routes
app.use('/v1/api/auth', authUserRoutes);
// Use category routes
app.use('/v1/api/categories', categoryRoutes);
// Use product routes
app.use('/v1/api/products', productRoutes);
// Use order routes
app.use('/v1/api/orders', orderRoutes);
// Use statistics routes for admin only
app.use('/v1/api/statistics', statisticsRoutes);

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Connect Database
mongoose.connect(uri)
    .then(() => {
        console.log('Database Connected');
        // Running Server
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        })
    })
    .catch((err) => {
        console.log(err.message);
    })
