const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // slug (e.g., 'neck-stretch')
    title: { type: String, required: true },
    hindi: { type: String, required: true }, // Hindi label (e.g., '(गर्दन का व्यायाम)')
    image: { type: String, required: true }, // Main thumbnail
    steps: { type: [String], default: [] }, // Array of step images
    icon: { type: String, required: true }, // FontAwesome icon class
    fullDetails: { type: String, required: false, default: '' }, // Long description (optional)
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
