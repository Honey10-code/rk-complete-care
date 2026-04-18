const mongoose = require('mongoose');

const ClinicPosterSchema = new mongoose.Schema({
    image: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    category: { type: String, default: 'General' },
    sections: [{
        heading: String,
        headingColor: String,
        subHeading: String,
        details: String,
        detailsWeight: { type: String, enum: ['bold', 'normal'], default: 'normal' }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClinicPoster', ClinicPosterSchema);
