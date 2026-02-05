const router = require('express').Router();
const {getSpecificOrder, createOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderControllers');
const { protect } = require('../middleware/protectedRoutes');
const { allowedTo } = require('../middleware/protectedRoutes');

router.route('/')
    .post(protect, allowedTo('customer'), createOrder)
    .get(protect, getAllOrders)
router.route('/:id')
    .put(protect, updateOrderStatus)
    .get(protect,getSpecificOrder)


module.exports = router;