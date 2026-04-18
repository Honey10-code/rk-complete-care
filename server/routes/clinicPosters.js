const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ClinicPoster = require('../models/ClinicPoster');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, 'poster-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET all posters
router.get('/', async (req, res) => {
    try {
        const posters = await ClinicPoster.find().sort({ createdAt: -1 });
        const postersWithUrl = posters.map(p => {
            const obj = p.toObject();
            if (obj.image && !obj.image.startsWith('http')) {
                obj.image = `${req.protocol}://${req.get('host')}/${obj.image}`;
            }
            return obj;
        });
        res.json(postersWithUrl);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new poster
router.post('/', upload.single('image'), async (req, res) => {
    let imagePath = req.body.imageUrl || '';
    if (req.file) imagePath = req.file.path.replace(/\\/g, '/');

    let sections = [];
    try {
        if (req.body.sections) {
            sections = JSON.parse(req.body.sections);
        }
    } catch (err) {
        console.error("Error parsing sections:", err);
    }

    const poster = new ClinicPoster({
        image: imagePath,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category || 'General',
        sections: sections
    });

    try {
        const newPoster = await poster.save();
        res.status(201).json(newPoster);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE poster
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        let imagePath = req.body.imageUrl || '';
        if (req.file) imagePath = req.file.path.replace(/\\/g, '/');

        let sections = [];
        try {
            if (req.body.sections) {
                sections = JSON.parse(req.body.sections);
            }
        } catch (err) {
            console.error("Error parsing sections:", err);
        }

        const updateData = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category || 'General',
            sections: sections
        };

        if (req.file) {
            updateData.image = req.file.path.replace(/\\/g, '/');
        } else if (req.body.imageUrl !== undefined) {
            updateData.image = req.body.imageUrl;
        }

        const updatedPoster = await ClinicPoster.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedPoster) return res.status(404).json({ message: 'Poster not found' });
        res.json(updatedPoster);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE poster
router.delete('/:id', async (req, res) => {
    try {
        const poster = await ClinicPoster.findById(req.params.id);
        if (!poster) return res.status(404).json({ message: 'Poster not found' });
        await poster.deleteOne();
        res.json({ message: 'Poster deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
