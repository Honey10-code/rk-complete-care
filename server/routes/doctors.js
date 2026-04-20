const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const multer = require('multer');
const path = require('path');

// Configure Multer for local file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// GET all doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find().sort({ createdAt: 1 });
        // Add full URL to image path if it's a local file
        const doctorsWithUrl = doctors.map(doc => {
            const docObj = doc.toObject();
            if (docObj.image && !docObj.image.startsWith('http')) {
                docObj.image = `${req.protocol}://${req.get('host')}/${docObj.image.replace(/\\/g, '/')}`;
            }
            return docObj;
        });
        res.json(doctorsWithUrl);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new doctor
router.post('/', upload.single('image'), async (req, res) => {
    let imagePath = req.body.imageUrl; // Support URL if provided

    if (req.file) {
        imagePath = req.file.path.replace(/\\/g, "/");
    }

    const doctor = new Doctor({
        name: req.body.name,
        qualification: req.body.qualification,
        specialty: req.body.specialty,
        designation: req.body.designation,
        image: imagePath || 'https://placehold.co/400x400?text=Doctor' // Fallback
    });

    try {
        const newDoctor = await doctor.save();
        res.status(201).json(newDoctor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE doctor
router.delete('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        await doctor.deleteOne();
        res.json({ message: 'Doctor deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
