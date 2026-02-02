const axios = require('axios');
const order = require('../models/orderModel');
const Product = require('../models/productModel');
//crate order
const createOrder = async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'No items provided'
            });
        }
        //handle items array
        const allItems = await Promise.all(
            //loop in items array
            items.map(async (item) => {
                //get this product to get sellerId and price
                const product = await Product.findById(item.productId);
                return {
                    productId: product._id,
                    quantity: item.quantity,
                    price: product.price,
                    sellerId: product.sellerId,
                    //calc item total praice
                    totalItemPrice: Number(item.quantity) * Number(product.price)
                };
            })
        );
        //calc total oreder price
        const totalOrderPrice = allItems.reduce(
            (acc, item) => acc + item.totalItemPrice,
            0
        );
        //create order
        const orderObject = {
            customerId: req.user._id,
            items: allItems,
            totalAmount: totalOrderPrice,
            status: 'pending',
            isPaid: false
        };
        //add order to database
        const orderData = await order.create(orderObject);

        res.status(201).json({
            status: 'success',
            message: 'Order created successfully',
            data: orderData,
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};
//get all orders
const getAllOrders = async (req, res) => {
    let orders;
    try {
        const userRole = req.user.role
        const userId = req.user._id
        // console.log(userRole)
        //if user is customer get customer's orders
        if (userRole == 'customer') {
            orders = await order.find({ customerId: userId })
        }
        //if user is admin get all orders
        else if (userRole == 'admin') {
            orders = await order.find({})
            //if user is seller get orders which contain seller items
        } else if (userRole == 'seller') {
            orders = await order.find({ "items.sellerId": userId })
        }
        res.status(200).json({
            status: 'success',
            message: "orders fetched successfully",
            data: orders
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
}
//update  order
const updateOrderStatus = async (req, res) => {
    try {
        const userRole = req.user.role;
        const userId = req.user._id;
        const orderId = req.params.id;
        const { status, items } = req.body;
        // find order 
        const foundOrder = await order.findById(orderId);
        if (!foundOrder) {
            return res.status(404).json({ status: 'fail', message: 'Order not found' });
        }

        if (userRole === 'customer') {
            if (foundOrder.customerId.toString() !== userId.toString()) {
                return res.status(403).json({ status: 'fail', message: 'You can only update your own orders' });
            }

            if (foundOrder.status === 'pending' || foundOrder.status === 'confirmed') {
                foundOrder.status = 'cancelled';
                await foundOrder.save();
            } else {
                return res.status(400).json({ status: 'fail', message: 'Order cannot be cancelled at this stage' });
            }
        }
        // admin can change any time
        else if (userRole === 'admin') {
            foundOrder.status = status;
            await foundOrder.save();
            if (status == 'confirmed') {
                //update product stock
                //.......
            }
        }

        else {
            return res.status(403).json({ status: 'fail', message: 'Access denied' });
        }

        res.status(200).json({
            status: 'success',
            message: 'Order updated successfully',
            data: foundOrder
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};
module.exports = {
    createOrder,
    getAllOrders,
    updateOrderStatus
};