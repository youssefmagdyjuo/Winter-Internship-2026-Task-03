const product = require('../models/productModel');
const sendEmail = require('../utils/sendEmail');

// Function to get all products
const getAllProducts = async (req, res) => {
    try {
        let filter = {};

        // Apply query filters if any
        if (req.query) {
            filter = { ...req.query };
        }

        const products = await product.find(filter);

        res.json({
            status: 'success',
            message: 'Products fetched successfully',
            results: products.length,
            data: products,
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};
// Function to get products by seller id
const getProductsBySellerId = async (req, res) => {
    try {
        let filter = {};
        //ensure seller can only get their products
        if (req.user?.role === 'seller') {
            // Set sellerId filter 
            filter.sellerId = req.user._id;
            // Apply query filters if any
            if (req.query) {
                filter = { ...filter, ...req.query };
            }
        } else {
            return res.status(403).json({
                status: 'fail',
                message: 'Access denied',
            });
        }

        const products = await product.find(filter);

        res.json({
            status: 'success',
            message: 'Products fetched successfully',
            results: products.length,
            data: products,
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};
// Function to get Approved products
const getApprovedProducts = async (req, res) => {
    try {
        let filter = { isApproved: 'approved' };
        // Apply query filters if any
        if (req.query) {
            filter = { ...filter, ...req.query };
        }
        const products = await product.find(filter);

        res.json({
            status: 'success',
            message: 'Approved Products fetched successfully',
            results: products.length,
            data: products,
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};

// Function to get a specific product by ID
const getSpecificProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const foundProduct = await product.findById(productId);
        if (!foundProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({
            status: 'success',
            message: 'Product fetched successfully',
            data: foundProduct,
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};
// Function to add a new product
const addProduct = async (req, res) => {
    try {
        const { title, description, price, stock, categoryId } = req.body;
        // Handle uploaded images
        // Hero Image
        let heroImage = null;
        if (req.files?.heroImage) {
            heroImage = req.files.heroImage[0].path.replace(/\\/g, "/");
            // console.log('heroImage:'+ heroImage)
        }
        // Product Gallery
        let images = [];
        if (req.files?.images) {
            images = req.files.images.map(file => file.path.replace(/\\/g, "/"));
            // console.log('images:'+images)
        }
        // sellerId from token 
        const sellerId = req.user._id;

        const productData = {
            title,
            description,
            price,
            stock,
            categoryId,
            sellerId,
            heroImage,
            images,
            isApproved: 'pending',
        };
        const savedProduct = await product.create(productData);
        res.status(201).json({
            status: 'success',
            message: 'Product added successfully',
            data: savedProduct,
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};
//update product
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updateData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
        };
        const updatedProduct = await product.findByIdAndUpdate(productId, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({
            status: 'success',
            message: 'Product updated successfully',
            data: updatedProduct,
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};
//update product status admin only
const updateProductStatus = async (req, res) => {
    try {
        const productId = req.params.id;
        const { rejectReason } = req.body || null

        const updateData = {
            isApproved: req.body.isApproved,
        };
        const updatedProduct = await product.findByIdAndUpdate(productId, updateData, { new: true }).populate("sellerId");
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (updateData.isApproved === 'rejected' && rejectReason) {
            await sendEmail(
                updatedProduct.sellerId.email,
                "Product Rejected",
                `Hello ${updatedProduct.sellerId.name || ""},
Your product has been rejected.
Reason:
${rejectReason}
Please review and resubmit if necessary.
                `
            );
        }
        if (updateData.isApproved === 'approved') {
            await sendEmail(
                updatedProduct.sellerId.email,
                "Product Approved",
                `Hello ${updatedProduct.sellerId.name || ""},
Great news 🎉
Your product has been approved and is now live on the platform.
                `
            );
        }

        res.json({
            status: 'success',
            message: 'Product status updated successfully',
            data: updatedProduct,
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};

// Function to delete a product
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({
            status: 'success',
            message: 'Product deleted successfully',
            data: deletedProduct,
        });
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};

module.exports = {
    getAllProducts,
    getSpecificProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus,
    getApprovedProducts,
    getProductsBySellerId
};