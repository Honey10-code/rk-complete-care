const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    target: {
        type: String,
        enum: ['All', 'Today', 'Recent', 'Custom'], // Recent: last 7 days
        default: 'All'
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Sent', 'Failed', 'Cancelled'],
        default: 'Pending'
    },
    scheduledAt: {
        type: Date
    },
    sentAt: {
        type: Date
    },
    metrics: {
        total: { type: Number, default: 0 },
        sent: { type: Number, default: 0 },
        failed: { type: Number, default: 0 }
    },
    autoType: {
        type: String,
        enum: ['Manual', 'Birthday', 'Medicine', 'Followup'],
        default: 'Manual'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Broadcast', broadcastSchema);
