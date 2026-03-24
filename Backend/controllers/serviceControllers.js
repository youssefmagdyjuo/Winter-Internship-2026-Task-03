const Service = require('../models/serviceModel');

// Get all services
const getAllServices = async (req, res) => {
    try {
        let filter = {};

        // If provider → show only their services
        if (req.user?.role === 'provider') {
            filter.providerId = req.user._id;
        }

        // Apply query filters if any
        if (req.query) {
            filter = { ...filter, ...req.query };
        }

        const services = await Service.find(filter);

        res.json({
            status: 'success',
            message: 'Services fetched successfully',
            results: services.length,
            data: services,
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};



// Get services by provider
const getServicesByProviderId = async (req, res) => {
    try {
        if (req.user?.role !== 'provider') {
            return res.status(403).json({
                status: 'fail',
                message: 'Access denied',
            });
        }

        let filter = { providerId: req.user._id };

        if (req.query) {
            filter = { ...filter, ...req.query };
        }

        const services = await Service.find(filter);

        res.json({
            status: 'success',
            message: 'Services fetched successfully',
            results: services.length,
            data: services,
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};



// Get specific service
const getSpecificService = async (req, res) => {
    try {
        const serviceId = req.params.id;

        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({
                status: 'fail',
                message: 'Service not found'
            });
        }

        res.json({
            status: 'success',
            message: 'Service fetched successfully',
            data: service,
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};



// Add service
const addService = async (req, res) => {
    try {
        const { title, description, price, duration } = req.body;

        const providerId = req.user._id;

        const serviceData = {
            title,
            description,
            price,
            duration,
            providerId
        };

        const savedService = await Service.create(serviceData);

        res.status(201).json({
            status: 'success',
            message: 'Service added successfully',
            data: savedService,
        });

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
};



// Update service
const updateService = async (req, res) => {
    try {
        const serviceId = req.params.id;

        const existingService = await Service.findById(serviceId);

        if (!existingService) {
            return res.status(404).json({
                status: 'fail',
                message: 'Service not found'
            });
        }

        const {
            title,
            description,
            price,
            duration
        } = req.body;

        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            {
                title,
                description,
                price,
                duration
            },
            { new: true }
        );

        res.status(200).json({
            status: 'success',
            message: 'Service updated successfully',
            data: updatedService
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message
        });
    }
};



// Delete service
const deleteService = async (req, res) => {
    try {
        const serviceId = req.params.id;

        const deletedService = await Service.findByIdAndDelete(serviceId);

        if (!deletedService) {
            return res.status(404).json({
                status: 'fail',
                message: 'Service not found'
            });
        }

        res.json({
            status: 'success',
            message: 'Service deleted successfully',
            data: deletedService,
        });

    } catch (err) {
        res.status(500).json({
            status: 'fail',
            message: err.message,
        });
    }
};



module.exports = {
    getAllServices,
    getSpecificService,
    addService,
    updateService,
    deleteService,
    getServicesByProviderId
};