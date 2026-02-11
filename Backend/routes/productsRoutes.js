const router = require('express').Router();
const { getProductsBySellerId, getApprovedProducts, updateProductStatus, getAllProducts, getSpecificProduct, addProduct, updateProduct, deleteProduct, } = require('../controllers/productControllers');
const { protect } = require('../middleware/protectedRoutes');
const { allowedTo } = require('../middleware/protectedRoutes');
const { uploadProductImages } = require('../middleware/upload.middleware');
router.route('/')
    // Seller only
    .post(
        //must be login
        protect,
        //must be seller
        allowedTo('seller'),
        //upload image with multer
        uploadProductImages,
        //main function to add product
        addProduct)
    // get all products 
    .get(protect, allowedTo('seller', 'admin'), getAllProducts);

// Get products by seller ID
router.route('/seller')
    .get(protect, allowedTo('seller'), getProductsBySellerId);

// Public get only approved products
router.route('/approved').get(getApprovedProducts);

// Admin only
router.route('/status/:id')
    .put(protect, allowedTo('admin'), updateProductStatus);

router.route('/:id')
    .get(getSpecificProduct)
    .put(
        protect,
        allowedTo('seller'),
        uploadProductImages,
        updateProduct
    )

    .delete(protect, allowedTo('seller'), deleteProduct);

module.exports = router;