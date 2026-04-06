import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { bookAppointment, getBookedSlots, createPaymentOrder, verifyPayment } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const Booking = () => {
    const [formData, setFormData] = useState({
        patientName: '',
        age: '',
        gender: 'Male',
        phone: '',
        date: '',
        slot: 'Morning (9AM–1PM)',
        problem: '',
        clinicVisit: true,
        videoConsultation: false,
        notes: '',
        whatsappNotify: false
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [bookedSlots, setBookedSlots] = useState({
        availableSlots: [],
        fullSlots: [],
        slotCounts: {},
        maxCapacity: 10,
        showAvailability: false
    });
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [slotDropdownOpen, setSlotDropdownOpen] = useState(false);

    // Fetch booked slots when date changes
    const today = new Date().toISOString().split('T')[0];

    React.useEffect(() => {
        if (formData.date) {
            getBookedSlots(formData.date)
                .then(res => {
                    setBookedSlots(res);
                    // Automatically select first available slot if current one is invalid for this day
                    if (res.availableSlots && res.availableSlots.length > 0) {
                        if (!res.availableSlots.includes(formData.slot)) {
                            setFormData(prev => ({ ...prev, slot: res.availableSlots[0] }));
                        }
                    }
                })
                .catch(err => console.error("Error fetching slots", err));
        }
    }, [formData.date]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const processSubmission = async (data = formData) => {
        setLoading(true);
        setStatus(null);

        try {
            await bookAppointment(data);

            setStatus('success');

            // Generate WhatsApp Link
            if (formData.whatsappNotify) {
                const consultationType = data.videoConsultation ? "Video Consultation" : "Clinic Visit";
                const message = `
*New Appointment Request*
------------------------
*Name:* ${data.patientName}
*Phone:* ${data.phone}
*Date:* ${data.date}
*Slot:* ${data.slot}
*Type:* ${consultationType}
*Problem:* ${data.problem}
------------------------
Please confirm.
Regards,
RK - The Complete Care Physiotherapy Centre`;
                window.open(`https://wa.me/918769556475?text=${encodeURIComponent(message)}`, '_blank');
            }

            setTimeout(() => {
                setFormData({
                    patientName: '', age: '', gender: 'Male', phone: '', date: '', slot: 'Morning (9AM–1PM)',
                    problem: '', clinicVisit: true, videoConsultation: false, notes: '', whatsappNotify: false
                });
                setStatus(null);
            }, 3000);

        } catch (err) {
            console.error(err);
            setErrorMessage(err.response?.data?.message || 'Something went wrong. Please try again or call us.');
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            // 1. Create Order on Backend
            const order = await createPaymentOrder({ amount: 200 }); // ₹200 for online
            
            if (!order || !order.id) {
                throw new Error("Failed to create payment order");
            }

            // 2. Configure Razorpay Options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SWfjeQTs0VReYV',
                amount: order.amount,
                currency: order.currency,
                name: "RK The Complete Care",
                description: "Online Consultation Fee",
                image: "/logo.png",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment on Backend
                        const verification = await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verification.signatureValid) {
                            // 4. Finalize Booking
                            await processSubmission({
                                ...formData,
                                paymentStatus: 'Completed',
                                razorpayOrderId: response.razorpay_order_id,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpaySignature: response.razorpay_signature,
                                amount: 200
                            });
                        } else {
                            alert("Payment verification failed. Please contact support.");
                        }
                    } catch (err) {
                        console.error("Verification Error:", err);
                        alert("Error verifying payment.");
                    }
                },
                prefill: {
                    name: formData.patientName,
                    contact: formData.phone
                },
                theme: {
                    color: "#2563eb"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
            });
            rzp.open();

        } catch (err) {
            console.error("Payment Initiation Error:", err);
            const detailedError = err.response?.data?.error || err.response?.data?.description || err.response?.data?.message || err.message || 'Payment service unavailable. Please try again.';
            setErrorMessage(detailedError);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.videoConsultation) {
            handlePayment();
        } else {
            processSubmission(formData);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen pt-24 pb-12 px-4 bg-slate-50 flex items-center justify-center">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="container mx-auto max-w-6xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-slate-100"
                >
                    <Helmet>
                        <title>Book Appointment | RK The Complete Care</title>
                        <meta name="description" content="Book an appointment with Dr. Piyush Sharma at RK The Complete Care. Select your preferred time slot for physiotherapy consultation." />
                    </Helmet>

                    {/* Left Column: Inspirational/Exercise Image */}
                    <div className="lg:w-1/2 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-900/40 z-10"></div>
                        <img
                            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop"
                            alt="Physiotherapy & Wellness"
                            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => { e.target.src = 'https://placehold.co/600x800?text=Physiotherapy+Care'; }}
                        />
                        <div className="absolute bottom-0 left-0 w-full p-10 z-20 bg-gradient-to-t from-blue-900/90 to-transparent text-white">
                            <h3 className="text-3xl font-black mb-2">Recover Stronger</h3>
                            <p className="text-blue-100 text-lg">"Movement is medicine. Let us help you get back to your best self."</p>

                            <div className="mt-6 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
                                    <i className="fa-solid fa-phone text-white"></i>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest opacity-70 font-bold">24/7 Support</p>
                                    <p className="font-mono text-xl font-black">+91 8769556475</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div id="booking" className="lg:w-1/2 p-8 lg:p-12">
                        <div className="mb-8">
                            <h2 className="text-3xl font-black text-slate-800 mb-2">Book Appointment</h2>
                            <p className="text-slate-500 font-medium">Fill in the details below to schedule your consultation.</p>
                        </div>

                        <AnimatePresence>
                            {status === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3"
                                >
                                    <i className="fa-solid fa-circle-check text-xl"></i>
                                    <div>
                                        <p className="font-bold">Booking Successful!</p>
                                        <p className="text-sm">We will contact you shortly to confirm.</p>
                                    </div>
                                </motion.div>
                            )}
                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3"
                                >
                                    <i className="fa-solid fa-circle-exclamation text-xl"></i>
                                    <div>
                                        <p className="font-bold">Booking Failed</p>
                                        <p className="text-sm">{errorMessage || 'Something went wrong. Please try again or call us.'}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Personal Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Patient Name</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-user absolute left-4 top-3.5 text-gray-400"></i>
                                        <input
                                            required
                                            type="text"
                                            name="patientName"
                                            value={formData.patientName}
                                            onChange={handleChange}
                                            placeholder="Full Name"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all bg-white hover:border-slate-300"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Phone Number</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-phone absolute left-4 top-3.5 text-gray-400"></i>
                                        <input
                                            required
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="10-digit number"
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all bg-white hover:border-slate-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Age</label>
                                    <input
                                        required
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="Age"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all bg-white hover:border-slate-300"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue focus:ring-4 focus:ring-blue-50 transition-all bg-white/70 hover:bg-white appearance-none"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {/* Scheduling */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Date</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-calendar absolute left-4 top-3.5 text-gray-400"></i>
                                        <input
                                            required
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            min={today}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue focus:ring-4 focus:ring-blue-50 transition-all bg-white/70 hover:bg-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">SELECT A SLOT</label>
                                    <div className="relative">
                                        {!formData.date ? (
                                            <div className="py-3 px-4 bg-slate-50 border border-slate-100 rounded-xl text-center">
                                                <p className="text-xs text-slate-400 italic flex items-center justify-center gap-2">
                                                    <i className="fa-solid fa-calendar-day"></i> Select date first
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                {/* Custom Dropdown Trigger */}
                                                <button
                                                    type="button"
                                                    onClick={() => setSlotDropdownOpen(!slotDropdownOpen)}
                                                    className="w-full flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl hover:border-blue-200 transition-all text-left shadow-sm group"
                                                >
                                                    {(() => {
                                                        const s = formData.slot;
                                                        const matches = s.match(/^(.*?)\s*\((.*?)\)$/);
                                                        const label = matches ? matches[1] : (s.includes("AM") || s.includes("PM") ? "Session" : s);
                                                        const time = matches ? matches[2] : (s.includes("AM") || s.includes("PM") ? s : "");
                                                        const isMorning = s.includes("Morning") || s.includes("AM") || (s.includes("9") && !s.includes("PM"));
                                                        const isSunday = new Date(formData.date).getDay() === 0;

                                                        return (
                                                            <>
                                                                <div className="flex items-center gap-3">
                                                                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shadow-sm transition-colors ${isSunday ? "bg-blue-50 text-blue-600" : isMorning ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"}`}>
                                                                        <i className={`fa-solid ${isSunday ? "fa-calendar-check" : isMorning ? "fa-sun" : "fa-moon"}`}></i>
                                                                    </span>
                                                                    <div>
                                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Select A Slot</p>
                                                                        <span className="font-black text-blue-600 text-sm tracking-tight leading-none uppercase">{label}</span>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="flex items-center gap-4 flex-shrink-0 ml-auto pl-4">
                                                                    <div className="text-right">
                                                                        <p className="text-xs font-black text-slate-400 tabular-nums uppercase whitespace-nowrap">{time}</p>
                                                                        {bookedSlots.showAvailability && bookedSlots.maxCapacity > 0 && (
                                                                            <p className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter mt-0.5">
                                                                                {bookedSlots.maxCapacity - (bookedSlots.slotCounts?.[s] || 0)} FREE
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                    <i className={`fa-solid fa-chevron-down text-slate-300 text-xs transition-transform duration-300 ${slotDropdownOpen ? 'rotate-180' : ''}`}></i>
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </button>

                                                {/* Dropdown Menu */}
                                                <AnimatePresence>
                                                    {slotDropdownOpen && (
                                                        <>
                                                            <div className="fixed inset-0 z-10" onClick={() => setSlotDropdownOpen(false)}></div>
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-20 overflow-hidden"
                                                            >
                                                                {/* Sunday Special Message */}
                                                                {new Date(formData.date).getDay() === 0 && (
                                                                    <div className="mx-4 mt-4 p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center gap-3 animate-pulse">
                                                                        <i className="fa-solid fa-calendar-check text-blue-500"></i>
                                                                        <p className="text-[10px] font-black text-blue-700 uppercase tracking-wider">Special Sunday Timing</p>
                                                                    </div>
                                                                )}

                                                                {(bookedSlots.availableSlots || []).map(slot => {
                                                                    const isFull = (bookedSlots.fullSlots || []).includes(slot);
                                                                    if (isFull) return null;

                                                                    const count = (bookedSlots.slotCounts || {})[slot] || 0;
                                                                    const capacity = bookedSlots.maxCapacity || 0;
                                                                    const showCount = bookedSlots.showAvailability && capacity > 0;
                                                                    const isSelected = formData.slot === slot;

                                                                    // Extract label and time
                                                                    const matches = slot.match(/^(.*?)\s*\((.*?)\)$/);
                                                                    const label = matches ? matches[1] : (slot.includes("AM") || slot.includes("PM") ? "Special" : slot);
                                                                    const timeText = matches ? matches[2] : (slot.includes("AM") || slot.includes("PM") ? slot : "");
                                                                    const isMorning = slot.includes("Morning") || slot.includes("AM") || (slot.includes("9") && !slot.includes("PM"));

                                                                    return (
                                                                        <button
                                                                            key={slot}
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setFormData({ ...formData, slot });
                                                                                setSlotDropdownOpen(false);
                                                                            }}
                                                                            className={`w-full flex items-center justify-between p-4 transition-all duration-300 ${
                                                                                isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                                                                            }`}
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${isMorning ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"}`}>
                                                                                    <i className={`fa-solid ${isMorning ? "fa-sun" : "fa-moon"} text-sm`}></i>
                                                                                </div>
                                                                                <div>
                                                                                    <span className={`text-sm font-black uppercase tracking-tight ${isSelected ? "text-blue-600" : "text-slate-800"}`}>
                                                                                        {label}
                                                                                    </span>
                                                                                    <p className="text-[10px] font-bold text-slate-400 -mt-0.5">
                                                                                        {isMorning ? "Daylight Session" : "Evening Care"}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            <div className="flex flex-col items-end flex-shrink-0 ml-4">
                                                                                <span className="text-xs font-black text-blue-600 tabular-nums uppercase whitespace-nowrap tracking-tight">{timeText}</span>
                                                                                {showCount && (
                                                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-1">
                                                                                        {capacity - count} {capacity - count === 1 ? "Slot" : "Slots"} Left
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </button>
                                                                    );
                                                                })}
                                                                {(bookedSlots.availableSlots || []).length > 0 && (bookedSlots.availableSlots || []).every(s => (bookedSlots.fullSlots || []).includes(s)) && (
                                                                    <div className="p-6 text-center text-slate-400">
                                                                        <i className="fa-solid fa-calendar-xmark text-2xl mb-2 block opacity-20"></i>
                                                                        <p className="text-xs font-bold">All slots full for this date</p>
                                                                    </div>
                                                                )}
                                                                {(bookedSlots.availableSlots || []).length === 0 && (
                                                                    <div className="p-6 text-center text-slate-400">
                                                                        <i className="fa-solid fa-calendar-xmark text-2xl mb-2 block opacity-20"></i>
                                                                        <p className="text-xs font-bold">No slots configured for this day</p>
                                                                    </div>
                                                                )}
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 ml-1">Problem Description</label>
                                <textarea
                                    name="problem"
                                    value={formData.problem}
                                    onChange={handleChange}
                                    placeholder="Briefly describe your pain or issue..."
                                    rows="2"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-blue focus:ring-4 focus:ring-blue-50 transition-all bg-white/70 hover:bg-white resize-none"
                                ></textarea>
                            </div>

                            {/* Extras */}
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col sm:flex-row gap-4 sm:gap-8">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            name="clinicVisit"
                                            checked={formData.clinicVisit}
                                            onChange={(e) => {
                                                handleChange(e);
                                                if (e.target.checked) setFormData(p => ({ ...p, videoConsultation: false }));
                                            }}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-blue-600 checked:bg-blue-600 group-hover:border-blue-600"
                                        />
                                        <i className="fa-solid fa-check absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 text-white text-xs peer-checked:opacity-100"></i>
                                    </div>
                                    <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors"><i className="fa-solid fa-stethoscope mr-2 text-blue-600"></i>Clinic Visit</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            name="videoConsultation"
                                            checked={formData.videoConsultation}
                                            onChange={(e) => {
                                                handleChange(e);
                                                if (e.target.checked) setFormData(p => ({ ...p, clinicVisit: false }));
                                            }}
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-purple-600 checked:bg-purple-600 group-hover:border-purple-600"
                                        />
                                        <i className="fa-solid fa-video absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 text-white text-xs peer-checked:opacity-100"></i>
                                    </div>
                                    <span className="font-medium text-gray-700 group-hover:text-purple-600 transition-colors">Video Consultation</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <><i className="fa-solid fa-circle-notch fa-spin"></i> Processing...</>
                                ) : (
                                    <>Book Appointment <i className="fa-solid fa-arrow-right"></i></>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-2">
                                <input
                                    type="checkbox"
                                    name="whatsappNotify"
                                    checked={formData.whatsappNotify}
                                    onChange={handleChange}
                                    className="rounded text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                                />
                                <span className="text-xs text-slate-500 font-bold">Get confirmation via <span className="text-emerald-600"><i className="fa-brands fa-whatsapp"></i> WhatsApp</span></span>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
            {/* Mock Payment Modal */}
            <AnimatePresence>
                {showPaymentModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative"
                        >
                            <button onClick={() => setShowPaymentModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 text-2xl">
                                    <i className="fa-solid fa-video"></i>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800">Video Consult</h3>
                                <p className="text-slate-500 text-sm mt-1">Please pay the consultation fee to confirm your slot.</p>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-600 font-medium text-sm">Patient Name</span>
                                    <span className="font-bold text-slate-800 text-sm">{formData.patientName || "Name"}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-slate-600 font-medium text-sm">Date & Time</span>
                                    <span className="font-bold text-slate-800 text-sm">{formData.date} - {formData.slot.split(" ")[0]}</span>
                                </div>
                                <div className="w-full h-px bg-slate-200 my-3"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-800 font-bold">Total Amount</span>
                                    <span className="font-black text-xl text-blue-600">₹200</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    processSubmission();
                                }}
                                className="w-full py-4 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-lg flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-lock text-sm"></i> Pay Securely
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Booking;
