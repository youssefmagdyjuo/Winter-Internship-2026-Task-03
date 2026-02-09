const router = require('express').Router();
const { getStatistics } = require('../controllers/statistics');
const { protect } = require('../middleware/protectedRoutes');
const { allowedTo } = require('../middleware/protectedRoutes');

router.route('/')
    .get(protect, allowedTo('admin'), getStatistics)
module.exports = router