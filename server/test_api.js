const axios = require('axios');
(async () => {
    try {
        const res = await axios.post('http://localhost:5001/api/appointments', {
            patientName: 'Test Patient',
            age: 25,
            gender: 'Male',
            phone: '1234567890',
            date: '2026-04-03',
            slot: 'Morning (9AM–1PM)',
            problem: 'Back pain',
            clinicVisit: true,
            videoConsultation: false,
            notes: ''
        });
        console.log("SUCCESS:", res.data);
    } catch (e) {
        console.log("ERROR DATA:", e.response?.data || e.message);
    }
})();
