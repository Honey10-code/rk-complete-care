const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});

// Routes
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/clinic-info', require('./routes/clinicInfo'));
app.use('/api/patient-stories', require('./routes/patientStories'));
app.use('/api/clinic-posters', require('./routes/clinicPosters'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ message: 'API route not found' });
        }
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
} else {
    // Root route
    app.get('/', (req, res) => {
        res.send("RK The Complete Care API is running 🚀");
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});