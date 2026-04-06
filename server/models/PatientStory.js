const mongoose = require('mongoose');

const PatientStorySchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    age: { type: String },
    location: { type: String },
    condition: { type: String, required: true },
    conditionHi: { type: String },
    story: { type: String, required: true },
    outcome: { type: String },
    image: { type: String },
    rating: { type: Number, default: 5 },
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PatientStory', PatientStorySchema);
