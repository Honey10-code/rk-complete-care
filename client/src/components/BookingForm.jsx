import React, { useState, useEffect } from 'react';
import { bookAppointment, getBookedSlots, createPaymentOrder, verifyPayment } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const BookingForm = () => {
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
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [bookingSummary, setBookingSummary] = useState(null);
    const [slotDropdownOpen, setSlotDropdownOpen] = useState(false);

    // Fetch booked slots when date changes
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
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
            const response = await bookAppointment(data);
            const savedAppointment = response;

            setBookingSummary(savedAppointment);
            setShowSuccessModal(true);
            setStatus('success');

            // Generate WhatsApp Link
            if (formData.whatsappNotify) {
                const consultationType = data.videoConsultation ? "Video Consultation" : "Clinic Visit";
                const message = `
*New Appointment Request*
------------------------
*ID:* ${savedAppointment.appointmentId}
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

            // Reset form but don't clear status/summary yet as we have a modal now
            setFormData({
                patientName: '', age: '', gender: 'Male', phone: '', date: '', slot: 'Morning (9AM–1PM)',
                problem: '', clinicVisit: true, videoConsultation: false, notes: '', whatsappNotify: false
            });

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
            const order = await createPaymentOrder({ amount: 500 }); // ₹500 for online

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
                                amount: 500
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
        <div id="booking" className="w-full">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-800 mb-2">Book Appointment</h2>
                <p className="text-slate-500 font-medium">Fill in the details below to schedule your consultation.</p>
            </div>

            <AnimatePresence mode="wait">
                {status === 'success' && !showSuccessModal && (
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
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all bg-white/70 hover:bg-white appearance-none"
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
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all bg-white/70 hover:bg-white"
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
                                                                className={`w-full flex items-center justify-between p-4 transition-all duration-300 ${isSelected ? "bg-blue-50" : "hover:bg-slate-50"
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all bg-white/70 hover:bg-white resize-none"
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

            {/* Success Details Modal */}
            <AnimatePresence>
                {showSuccessModal && bookingSummary && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto pt-10 pb-10"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl relative border border-white/20 my-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Success Header with Glassmorphism Overlay */}
                            <div className="bg-emerald-600 pt-16 pb-12 px-10 text-center text-white relative rounded-t-[2.5rem] overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-95"></div>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
                                <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-2xl relative z-10 rotate-3">
                                    <i className="fa-solid fa-check-double text-4xl text-white drop-shadow-lg"></i>
                                </div>
                                <h3 className="text-4xl md:text-5xl font-black mb-2 tracking-tight relative z-10 drop-shadow-sm">Confirmed!</h3>
                                <p className="text-emerald-50/70 font-black tracking-[0.2em] uppercase text-[10px] relative z-10">RK · The Complete Care</p>
                            </div>

                            <div className="p-8 md:p-12">
                                <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Appointment ID</p>
                                        <p className="text-xl font-black text-blue-600 tabular-nums tracking-tighter">
                                            {bookingSummary.appointmentId}
                                        </p>
                                    </div>
                                    <div className="text-right space-y-1.5">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">STATUS</p>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-200/50">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                                            Pending
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="grid grid-cols-2 gap-y-10 gap-x-12">
                                        {/* Patient Details */}
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Patient Name</p>
                                            <div className="font-bold text-slate-800 flex items-center gap-3 text-[15px]">
                                                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 text-xs">
                                                    <i className="fa-solid fa-user"></i>
                                                </div>
                                                <span className="truncate max-w-[120px]">{bookingSummary.patientName}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Phone Number</p>
                                            <div className="font-bold text-slate-800 flex items-center justify-end gap-3 text-[15px]">
                                                <span>{bookingSummary.phone}</span>
                                                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 text-xs">
                                                    <i className="fa-solid fa-phone"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Age & Gender</p>
                                            <div className="font-bold text-slate-700 flex items-center gap-2 px-1">
                                                <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-black">{bookingSummary.age}Y</span>
                                                <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-black uppercase">{bookingSummary.gender}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Schedule</p>
                                            <p className="font-black text-blue-700 flex items-center justify-end gap-2 text-sm italic tracking-tight underline decoration-blue-200 underline-offset-4">
                                                {new Date(bookingSummary.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                <i className="fa-solid fa-calendar-check text-blue-300 text-xs translate-y-[-1px]"></i>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Slot Detail */}
                                    <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-12 translate-x-12 group-hover:bg-blue-500/10 transition-colors"></div>
                                        <div className="flex items-center gap-5 relative z-10">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-blue-600 border border-slate-50 rotate-[-4deg] group-hover:rotate-0 transition-transform">
                                                <i className="fa-solid fa-clock-rotate-left text-xl"></i>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Time Slot</p>
                                                <p className="font-black text-slate-900 uppercase tracking-tight text-xl leading-none">{bookingSummary.slot}</p>
                                            </div>
                                        </div>
                                        <div className="px-5 py-2 bg-blue-600/5 rounded-full border border-blue-600/10 hidden sm:block relative z-10">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic">Selected</span>
                                        </div>
                                    </div>

                                    {/* Problem Description - Fixed spacing and quote appearance */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chief Complaint</p>
                                        <div className="p-7 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-slate-600 text-[16px] italic relative group overflow-hidden">
                                            <div className="absolute top-0 left-0 w-2 h-full bg-blue-100 group-hover:bg-blue-300 transition-colors"></div>
                                            <p className="relative z-10 leading-relaxed font-semibold pl-4 pr-2">
                                                <span className="text-blue-300 text-3xl font-serif mr-2 opacity-50">"</span>
                                                {bookingSummary.problem || "Initial consultation for recovery assessment."}
                                                <span className="text-blue-300 text-3xl font-serif ml-2 opacity-50">"</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowSuccessModal(false);
                                        setStatus(null);
                                        setBookingSummary(null);
                                    }}
                                    className="w-full mt-14 py-6 bg-slate-900 text-white rounded-[2rem] font-black shadow-2xl shadow-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all text-xl flex items-center justify-center gap-5 group overflow-hidden relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="relative z-10">Dismiss Details</span>
                                    <i className="fa-solid fa-circle-xmark text-lg group-hover:rotate-90 transition-transform relative z-10"></i>
                                </button>
                                
                                <div className="flex items-center justify-center gap-3 mt-10 opacity-70">
                                    <div className="relative">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 absolute inset-0 animate-ping"></span>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        Confirmation sent to WhatsApp
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BookingForm;
