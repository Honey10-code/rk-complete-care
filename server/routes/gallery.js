const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const GalleryImage = require('../models/GalleryImage');

// Setup multer for local disk storage pointing to /uploads/
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, 'gallery-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET all gallery images
router.get('/', async (req, res) => {
    try {
        const images = await GalleryImage.find().sort({ createdAt: -1 });
        const imagesWithUrl = images.map(img => {
            const obj = img.toObject();
            if (obj.image && !obj.image.startsWith('http')) {
                // Formatting for local file path access
                obj.image = `${req.protocol}://${req.get('host')}/${obj.image}`;
            }
            return obj;
        });
        res.json(imagesWithUrl);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new gallery image (handles both file upload and external URL)
router.post('/', upload.single('image'), async (req, res) => {
    let imagePath = req.body.imageUrl || '';
    if (req.file) imagePath = req.file.path.replace(/\\/g, '/');

    if (!imagePath) {
        return res.status(400).json({ message: 'Image file or URL is required.' });
    }

    const newImage = new GalleryImage({
        image: imagePath,
        title: req.body.title || 'Clinic Image',
        category: req.body.category || 'Clinic'
    });

    try {
        const savedImage = await newImage.save();
        res.status(201).json(savedImage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE gallery image
router.delete('/:id', async (req, res) => {
    try {
        const image = await GalleryImage.findById(req.params.id);
        if (!image) return res.status(404).json({ message: 'Gallery image not found' });
        await image.deleteOne();
        res.json({ message: 'Gallery image deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
