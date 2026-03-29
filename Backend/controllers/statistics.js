const Booking = require('../models/bookingModel');
const Service = require('../models/serviceModel');
const User = require('../models/userModel');

const getStatistics = async (req, res) => {
    try {

        // =========================
        // TOTALS
        // =========================
        const totalServices = await Service.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalBookings = await Booking.countDocuments();

        // Approved bookings only
        const totalApprovedBookings = await Booking.countDocuments({
            status: 'approved'
        });

        const totalPendingBookings = await Booking.countDocuments({
            status: 'pending'
        });

        const totalRejectedBookings = await Booking.countDocuments({
            status: 'rejected'
        });

        // =========================
        // DAILY BOOKINGS
        // =========================
        const dailyData = await Booking.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    totalBookings: { $sum: 1 },
                    approvedBookings: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "approved"] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const dailyStats = dailyData.map(d => ({
            date: d._id,
            bookings: d.totalBookings,
            approved: d.approvedBookings
        }));

        // =========================
        // RESPONSE
        // =========================
        res.json({
            totals: {
                totalServices,
                totalUsers,
                totalBookings,
                totalApprovedBookings,
                totalPendingBookings,
                totalRejectedBookings
            },
            dailyStats
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};

module.exports = { getStatistics };