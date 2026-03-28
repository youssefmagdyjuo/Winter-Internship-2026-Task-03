const router = require('express').Router();

const {
    getSpecificBooking,
    createBooking,
    getAllBookings,
    updateBookingStatus,
    deleteBooking
} = require('../controllers//bookingControllers');

const { protect, allowedTo } = require('../middleware/protectedRoutes');


// ======================
// Create & Get All Bookings
// ======================
router.route('/')
    // Customer only creates booking
    .post(
        protect,
        allowedTo('customer','admin'),
        createBooking
    )
    .get(
        protect,
        getAllBookings
    );


// ======================
// Single Booking
// ======================
router.route('/:id')
    // Get specific booking
    .get(
        protect,
        getSpecificBooking
    )
    // Update booking status (provider/admin)
    .put(
        protect,
        allowedTo('provider', 'admin'),
        updateBookingStatus
    )
    .delete(
        protect,
        allowedTo('customer','admin'),
        deleteBooking
    )
    

module.exports = router;