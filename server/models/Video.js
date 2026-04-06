const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    videoUrl: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        default: 'General' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Video', VideoSchema);
