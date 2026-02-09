const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

const getStatistics = async (req, res) => {
    try {
        // all Statistics
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        // Total Revenue (only completed orders)
        const totalRevenueAgg = await Order.aggregate([
            { $match: { status: 'completed' } }, // بس orders اللي مكتملة
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;

        // Daily Sales Data (only completed orders)
        const dailyData = await Order.aggregate([
            { $match: { status: 'completed' } }, // شرط الـ completed هنا كمان
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalRevenue: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const dailySales = dailyData.map(d => ({
            date: d._id,
            revenue: d.totalRevenue,
            orders: d.totalOrders
        }));

        res.json({
            totals: {
                totalProducts,
                totalUsers,
                totalOrders,
                totalRevenue
            },
            dailySales
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getStatistics }
