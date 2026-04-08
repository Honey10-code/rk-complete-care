const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const Service = require('../models/Service');
const Doctor = require('../models/Doctor');
const ClinicInfo = require('../models/ClinicInfo');

// @route   GET /api/initial-data
// @desc    Get all data required for the Home page landing (Banners, Services, Doctors, Clinic Info)
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Run all queries in parallel for maximum performance
        const [banners, services, doctors, clinicInfo] = await Promise.all([
            Banner.find().sort({ createdAt: -1 }).limit(5),
            Service.find().limit(6),
            Doctor.find().limit(4),
            ClinicInfo.findOne()
        ]);

        res.json({
            banners,
            services,
            doctors,
            clinicInfo: clinicInfo || {}
        });
    } catch (err) {
        console.error("Initial Data Fetch Error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
