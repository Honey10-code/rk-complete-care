import React, { useState, useEffect } from 'react';
import { getDoctors } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fallbackDoctors = [
        {
            _id: 'fallback-1',
            name: 'Dr. Piyush Sharma (PT)',
            qualification: 'MPT (Ortho & Sports)',
            designation: 'HOD – Dept. of Physiotherapy\nWelton Hospital, Jaipur',
            image: '/dr-piyush-sharma.png',
            specialty: 'Orthopaedic & Sports',
            experience: '12+ Years Experience',
            shift: 'Morning 10 AM - 1 PM | Evening 5 PM - 8 PM',
            bio: 'Expert in advanced orthopaedic rehabilitation and sports injury management. Specializes in manual therapy and dry needling.'
        },
        {
            _id: 'fallback-2',
            name: 'Dr. Soniya Pathak (PT)',
            qualification: 'BPT (CDNT, CCT)',
            designation: 'Consultant Physiotherapist',
            image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1974&auto=format&fit=crop',
            specialty: 'Neuro & Pediatric',
            experience: '8+ Years Experience',
            shift: 'Morning 9 AM - 12 PM | Evening 4 PM - 7 PM',
            bio: 'Specialist in neurological rehabilitation and pediatric physiotherapy. Expert in stroke recovery and developmental delays.'
        }
    ];

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await getDoctors();
                setDoctors(data && data.length > 0 ? data : fallbackDoctors);
            } catch {
                setDoctors(fallbackDoctors);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const openModal = (doctor) => {
        setSelectedDoctor(doctor);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
    };

    return (
        <section id="doctors" className="py-24 relative overflow-hidden bg-slate-900 border-t-4 border-blue-700">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="section-badge mx-auto bg-slate-800 border-slate-700 text-blue-400">
                        <i className="fa-solid fa-user-doctor"></i>
                        Our Experts · हमारे विशेषज्ञ
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mt-4">
                        Meet Our <span className="text-blue-500">Specialists</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto mt-4">
                        Highly qualified physiotherapists dedicated to your complete recovery
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center gap-8 flex-wrap">
                        {[1, 2].map(i => (
                            <div key={i} className="w-full max-w-sm bg-slate-800 rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-80 bg-slate-700"></div>
                                <div className="p-8 space-y-3">
                                    <div className="h-5 bg-slate-700 rounded w-3/4 mx-auto"></div>
                                    <div className="h-4 bg-slate-700 rounded w-1/2 mx-auto"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-8">
                        {doctors.map((doc, i) => (
                            <div key={doc._id}
                                className="group w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:bg-slate-800/80 transition-all duration-300 shadow-xl flex flex-col">
                                {/* Image */}
                                <div className="h-80 relative overflow-hidden">
                                    <img
                                        src={doc.image}
                                        alt={doc.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => { e.target.src = 'https://placehold.co/400x320?text=Doctor'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>

                                    {/* Specialty badge */}
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-blue-700 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider">
                                        {doc.specialty || 'Physiotherapy'}
                                    </div>

                                    {/* Exp badge */}
                                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-slate-900/80 backdrop-blur-sm border border-slate-600 rounded-lg text-blue-400 text-[10px] font-black uppercase tracking-wider">
                                        {doc.experience || '8+ Years'}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-8 text-center flex-grow flex flex-col">
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors uppercase">{doc.name}</h3>
                                    <p className="font-bold text-xs mb-3 text-blue-500 uppercase tracking-widest">{doc.qualification}</p>
                                    
                                    <div className="bg-slate-900/50 p-3 rounded-xl mb-6 border border-slate-700/50">
                                        <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-1 opacity-50">Current Shift • शिफ्ट</p>
                                        <p className="text-white text-[11px] font-bold leading-tight">{doc.shift || '10:00 AM - 08:00 PM'}</p>
                                    </div>

                                    <div className="mt-auto flex flex-col gap-3">
                                        <button 
                                            onClick={() => openModal(doc)}
                                            className="w-full py-2.5 border border-slate-600 text-slate-300 rounded-xl font-bold text-xs hover:bg-slate-700 hover:text-white transition-all duration-200 uppercase tracking-widest"
                                        >
                                            View Details • और पढ़ें
                                        </button>
                                        <a href="tel:+918769556475"
                                            className="w-full py-3 bg-blue-700 text-white rounded-xl font-bold text-sm hover:bg-blue-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                                            <i className="fa-solid fa-calendar-check text-[10px]"></i>
                                            Book Consultation
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Read More Modal */}
            <AnimatePresence>
                {isModalOpen && selectedDoctor && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]"
                        >
                            {/* Modal Close */}
                            <button 
                                onClick={closeModal}
                                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-600 transition-all border border-slate-700"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>

                            {/* Left: Doc Image */}
                            <div className="lg:w-2/5 relative h-64 lg:h-auto overflow-hidden">
                                <img 
                                    src={selectedDoctor.image} 
                                    alt={selectedDoctor.name}
                                    className="w-full h-full object-cover object-top"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:bg-gradient-to-r"></div>
                            </div>

                            {/* Right: Info */}
                            <div className="lg:w-3/5 p-8 lg:p-12 overflow-y-auto">
                                <div className="section-badge bg-blue-900/30 text-blue-400 border-blue-800/50 mb-4">
                                    <i className="fa-solid fa-award"></i>
                                    Expert Physiotherapist
                                </div>
                                <h2 className="text-3xl font-black text-white mb-1 uppercase lg:text-4xl">{selectedDoctor.name}</h2>
                                <p className="text-blue-500 font-bold tracking-widest text-sm uppercase mb-8">{selectedDoctor.qualification}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Qualifications</p>
                                        <p className="text-white text-sm font-bold leading-relaxed">{selectedDoctor.designation}</p>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Clinical Shift</p>
                                        <p className="text-white text-sm font-bold">{selectedDoctor.shift || '10:00 AM - 08:00 PM'}</p>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Professional Overview</p>
                                    <p className="text-slate-300 leading-relaxed italic border-l-4 border-blue-600 pl-4 py-2">
                                        {selectedDoctor.bio || "Dedicated to providing expert physiotherapy care through advanced diagnostic techniques and personalized treatment protocols."}
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 mt-12">
                                    <a href="tel:+918769556475" className="flex-1 py-4 bg-blue-700 text-white rounded-2xl font-black text-sm text-center uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20">
                                        Call For Appointment
                                    </a>
                                    <button 
                                        onClick={() => { closeModal(); window.location.href = '#booking'; }}
                                        className="flex-1 py-4 border border-slate-600 text-white rounded-2xl font-black text-sm text-center uppercase tracking-widest hover:bg-slate-800 transition-all"
                                    >
                                        Book Online
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Doctors;
