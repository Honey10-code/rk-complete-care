import React from 'react';
import Navbar from '../components/Navbar';
import BookingForm from '../components/BookingForm';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const Booking = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            <Helmet>
                <title>Book Appointment | RK The Complete Care</title>
                <meta name="description" content="Book an appointment with Dr. Piyush Sharma at RK The Complete Care. Select your preferred time slot for physiotherapy consultation." />
                <link rel="canonical" href="https://rkphysiocare.in/booking" />
                <meta property="og:title" content="Book Appointment | RK The Complete Care" />
                <meta property="og:description" content="Book an appointment with Dr. Piyush Sharma at RK The Complete Care. Select your preferred time slot for physiotherapy consultation." />
                <meta property="og:url" content="https://rkphysiocare.in/booking" />
            </Helmet>
            <Navbar />
            
            <div className="pt-24 pb-12 px-4 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="container mx-auto max-w-6xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row border border-slate-100"
                >
                    {/* Left Column: Inspirational Image */}
                    <div className="lg:w-1/2 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-900/40 z-10"></div>
                        <img
                            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop"
                            alt="Physiotherapy & Wellness"
                            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => { e.target.src = 'https://placehold.co/600x800?text=Physiotherapy+Care'; }}
                        />
                        <div className="absolute bottom-0 left-0 w-full p-10 z-20 bg-gradient-to-t from-blue-900/90 to-transparent text-white">
                            <h3 className="text-3xl font-black mb-2 text-white">Recover Stronger</h3>
                            <p className="text-blue-100 text-lg">"Movement is medicine. Let us help you get back to your best self."</p>

                            <div className="mt-6 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg">
                                    <i className="fa-solid fa-phone text-white"></i>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest opacity-70 font-bold text-blue-100">24/7 Support</p>
                                    <p className="font-mono text-xl font-black text-white">+91 8769556475</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="lg:w-1/2 p-8 lg:p-12">
                        <BookingForm />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Booking;
