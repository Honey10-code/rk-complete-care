const mongoose = require('mongoose');

const GalleryImageSchema = new mongoose.Schema({
    image: { 
        type: String, 
        required: true 
    },
    title: { 
        type: String,
        default: 'Clinic Image'
    },
    category: { 
        type: String, 
        default: 'Clinic' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('GalleryImage', GalleryImageSchema);
