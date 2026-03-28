const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const ClinicInfo = require('../models/ClinicInfo');

// Helper to get active slots for a specific date
const getActiveSlots = async (date) => {
    const day = new Date(date).toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
    const info = await ClinicInfo.findOne();
    
    // Default Fallback
    const defaults = ["Morning (9AM–1PM)", "Evening (4PM–8PM)"];
    
    if (info && info.dayWiseSlots && info.dayWiseSlots[day] && info.dayWiseSlots[day].length > 0) {
        return info.dayWiseSlots[day];
    }
    
    return defaults;
};

// GET full slots for a specific date (based on admin-set capacity)
router.get('/booked-slots', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ message: "Date is required" });

        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        // Fetch limit and visibility settings from ClinicInfo
        const info = await ClinicInfo.findOne() || { maxBookingsPerSlot: 10, showSlotAvailability: false };
        const limit = (info.maxBookingsPerSlot === undefined) ? 10 : info.maxBookingsPerSlot;
        const showAvailability = !!info.showSlotAvailability;

        // Identify active slots for this specific day
        const availableSlots = await getActiveSlots(date);

        // Group by slot and count
        const counts = await Appointment.aggregate([
            { $match: { date: { $gte: start, $lte: end } } },
            { $group: { _id: "$slot", count: { $sum: 1 } } }
        ]);

        // Map counts for the frontend
        const slotCounts = {};
        counts.forEach(c => { slotCounts[c._id] = c.count; });

        // Identify only truly "Full" slots (if limit > 0)
        let fullSlots = [];
        if (limit > 0) {
            fullSlots = counts.filter(c => c.count >= limit).map(c => c._id);
        }

        res.json({
            availableSlots,
            fullSlots,
            slotCounts,
            maxCapacity: limit,
            showAvailability
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET all appointments (with optional search)
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { patientName: { $regex: search, $options: 'i' } },
                    { appointmentId: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const appointments = await Appointment.find(query).sort({ date: -1, createdAt: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new appointment
router.post('/', async (req, res) => {
    try {
        // Generate Appointment ID
        const today = new Date();
        const year = today.getFullYear();

        // Find last appointment of the current year to increment sequence
        const lastAppointment = await Appointment.findOne({
            appointmentId: { $regex: `^RK-${year}-` }
        }).sort({ appointmentId: -1 });

        let sequence = 1;
        if (lastAppointment && lastAppointment.appointmentId) {
            const parts = lastAppointment.appointmentId.split('-');
            sequence = parseInt(parts[2]) + 1;
        }

        const appointmentId = `RK-${year}-${String(sequence).padStart(4, '0')}`;

        const { patientName, phone, date, slot, age, gender, problem, clinicVisit, videoConsultation, notes } = req.body;

        // 🛑 Backend Enforcement: Check valid slot for the day
        const activeSlots = await getActiveSlots(date);
        if (!activeSlots.includes(slot)) {
            return res.status(400).json({ message: "Invalid slot selected for this day." });
        }

        // 🛑 Backend Enforcement: Check Capacity
        const info = await ClinicInfo.findOne() || { maxBookingsPerSlot: 10 };
        const limit = (info.maxBookingsPerSlot === undefined) ? 10 : info.maxBookingsPerSlot;

        if (limit > 0) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);

            const count = await Appointment.countDocuments({
                date: { $gte: start, $lte: end },
                slot: slot
            });

            if (count >= limit) {
                return res.status(400).json({ message: "This slot is no longer available. Please select another time." });
            }
        }

        const appointment = new Appointment({
            appointmentId,
            patientName,
            age,
            gender,
            phone,
            date,
            slot,
            problem,
            clinicVisit,
            videoConsultation,
            notes
        });

        const newAppointment = await appointment.save();
        res.status(201).json(newAppointment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH update ALL appointments for a patient (by phone)
router.patch('/patient/:phone', async (req, res) => {
    try {
        const { phone: oldPhone } = req.params;
        const { patientName, age, gender, phone: newPhone } = req.body;

        const updateData = {};
        if (patientName) updateData.patientName = patientName;
        if (age) updateData.age = age;
        if (gender) updateData.gender = gender;
        if (newPhone) updateData.phone = newPhone;

        const result = await Appointment.updateMany({ phone: oldPhone }, { $set: updateData });

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'No records found for this patient' });
        }

        res.json({ message: `Updated ${result.modifiedCount} records for patient`, result });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE all appointments for a patient (by phone)
router.delete('/patient/:phone', async (req, res) => {
    try {
        const { phone } = req.params;
        const result = await Appointment.deleteMany({ phone });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No records found for this patient' });
        }

        res.json({ message: `Deleted ${result.deletedCount} records for patient`, result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH update appointment details
router.patch('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        const fieldsToUpdate = [
            'patientName', 'age', 'gender', 'phone',
            'date', 'slot', 'time', 'problem',
            'clinicVisit', 'videoConsultation', 'notes', 'status'
        ];

        fieldsToUpdate.forEach(field => {
            if (req.body[field] !== undefined) {
                appointment[field] = req.body[field];
            }
        });

        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE appointment
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Appointment.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Appointment not found' });
        res.json({ message: 'Appointment deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
