const express = require('express');
const router = express.Router();
const Broadcast = require('../models/Broadcast');
const Appointment = require('../models/Appointment');

// 🏁 1. GET ALL BROADCASTS (History)
router.get('/', async (req, res) => {
    try {
        const broadcasts = await Broadcast.find().sort({ createdAt: -1 });
        res.json(broadcasts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🚀 2. POST NEW BROADCAST
router.post('/', async (req, res) => {
    try {
        const { title, message, imageUrl, target, scheduledAt } = req.body;
        const b = new Broadcast({
            title,
            message,
            imageUrl,
            target,
            scheduledAt,
            status: scheduledAt ? "Pending" : "Sent", 
            sentAt: scheduledAt ? null : new Date()
        });

        // Simplified targeting logic
        let query = {};
        if (target === 'Today') {
            const start = new Date(); start.setHours(0,0,0,0);
            const end = new Date(); end.setHours(23,59,59,999);
            query = { date: { $gte: start, $lte: end } };
        } else if (target === 'Recent') {
            const last7 = new Date(); last7.setDate(last7.getDate() - 7);
            query = { date: { $gte: last7 } };
        }

        const patients = await Appointment.find(query).distinct('phone');
        b.metrics = { total: patients.length, sent: scheduledAt ? 0 : patients.length, failed: 0 };
        
        const newBroadcast = await b.save();
        
        // Notify via Socket if sent immediately
        if (!scheduledAt) {
            const io = req.app.get('io');
            if (io) io.to('admin-room').emit('broadcast-sent', newBroadcast);
        }

        res.status(201).json(newBroadcast);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 🔄 3. RETRY BROADCAST
router.post('/:id/retry', async (req, res) => {
    try {
        const b = await Broadcast.findById(req.params.id);
        if (!b) return res.status(404).json({ message: "Broadcast not found" });

        b.status = "Sent";
        b.sentAt = new Date();
        b.metrics.sent = b.metrics.total;
        b.metrics.failed = 0;
        await b.save();

        res.json(b);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 🗑️ 4. DELETE BROADCAST
router.delete('/:id', async (req, res) => {
    try {
        await Broadcast.findByIdAndDelete(req.params.id);
        res.json({ message: "Broadcast history cleared" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
