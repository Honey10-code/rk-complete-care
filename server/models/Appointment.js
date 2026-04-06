const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    appointmentId: {
        type: String,
        unique: true
    },
    patientName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    slot: {
        type: String, // e.g., "Morning", "Evening"
        required: true
    },
    time: {
        type: String, // Specific time if needed, or just part of slot
        required: false
    },
    doctor: {
        type: String,
        default: 'Dr. RK'
    },
    problem: {
        type: String,
        required: true
    },
    clinicVisit: {
        type: Boolean,
        default: true
    },
    address: {
        type: String // We'll keep this as optional to preserve previous addresses
    },
    notes: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    videoConsultation: {
        type: Boolean,
        default: false
    },
    dob: {
        type: Date
    },
    medications: [{
        name: String,
        timing: String,
        dosage: String
    }],
    followUpDate: {
        type: Date
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'N/A'],
        default: 'N/A' // N/A for clinic visits
    },
    razorpayOrderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    },
    razorpaySignature: {
        type: String
    },
    amount: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
