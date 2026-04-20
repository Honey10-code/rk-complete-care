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
            const processPath = (p) => {
                if (p && !p.startsWith('http') && !p.startsWith('//')) {
                    const clean = p.startsWith('/') ? p.substring(1) : p;
                    return `${req.protocol}://${req.get('host')}/${clean}`;
                }
                return p;
            };

            obj.image = processPath(obj.image);
            if (obj.steps && Array.isArray(obj.steps) && obj.steps.length > 0) {
                obj.steps = obj.steps.map(processPath);
            } else {
                obj.steps = obj.image ? [obj.image] : [];
            }
            return obj;
        });
        res.json(exerciseWithUrl);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new exercise
router.post('/', upload.array('steps'), async (req, res) => {
    let steps = [];
    if (req.body.stepsJSON) {
        steps = JSON.parse(req.body.stepsJSON);
    }

    // Replace placeholders with actual uploaded files
    if (req.files && req.files.length > 0) {
        let fileIdx = 0;
        steps = steps.map(s => {
            if (s === 'FILE_UPLOAD' && req.files[fileIdx]) {
                const path = req.files[fileIdx].path.replace(/\\/g, '/');
                fileIdx++;
                return path;
            }
            return s;
        });
    }

    const exercise = new Exercise({
        id: req.body.id || req.body.title.toLowerCase().replace(/\s+/g, '-'),
        title: req.body.title,
        hindi: req.body.hindi,
        image: steps.length > 0 ? steps[0] : (req.body.imageUrl || ''),
        steps: steps,
        icon: req.body.icon || 'fa-person-running'
    });

    try {
        const newExercise = await exercise.save();
        res.status(201).json(newExercise);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update exercise
router.put('/:id', upload.array('steps'), async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) return res.status(404).json({ message: 'Exercise not found' });

        let steps = [];
        if (req.body.stepsJSON) {
            steps = JSON.parse(req.body.stepsJSON);
        }

        // Replace placeholders with actual uploaded files
        if (req.files && req.files.length > 0) {
            let fileIdx = 0;
            steps = steps.map(s => {
                if (s === 'FILE_UPLOAD' && req.files[fileIdx]) {
                    const path = req.files[fileIdx].path.replace(/\\/g, '/');
                    fileIdx++;
                    return path;
                }
                return s;
            });
        }

        const fields = ['title', 'hindi', 'id', 'icon'];
        fields.forEach(f => {
            if (req.body[f] !== undefined) exercise[f] = req.body[f];
        });

        if (steps.length > 0) {
            exercise.steps = steps;
            exercise.image = steps[0]; // First step as thumbnail
        }

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
