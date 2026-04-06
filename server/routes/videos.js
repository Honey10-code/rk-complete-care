const express = require('express');
const router = express.Router();
const Video = require('../models/Video');

// @route   GET /api/videos
// @desc    Get all videos
router.get('/', async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   POST /api/videos
// @desc    Add a video
router.post('/', async (req, res) => {
    try {
        const { title, videoUrl, category } = req.body;
        if (!title || !videoUrl) {
            return res.status(400).json({ message: "Title and Video URL are required" });
        }
        const newVideo = new Video({ title, videoUrl, category });
        await newVideo.save();
        res.status(201).json(newVideo);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// @route   DELETE /api/videos/:id
// @desc    Delete a video
router.delete('/:id', async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.json({ message: "Video deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
