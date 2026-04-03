const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const jwt = require('jsonwebtoken');

// Middleware to verify Admin
const verifyAdmin = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access Denied" });

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

// 1. Submit a Contact Message (Public)
router.post('/', async (req, res) => {
    try {
        const { name, phone, email, topic, message } = req.body;
        if (!name || !phone || !email || !message) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        const newMessage = new ContactMessage({ name, phone, email, topic, message });
        await newMessage.save();

        res.status(201).json({ message: "Message sent successfully!", data: newMessage });
    } catch (err) {
        console.error("Error saving contact message:", err);
        res.status(500).json({ message: "Failed to send message", error: err.message });
    }
});

// 2. Get all Contact Messages (Admin only)
router.get('/', verifyAdmin, async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch messages" });
    }
});

// 3. Delete a Contact Message (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        await ContactMessage.findByIdAndDelete(req.params.id);
        res.json({ message: "Message deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete message" });
    }
});

// 4. Mark message as read (Admin only)
router.patch('/:id/read', verifyAdmin, async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id, 
            { status: 'Read' }, 
            { new: true }
        );
        res.json({ message: "Message marked as read", data: message });
    } catch (err) {
        res.status(500).json({ message: "Failed to update message status" });
    }
});

module.exports = router;
