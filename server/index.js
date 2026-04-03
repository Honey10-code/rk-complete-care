const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Created 'uploads' directory ✅");
}
const dns = require('dns');

// ✅ DNS Fix (important for Mongo Atlas)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

// ENV
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Middleware
app.use(cors({
  origin: "*", // dev only
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ MongoDB Connection (better logging)
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected to:", mongoose.connection.host, "✅"))
  .catch((err) => {
    console.error("MongoDB connection error ❌", err);
    process.exit(1); // 🔥 exit if DB fails
  });

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/clinic-info', require('./routes/clinicInfo'));
app.use('/api/patient-stories', require('./routes/patientStories'));
app.use('/api/clinic-posters', require('./routes/clinicPosters'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/contacts', require('./routes/contacts'));

// ✅ Health check
app.get('/', (req, res) => {
  res.send("RK The Complete Care API is running 🚀");
});

// ✅ Catch-all for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});


// ❗ Global Error Handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.stack);
  res.status(500).json({ message: "Server Error" });
});

// ❗ Crash protection (VERY IMPORTANT 🔥)
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED PROMISE:", err);
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});