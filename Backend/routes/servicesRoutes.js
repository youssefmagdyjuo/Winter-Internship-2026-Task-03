const router = require('express').Router();

const {
    getServicesByProviderId,
    getAllServices,
    getSpecificService,
    addService,
    updateService,
    deleteService
} = require('../controllers/serviceControllers');

const { protect, allowedTo } = require('../middleware/protectedRoutes');

// ======================
// Add & Get All Services
// ======================
router.route('/')
    // Provider only can add service
    .post(
        protect,
        allowedTo('provider'),
        addService
    )
    .get(
        getAllServices
    );

// ======================
// Provider Services
// ======================
router.route('/provider')
    .get(
        protect,
        allowedTo('provider'),
        getServicesByProviderId
    );

// ======================
// Single Service
// ======================
router.route('/:id')
    .get(getSpecificService)
    .put(
        protect,
        allowedTo('provider'),
        updateService
    )
    .delete(
        protect,
        allowedTo('provider'),
        deleteService
    );

module.exports = router;