const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: false
    },
    subtitle: {
        type: String,
        required: false
    },
    order: {
        type: Number,
        default: 0
    },
    titleColor: {
        type: String,
        default: 'white'
    },
    subtitleColor: {
        type: String,
        default: 'white'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Banner', bannerSchema);
