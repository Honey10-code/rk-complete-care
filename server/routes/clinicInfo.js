const express = require('express');
const router = express.Router();
const ClinicInfo = require('../models/ClinicInfo');

// GET clinic info
router.get('/', async (req, res) => {
    try {
        // Find the most recently updated document, or the first one
        let info = await ClinicInfo.findOne().sort({ updatedAt: -1 });
        if (!info) {
            // Return default/empty structure if nothing exists
            return res.json({
                phones: ['+91 8769556475', '+91 9782468376'],
                email: 'rk.completecare@gmail.com',
                address: '21, Nirmal Vihar, Dadi ka Phatak, Near Victor Public school, Benad Road, Jhotwara, Jaipur',
                openingHours: {
                    morning: '09:00 AM - 1:00 PM',
                    evening: '04:00 PM - 08:00 PM',
                    sunday: '09:00 AM - 12:00 PM'
                },
                socialLinks: {
                    facebook: '#',
                    instagram: '#',
                    twitter: '#',
                    whatsapp: 'https://wa.me/918769556475',
                    google: 'https://g.page/r/CXkFsimafLKiEAE/review'
                }
            });
        }

        // Auto-migrate: Update existing record to match newest schedule and standardized email
        if (info.openingHours.morning !== '09:00 AM - 01:00 PM' || 
            info.openingHours.evening !== '04:00 PM - 08:00 PM' ||
            info.openingHours.sunday !== '09:00 AM - 12:00 PM' ||
            info.email !== 'rk.completecare@gmail.com') {
            
            info.openingHours.morning = '09:00 AM - 01:00 PM';
            info.openingHours.evening = '04:00 PM - 08:00 PM';
            info.openingHours.sunday = '09:00 AM - 12:00 PM';
            info.email = 'rk.completecare@gmail.com';
            
            await info.save();
        }

        res.json(info);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST/UPDATE clinic info
router.post('/', async (req, res) => {
    try {
        // We only want one document, so we delete any existing ones first (or could update)
        // A simpler strategy for a single-settings resource is to findOneAndUpdate with upsert

        const update = {
            phones: req.body.phones,
            email: req.body.email,
            address: req.body.address,
            openingHours: req.body.openingHours,
            socialLinks: req.body.socialLinks,
            updatedAt: Date.now()
        };

        // Upsert: update if found, insert if not. 
        // We use a fixed query {} because we just want *the* clinic info.
        // However, findOneAndUpdate without a unique index or _id can be tricky with upsert if multiple exist.
        // Let's just delete all and insert one, or use a known ID. 
        // Let's try finding one first.

        let info = await ClinicInfo.findOne();

        if (info) {
            // Update existing
            Object.assign(info, update);
            const updatedInfo = await info.save();
            res.json(updatedInfo);
        } else {
            // Create new
            const newInfo = new ClinicInfo(update);
            const savedInfo = await newInfo.save();
            res.json(savedInfo);
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
