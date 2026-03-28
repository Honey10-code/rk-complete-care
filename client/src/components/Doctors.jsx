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
            qualification: 'MPT (Ortho & Sports), MIAP',
            designation: 'Chief Physiotherapist & Head - RK The Complete Care',
            image: '/dr-piyush-sharma.png',
            specialty: 'Orthopaedic & Sports',
            experience: '12+ Years Experience',
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
        <section id="doctors" className="py-24 relative overflow-hidden bg-white">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="section-badge mx-auto bg-blue-50 border-blue-100 text-blue-700">
                        <i className="fa-solid fa-user-doctor"></i>
                        Our Experts · हमारे विशेषज्ञ
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4">
                        Meet Our <span className="text-blue-700">Specialists</span>
                    </h2>
                </div>

                {loading ? (
                    <div className="flex justify-center gap-8 flex-wrap">
                        {[1, 2].map(i => (
                            <div key={i} className="w-full max-w-2xl bg-white border border-slate-100 rounded-2xl overflow-hidden animate-pulse h-64"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
                        {doctors.map((doc) => (
                            <motion.div 
                                key={doc._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col sm:flex-row relative"
                            >
                                {/* Left Side: Image */}
                                <div className="sm:w-1/3 h-64 sm:h-auto relative overflow-hidden bg-slate-50">
                                    <img
                                        src={doc.image}
                                        alt={doc.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => { e.target.src = 'https://placehold.co/400x500?text=Doctor'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 hidden sm:block"></div>
                                </div>

                                {/* Right Side: Details */}
                                <div className="sm:w-2/3 p-8 flex flex-col items-center justify-center text-center">
                                    <div className="w-full">
                                        <h3 className="text-2xl font-black text-blue-900 mb-2 tracking-tight">
                                            {doc.name}
                                        </h3>
                                        
                                        {/* Divider Line */}
                                        <div className="w-2/3 h-[1px] bg-blue-200 mx-auto mb-4"></div>
                                        
                                        <div className="space-y-4">
                                            <p className="text-slate-700 font-bold text-sm leading-relaxed uppercase tracking-wide px-4">
                                                {doc.qualification}
                                            </p>
                                            
                                            <p className="text-slate-500 text-xs font-semibold leading-relaxed max-w-[250px] mx-auto opacity-80">
                                                {doc.designation}
                                            </p>

                                            <div className="pt-6">
                                                <button 
                                                    onClick={() => openModal(doc)}
                                                    className="px-10 py-2 border-2 border-slate-800 text-slate-800 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all duration-300"
                                                >
                                                    Read more
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detailed Modal */}
            <AnimatePresence>
                {isModalOpen && selectedDoctor && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh] border border-white"
                        >
                            {/* Modal Close */}
                            <button 
                                onClick={closeModal}
                                className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>

                            {/* Left: Doc Image */}
                            <div className="lg:w-2/5 relative h-64 lg:h-auto overflow-hidden bg-slate-100">
                                <img 
                                    src={selectedDoctor.image} 
                                    alt={selectedDoctor.name}
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>

                            {/* Right: Info */}
                            <div className="lg:w-3/5 p-8 lg:p-12 overflow-y-auto">
                                <div className="section-badge bg-blue-50 text-blue-700 border-blue-100 mb-4 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                                    <i className="fa-solid fa-award mr-2"></i>
                                    Expert Physiotherapist
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-black text-blue-900 mb-2">{selectedDoctor.name}</h2>
                                <p className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-8 border-b border-blue-100 pb-4">
                                    {selectedDoctor.qualification}
                                </p>

                                <div className="space-y-8">
                                    <div>
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Lead Designation</p>
                                        <p className="text-slate-700 text-lg font-bold leading-relaxed">{selectedDoctor.designation}</p>
                                    </div>

                                    <div>
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Professional Bio</p>
                                        <div className="text-slate-600 leading-relaxed text-base font-medium space-y-4">
                                            <p>{selectedDoctor.bio}</p>
                                            <p className="text-blue-700 italic border-l-4 border-blue-100 pl-4 py-1">
                                                Specializing in {selectedDoctor.specialty} for over {selectedDoctor.experience}.
                                            </p>
                                        </div>
                                    </div>

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
