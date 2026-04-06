const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Exercise = require('../models/Exercise');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, 'exercise-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET all exercises
router.get('/', async (req, res) => {
    try {
        const exercises = await Exercise.find().sort({ createdAt: 1 });
        const exerciseWithUrl = exercises.map(e => {
            const obj = e.toObject();
            if (obj.image && !obj.image.startsWith('http')) {
                obj.image = `${req.protocol}://${req.get('host')}/${obj.image}`;
            }
            return obj;
        });
        res.json(exerciseWithUrl);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new exercise
router.post('/', upload.single('image'), async (req, res) => {
    let imagePath = req.body.imageUrl || '';
    if (req.file) imagePath = req.file.path.replace(/\\/g, '/');

    const exercise = new Exercise({
        id: req.body.id || req.body.title.toLowerCase().replace(/\s+/g, '-'),
        title: req.body.title,
        hindi: req.body.hindi,
        image: imagePath,
        icon: req.body.icon || 'fa-person-running',
        fullDetails: req.body.fullDetails
    });

    try {
        const newExercise = await exercise.save();
        res.status(201).json(newExercise);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update exercise
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) return res.status(404).json({ message: 'Exercise not found' });

        if (req.file) exercise.image = req.file.path.replace(/\\/g, '/');
        else if (req.body.imageUrl) exercise.image = req.body.imageUrl;

        const fields = ['title', 'hindi', 'id', 'icon', 'fullDetails'];
        fields.forEach(f => {
            if (req.body[f] !== undefined) exercise[f] = req.body[f];
        });

        const updatedExercise = await exercise.save();
        res.json(updatedExercise);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE exercise
router.delete('/:id', async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) return res.status(404).json({ message: 'Exercise not found' });
        await exercise.deleteOne();
        res.json({ message: 'Exercise deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
