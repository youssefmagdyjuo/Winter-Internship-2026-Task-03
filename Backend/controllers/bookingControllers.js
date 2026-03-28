const Booking = require('../models/bookingModel');
const Service = require('../models/serviceModel');


// =========================
// CREATE BOOKING
// =========================
const createBooking = async (req, res) => {
    try {
        const { serviceId, date } = req.body;

        if (!date) {
            return res.status(400).json({
                status: 'fail',
                message: 'date are required'
            });
        }

        // get service
        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({
                status: 'fail',
                message: 'Service not found'
            });
        }

        const bookingObject = {
            customerId: req.user._id,
            serviceId: service._id,
            providerId: service.providerId, // auto from service
            date,
            status: 'pending'
        };

        const bookingData = await Booking.create(bookingObject);

        res.status(201).json({
            status: 'success',
            message: 'Booking created successfully',
            data: bookingData,
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};


// =========================
// GET ALL BOOKINGS
// =========================
const getAllBookings = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user._id;

        let bookings = [];

        if (userRole === 'customer') {
            bookings = await Booking.find({ customerId: userId })
                .populate('serviceId', 'title')
                .populate('providerId', 'name');
        }

        else if (userRole === 'admin') {
            bookings = await Booking.find({})
                .populate('serviceId', 'title')
                .populate('providerId', 'name');
        }

        else if (userRole === 'provider') {
            bookings = await Booking.find({ providerId: userId })
                .populate('serviceId', 'title')
                .populate('providerId', 'name');
        }

        // reshape data
        const formattedBookings = bookings.map((booking) => ({
            ...booking._doc,

            serviceName: booking.serviceId?.title || null,
            providerName: booking.providerId?.name || null,
        }));

        res.status(200).json({
            results: formattedBookings.length,
            status: 'success',
            message: "Bookings fetched successfully",
            data: formattedBookings
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};

// =========================
// UPDATE BOOKING STATUS
// =========================
const updateBookingStatus = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user._id;
        const bookingId = req.params.id;

        const { status } = req.body;

        const foundBooking = await Booking.findById(bookingId);

        if (!foundBooking) {
            return res.status(404).json({
                status: 'fail',
                message: 'Booking not found'
            });
        }

        // ===============================
        // CUSTOMER LOGIC
        // ===============================
        if (userRole === 'customer') {

            if (foundBooking.customerId.toString() !== userId.toString()) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'You can only update your own bookings'
                });
            }

            if (foundBooking.status === 'pending') {
                foundBooking.status = 'cancelled';
                await foundBooking.save();
            } else {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Booking cannot be cancelled at this stage'
                });
            }
        }

        // ===============================
        // PROVIDER / ADMIN LOGIC
        // ===============================
        else if (userRole === 'provider' || userRole === 'admin') {

            if (status) {
                if (foundBooking.status !== 'pending') {
                    return res.status(400).json({
                        status: 'fail',
                        message: `Status already ${foundBooking.status}`
                    });
                }

                if (status === 'approved' || status === 'rejected') {
                    foundBooking.status = status;
                    await foundBooking.save();
                } else {
                    return res.status(400).json({
                        status: 'fail',
                        message: 'Invalid status'
                    });
                }
            }
        }

        else {
            return res.status(403).json({
                status: 'fail',
                message: 'Access denied'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Booking updated successfully',
            data: foundBooking
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};


// =========================
// GET SPECIFIC BOOKING
// =========================
const getSpecificBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userRole = req.user.role;
        const userId = req.user._id;

        let booking = await Booking.findById(id)
            .populate('serviceId')
            .populate('providerId')
            .lean();

        if (!booking) {
            return res.status(404).json({
                status: 'fail',
                message: 'Booking not found'
            });
        }

        // restrict provider to his bookings
        if (userRole === 'provider') {
            if (booking.providerId._id.toString() !== userId.toString()) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'Access denied'
                });
            }
        }

        // restrict customer
        if (userRole === 'customer') {
            if (booking.customerId.toString() !== userId.toString()) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'Access denied'
                });
            }
        }

        res.json({
            status: 'success',
            message: 'Booking fetched successfully',
            data: booking,
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};

// =========================
// DELETE BOOKING
// =========================
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const userRole = req.user.role;
        const userId = req.user._id;

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                status: 'fail',
                message: 'Booking not found'
            });
        }

        // Only customer can delete their own pending bookings
        if (userRole === 'customer') {
            if (booking.customerId.toString() !== userId.toString()) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'You can only delete your own bookings'
                });
            }

            if (booking.status !== 'pending') {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Only pending bookings can be deleted'
                });
            }
        }
        // Admin can delete any booking
        else if (userRole !== 'admin') {
            return res.status(403).json({
                status: 'fail',
                message: 'Access denied'
            });
        }

        await Booking.findByIdAndDelete(id);

        res.status(200).json({
            status: 'success',
            message: 'Booking deleted successfully'
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    updateBookingStatus,
    getSpecificBooking,
    deleteBooking
};