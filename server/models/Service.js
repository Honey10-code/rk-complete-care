const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    titleHi: { type: String }, // Hindi title (optional)
    id: { type: String, required: true, unique: true }, // Slug/ID for URL (e.g., 'neck-pain')
    icon: { type: String, required: true }, // FontAwesome icon class
    image: { type: String, required: true }, // URL or path to image
    tagline: { type: String, required: true },
    desc: { type: String, required: true }, // Short description for grid
    content: [{ type: String }], // Array of paragraphs for detail view
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', ServiceSchema);
