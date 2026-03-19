const mongoose = require('mongoose');
require('dotenv').config();
const Doctor = require('./models/Doctor');

const doctors = [
    {
        name: "Dr. Piyush Sharma (PT)",
        qualification: "MPT (Ortho & Sports)",
        specialty: "Orthopedic & Sports Physiotherapy",
        designation: "HOD – Dept. of Physiotherapy, Welton Hospital, Jaipur",
        image: "https://placehold.co/400x500?text=Dr.+Piyush+Sharma"
    },
    {
        name: "Dr. Soniya Pathak (PT)",
        qualification: "BPT (CDNT, CCT)",
        specialty: "Physiotherapy",
        designation: "Consultant Physiotherapist",
        image: "https://placehold.co/400x500?text=Dr.+Soniya+Pathak"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");
        
        await Doctor.deleteMany({});
        console.log("Cleared existing doctors.");
        
        await Doctor.insertMany(doctors);
        console.log("Seeded doctor data successfully.");
        
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seedDB();
