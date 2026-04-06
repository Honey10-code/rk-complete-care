const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const Broadcast = require('../models/Broadcast');
const ClinicInfo = require('../models/ClinicInfo');

const initScheduler = (app) => {
    // 🎂 1. BIRTHDAY REMINDERS (Daily at 9:00 AM)
    cron.schedule('0 9 * * *', async () => {
        const info = await ClinicInfo.findOne();
        if (!info?.automations?.birthday) return console.log('🎂 Birthday automation disabled in settings.');

        console.log('🎂 Checking for patient birthdays...');
        const today = new Date();
        const month = today.getMonth() + 1;
        const date = today.getDate();

        // MongoDB aggregation to find matching DOB (month & day)
        const birthdays = await Appointment.aggregate([
            {
                $project: {
                    patientName: 1, phone: 1, dob: 1,
                    month: { $month: "$dob" },
                    day: { $dayOfMonth: "$dob" }
                }
            },
            { $match: { month, day: date } }
        ]);

        if (birthdays.length > 0) {
            console.log(`🎉 Found ${birthdays.length} birthdays today!`);
            // Create a Broadcast log for reporting
            const b = new Broadcast({
                title: "Birthday Auto-Wishes",
                message: "Happy Birthday! Wishing you a day filled with happiness and a year filled with joy.",
                target: "Custom",
                autoType: "Birthday",
                status: "Sent",
                metrics: { total: birthdays.length, sent: birthdays.length, failed: 0 }
            });
            await b.save();
        }
    });

    // 🔬 2. SCHEDULED BROADCASTS (Every 15 minutes)
    cron.schedule('*/15 * * * *', async () => {
        console.log('⌛ Checking for scheduled broadcasts...');
        const now = new Date();
        const pending = await Broadcast.find({
            status: "Pending",
            scheduledAt: { $lte: now }
        });

        for (const b of pending) {
            b.status = "Processing";
            await b.save();

            // Simulate sending...
            console.log(`🚀 Processing broadcast: ${b.title}`);
            setTimeout(async () => {
                b.status = "Sent";
                b.sentAt = new Date();
                await b.save();
                
                // Notify via Socket if io is available
                const io = app.get('io');
                if (io) {
                    io.to('admin-room').emit('broadcast-status-update', b);
                }
            }, 2000);
        }
    });

    // 🩺 3. FOLLOW-UP REMINDERS (Daily at 10:00 AM)
    cron.schedule('0 10 * * *', async () => {
        const info = await ClinicInfo.findOne();
        if (!info?.automations?.followUp) return console.log('🩺 Follow-up automation disabled.');

        console.log('🩺 Checking for follow-up reminders...');
        const today = new Date();
        today.setHours(0,0,0,0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const followUps = await Appointment.find({
            followUpDate: { $gte: today, $lt: tomorrow }
        });

        if (followUps.length > 0) {
            console.log(`🩺 Found ${followUps.length} follow-ups today.`);
            const b = new Broadcast({
                title: "Follow-up Reminders",
                message: "This is a reminder for your scheduled follow-up appointment today. We look forward to seeing you!",
                autoType: "Followup",
                status: "Sent",
                metrics: { total: followUps.length, sent: followUps.length, failed: 0 }
            });
            await b.save();
        }
    });

    console.log('⏰ Scheduler initialized successfully');
};

module.exports = { initScheduler };
