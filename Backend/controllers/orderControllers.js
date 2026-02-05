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
                    productName:product.title,
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
    let orders = [];
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
            //send only items in orders belong to seller
            orders = await order.find({ "items.sellerId": userId })
            let allSellerItems = []
            orders.map((order) => {
                let orderObject = {
                    orderStatus: order.status,
                    orderItems: []
                }
                order.items.map((item) => {
                    if (item.sellerId.toString() === userId.toString()) {
                        orderObject.orderItems.push(item)
                    }
                })
                allSellerItems.push(orderObject)
            })
            orders = allSellerItems
        }
        res.status(200).json({
            resulte: orders.length,
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
        let updatedProduct;
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
            } else if (status == "cancelled" && foundOrder.status == 'cancelled') {
                return res.status(400).json({ status: 'fail', message: 'Order already cancelled' });
            }
            else {
                return res.status(400).json({ status: 'fail', message: 'Order cannot be cancelled at this stage' });
            }
        }
        // admin can change any time
        else if (userRole === 'admin') {
            const isStock = true
            const outOfStock = []
            //if admin try to make confirm action
            if (status == 'confirmed') {
                // check order status if pending
                if (foundOrder.status == 'pending') {
                    //check befor confirm order if items out of stock or not
                    //loop in order items
                    items.map(async (item) => {
                        const product = await Product.findById(item.productId);
                        const itemStock = product.stock
                        if (itemStock < 1) {
                            outOfStock.push(product.title)
                            isStock = false
                        }
                    })
                    // if all items in stock so confirm
                    if (isStock) {
                        foundOrder.status = 'confirmed';
                        await foundOrder.save();
                        //update product stock
                        //loop in order items to update product stock
                        items.map(async (item) => {
                            const product = await Product.findById(item.productId);
                            const updatedProductStock = Number(product.stock) - Number(item.quantity)
                            updatedProduct = await Product.findByIdAndUpdate(product._id, { stock: updatedProductStock });
                        })
                    } //if any item out of stock return error 
                    else {
                        return res.status(400).json({
                            status: 'fail',
                            message: 'items out of stock',
                            data: outOfStock
                        });
                    }
                }
                //if order status is not pending so admin can not confirm
                else {
                    return res.status(400).json({ status: 'fail', message: `status already ${foundOrder.status}` });
                }

            }
            // if action not  confirm 
            else {
                foundOrder.status = status;
                await foundOrder.save();
            }
        }
        else {
            return res.status(403).json({ status: 'fail', message: 'Access denied' });
        }
        res.status(200).json({
            status: 'success',
            message: ` ${userRole =='customer'?"Order cancelled successfully":"Order updated successfully"} ${updatedProduct ? 'product stock is updated' : ''}`,
            data: foundOrder
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};
const getSpecificOrder = async (req, res) => {
    try {
        const { id } = req.params
        const foundOrder = await order.findById(id)
        if (!foundOrder) {
            return res.status(404).json({ message: 'order not found' });
        }
        res.json({
            status: 'success',
            message: 'order fetched successfully',
            data: foundOrder,
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
}
module.exports = {
    createOrder,
    getAllOrders,
    updateOrderStatus,
    getSpecificOrder
};