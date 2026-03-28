const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    image: {
        type: String, // URL or local path
        required: true
    },
    experience: {
        type: String,
        default: '5+ Years'
    },
    shift: {
        type: String,
        default: 'Morning 10 AM - 1 PM | Evening 5 PM - 8 PM'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);
