const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ClinicInfo = require('./models/ClinicInfo');

dotenv.config();

const updateHours = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const filter = {}; // We only have one record
        const update = {
            $set: {
                'openingHours.morning': '09:00 AM - 01:00 PM',
                'openingHours.evening': '04:00 PM - 08:00 PM',
                'openingHours.sunday': '09:00 AM - 12:00 PM'
            }
        };

        const result = await ClinicInfo.updateOne(filter, update);
        console.log('Update result:', result);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (err) {
        console.error('Error updating hours:', err);
        process.exit(1);
    }
};

updateHours();
