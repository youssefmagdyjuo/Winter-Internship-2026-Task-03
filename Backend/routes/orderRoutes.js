const router = require('express').Router();
const { createOrder ,getAllOrders} = require('../controllers/orderControllers');
const { protect } = require('../middleware/protectedRoutes');
const { allowedTo } = require('../middleware/protectedRoutes');

router.route('/')
    .post(protect,allowedTo('customer'),createOrder)
    .get(protect,getAllOrders)

module.exports = router;