const mongoose = require('mongoose');

const clinicInfoSchema = new mongoose.Schema({
    phones: {
        type: [String],
        required: true
    },
    email: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    openingHours: {
        morning: String,
        evening: String,
        sunday: String
    },
    socialLinks: {
        facebook: String,
        instagram: String,
        twitter: String,
        whatsapp: String,
        google: String
    },
    maxBookingsPerSlot: {
        type: Number,
        default: 10
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ClinicInfo', clinicInfoSchema);
