const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Service = require('../models/Service');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, 'service-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET all services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: 1 });
        const servicesWithUrl = services.map(s => {
            const obj = s.toObject();
            if (obj.image && !obj.image.startsWith('http')) {
                obj.image = `${req.protocol}://${req.get('host')}/${obj.image}`;
            }
            return obj;
        });
        res.json(servicesWithUrl);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new service
router.post('/', upload.single('image'), async (req, res) => {
    let imagePath = req.body.imageUrl || '';
    if (req.file) imagePath = req.file.path.replace(/\\/g, '/');

    const serviceData = {
        title: req.body.title,
        titleHi: req.body.titleHi,
        id: req.body.id || req.body.title.toLowerCase().replace(/\s+/g, '-'),
        icon: req.body.icon || 'fa-stethoscope',
        image: imagePath,
        tagline: req.body.tagline,
        desc: req.body.desc,
        content: Array.isArray(req.body.content) ? req.body.content : (req.body.content ? [req.body.content] : [])
    };

    const service = new Service(serviceData);
    try {
        const newService = await service.save();
        res.status(201).json(newService);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update service
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: 'Service not found' });

        if (req.file) service.image = req.file.path.replace(/\\/g, '/');
        else if (req.body.imageUrl) service.image = req.body.imageUrl;

        const fields = ['title', 'titleHi', 'id', 'icon', 'tagline', 'desc', 'content'];
        fields.forEach(f => {
            if (req.body[f] !== undefined) {
                if (f === 'content' && typeof req.body[f] === 'string') {
                    service[f] = [req.body[f]];
                } else {
                    service[f] = req.body[f];
                }
            }
        });

        const updatedService = await service.save();
        res.json(updatedService);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE service
router.delete('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: 'Service not found' });
        await service.deleteOne();
        res.json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
