import React from 'react';
import { motion } from 'framer-motion';
import BookingForm from './BookingForm';

const BookingSection = () => {
    return (
        <section id="book-appointment" className="py-24 relative overflow-hidden bg-white">
            {/* Background elements */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white opacity-40"></div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left content: Inspirational text */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="px-4 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full inline-block mb-4">
                            Appointment Booking · अपॉइंटमेंट बुकिंग
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                            Take the First Step <br />
                            <span className="text-blue-700">Towards Recovery</span>
                        </h2>
                        <p className="text-slate-500 text-lg mb-10 max-w-lg leading-relaxed font-medium">
                            Choose your preferred time slot and schedule a consultation with our expert physiotherapy team today. We provide specialized care for ortho, neuro, and sports recovery.
                        </p>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                    <i className="fa-solid fa-clock"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Quick Scheduling</h4>
                                    <p className="text-sm text-slate-500">Pick a morning or evening slot that fits your routine.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                    <i className="fa-solid fa-video"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Video Consultation</h4>
                                    <p className="text-sm text-slate-500">Available for initial assessments from the comfort of your home.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right content: The Form wrapper */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-white p-8 md:p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100"
                    >
                        <BookingForm />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default BookingSection;
