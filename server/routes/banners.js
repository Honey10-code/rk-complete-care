const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const multer = require('multer');
const path = require('path');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = path.join(__dirname, '..', 'uploads');
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique filename
    }
});

const upload = multer({ storage: storage });

// GET all banners (Sorted by order)
router.get('/', async (req, res) => {
    try {
        const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
        // Add full URL to image path if it's a local file
        const bannersWithUrl = banners.map(banner => {
            const bannerObj = banner.toObject();
            if (bannerObj.image && !bannerObj.image.startsWith('http')) {
                bannerObj.image = `${req.protocol}://${req.get('host')}/${bannerObj.image}`;
            }
            return bannerObj;
        });
        res.json(bannersWithUrl);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new banner
router.post('/', upload.single('image'), async (req, res) => {
    let imagePath = req.body.imageUrl;
    if (req.file) {
        imagePath = `uploads/${req.file.filename}`; 
    }

    // Get max order
    const lastBanner = await Banner.findOne().sort({ order: -1 });
    const order = lastBanner ? lastBanner.order + 1 : 0;

    const banner = new Banner({
        image: imagePath,
        title: req.body.title,
        subtitle: req.body.subtitle,
        titleColor: req.body.titleColor || 'white',
        subtitleColor: req.body.subtitleColor || 'white',
        order: order
    });

    try {
        const newBanner = await banner.save();
        res.status(201).json(newBanner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH reorder banners
router.patch('/reorder', async (req, res) => {
    const { bannerIds } = req.body; // Array of IDs in the new order
    try {
        const updates = bannerIds.map((id, index) => 
            Banner.findByIdAndUpdate(id, { order: index })
        );
        await Promise.all(updates);
        res.json({ message: 'Banners reordered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE banner
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ message: 'Banner not found' });

        let imagePath = req.body.imageUrl || banner.image;
        if (req.file) {
            imagePath = `uploads/${req.file.filename}`;
        }

        banner.title = req.body.title !== undefined ? req.body.title : banner.title;
        banner.subtitle = req.body.subtitle !== undefined ? req.body.subtitle : banner.subtitle;
        banner.titleColor = req.body.titleColor || banner.titleColor;
        banner.subtitleColor = req.body.subtitleColor || banner.subtitleColor;
        banner.image = imagePath;

        const updatedBanner = await banner.save();
        res.json(updatedBanner);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE banner
router.delete('/:id', async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ message: 'Banner not found' });

        await banner.deleteOne(); // Use deleteOne() instead of remove()
        res.json({ message: 'Banner deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
