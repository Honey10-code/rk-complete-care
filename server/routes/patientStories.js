const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const PatientStory = require('../models/PatientStory');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, 'story-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET all stories
router.get('/', async (req, res) => {
    try {
        const stories = await PatientStory.find().sort({ featured: -1, createdAt: -1 });
        const storiesWithUrl = stories.map(s => {
            const obj = s.toObject();
            if (obj.image && !obj.image.startsWith('http')) {
                obj.image = `${req.protocol}://${req.get('host')}/${obj.image}`;
            }
            return obj;
        });
        res.json(storiesWithUrl);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new story
router.post('/', upload.single('image'), async (req, res) => {
    let imagePath = req.body.imageUrl || '';
    if (req.file) imagePath = req.file.path.replace(/\\/g, '/');

    const story = new PatientStory({
        patientName: req.body.patientName,
        age: req.body.age,
        location: req.body.location,
        condition: req.body.condition,
        story: req.body.story,
        outcome: req.body.outcome,
        image: imagePath,
        rating: req.body.rating || 5,
        featured: req.body.featured === 'true'
    });

    try {
        const newStory = await story.save();
        res.status(201).json(newStory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE story
router.delete('/:id', async (req, res) => {
    try {
        const story = await PatientStory.findById(req.params.id);
        if (!story) return res.status(404).json({ message: 'Story not found' });
        await story.deleteOne();
        res.json({ message: 'Story deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE story
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        let imagePath = req.body.imageUrl || '';
        if (req.file) imagePath = req.file.path.replace(/\\/g, '/');

        const updateData = {
            patientName: req.body.patientName,
            age: req.body.age,
            location: req.body.location,
            condition: req.body.condition,
            conditionHi: req.body.conditionHi,
            story: req.body.story,
            outcome: req.body.outcome,
            rating: req.body.rating || 5,
            featured: req.body.featured === 'true'
        };

        // Always update image if either a new file is uploaded or a (possibly empty) imageUrl is provided
        if (req.file) {
            updateData.image = req.file.path.replace(/\\/g, '/');
        } else if (req.body.imageUrl !== undefined) {
            updateData.image = req.body.imageUrl;
        }

        const updatedStory = await PatientStory.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedStory) return res.status(404).json({ message: 'Story not found' });
        res.json(updatedStory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
