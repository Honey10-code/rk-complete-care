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
            name: 'Dr. Piyush Sharma',
            suffix: '(PT)',
            qualification: 'BPT, MPT (ORTHO AND SPORTS)',
            designation: 'CHIEF PHYSIOTHERAPIST',
            image: '/dr-piyush-sharma.png',
            specialty: 'Orthopaedic & Sports',
            hospital: 'WELTON HOSPITAL',
            address: '219-220 MANDIR MARG, MAHAVIR NAGAR DURGAPURA JAIPUR',
            experience: '12+ Years Experience',
            bio: 'Dr. Piyush Sharma is the Chief Physiotherapist at Welton Hospital. He specializes in treating patients with orthopedic problems and disabilities, bringing years of expertise and a compassionate approach to patient care. With a vast experience in the field, he has successfully treated thousands of patients suffering from conditions such as:',
            expertise: [
                "Osteoarthritis", "Rheumatoid Arthritis",
                "Hip & Knee Joint Pain", "Frozen Shoulder",
                "Low Back Pain & Slip Disc", "Cervical Pain",
                "Ligament & Meniscus Pain", "Sports Injuries"
            ],
            footerText: "He is highly specialized in Post-Op Rehabilitation Management for Total Hip Replacement, Total Knee Replacement, and Pelvis-Acetabular fractures. His expertise also extends to managing stiffness after post-op trauma or complex trauma surgeries, ensuring patients regain optimal mobility and function."
        },
        {
            _id: 'fallback-2',
            name: 'Dr. Soniya Pathak',
            suffix: '(PT)',
            qualification: 'BPT (CDNT,CCT)',
            designation: 'CONSULTANT PHYSIOTHERAPIST',
            image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1974&auto=format&fit=crop',
            specialty: 'Neuro & Pediatric',
            experience: '8+ Years Experience',
            bio: 'Dr. Soniya Pathak is a Senior Consultant Physiotherapist specializing in Neurological rehabilitation and Pediatric care. She brings a compassionate, results-driven approach to complex neurological cases including stroke recovery and developmental delays. Her clinical focus includes:',
            expertise: [
                "Stroke Rehabilitation", "Cerebral Palsy Care",
                "Parkinson's Management", "Post-Brain Injury Rehab",
                "Pediatric Developmental delays", "Balance & Gait training",
                "Facial Nerve Palsy", "Sensory Integration"
            ],
            footerText: "Dr. Soniya is dedicated to improving the quality of life for patients with long-term neurological challenges, utilizing evidence-based neuro-rehabilitation techniques and personalized exercise protocols."
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
                                            {doc.name} {doc.suffix}
                                        </h3>

                                        {/* Divider Line */}
                                        <div className="w-2/3 h-[1px] bg-blue-200 mx-auto mb-4"></div>

                                        <div className="space-y-4">
                                            <p className="text-slate-700 font-bold text-sm leading-relaxed uppercase tracking-wide px-4">
                                                {doc.qualification}
                                            </p>

                                            <p className="text-slate-500 text-[10px] font-black leading-relaxed max-w-[250px] mx-auto opacity-80 uppercase tracking-widest mb-3">
                                                {doc.designation}
                                            </p>

                                            {(doc.hospital || doc.address) && (
                                                <div className="text-xs text-slate-500 max-w-[200px] mx-auto leading-snug">
                                                    {doc.hospital && <p className="font-black text-slate-800 uppercase tracking-wider">{doc.hospital}</p>}
                                                    {doc.address && <p className="text-[10px] opacity-80 mt-1">{doc.address}</p>}
                                                </div>
                                            )}

                                            <div className="pt-5">
                                                <button
                                                    onClick={() => openModal(doc)}
                                                    className="px-10 py-2 border-2 border-slate-800 text-slate-800 rounded-lg font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm"
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

            {/* Premium Expert Modal */}
            <AnimatePresence>
                {isModalOpen && selectedDoctor && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-lg"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="relative w-full max-w-6xl bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] border border-blue-50/50"
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 hover:bg-red-500 hover:text-white transition-all shadow-md group"
                            >
                                <i className="fa-solid fa-xmark group-hover:rotate-90 transition-transform"></i>
                            </button>

                            {/* LEFT COLUMN: HERO IMAGE & OVERLAY */}
                            <div className="md:w-[35%] relative min-h-[400px] md:min-h-0 bg-slate-100">
                                <img
                                    src={selectedDoctor.image}
                                    alt={selectedDoctor.name}
                                    className="w-full h-full object-cover object-top"
                                />
                                {/* Bottom Overlay (Match Screenshot) */}
                                <div className="absolute inset-x-4 bottom-8 p-6 bg-blue-900/90 backdrop-blur-md rounded-2xl border border-blue-400/20 text-white shadow-2xl">
                                    <h3 className="text-xl font-black mb-1 leading-tight">{selectedDoctor.name} {selectedDoctor.suffix}</h3>
                                    <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mb-2">{selectedDoctor.designation}</p>
                                    <div className="w-10 h-0.5 bg-blue-500 mb-3"></div>
                                    <p className="text-white/80 text-[11px] font-bold leading-relaxed mb-2">{selectedDoctor.qualification}</p>

                                    {(selectedDoctor.hospital || selectedDoctor.address) && (
                                        <div className="mt-3 pt-3 border-t border-blue-400/30">
                                            {selectedDoctor.hospital && <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">{selectedDoctor.hospital}</p>}
                                            {selectedDoctor.address && <p className="text-[10px] text-white/70 leading-snug mt-1">{selectedDoctor.address}</p>}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent pointer-events-none"></div>
                            </div>

                            {/* RIGHT COLUMN: PROFESSIONAL CONTENT */}
                            <div className="md:w-[65%] p-8 md:p-16 overflow-y-auto">
                                <div className="max-w-3xl">
                                    {/* Badge */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-6">
                                        <i className="fa-solid fa-user-check"></i>
                                        MEET THE EXPERT
                                    </div>

                                    {/* Large Name Header */}
                                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-none">
                                        {selectedDoctor.name.split(' ').slice(0, -1).join(' ')} <span className="text-blue-700">{selectedDoctor.name.split(' ').pop()}</span>
                                    </h2>

                                    {/* Detailed Bio Paragraphs */}
                                    <div className="space-y-6 text-slate-600 leading-relaxed text-lg font-medium">
                                        <p>{selectedDoctor.bio}</p>

                                        {/* Expertise Checklist Grid */}
                                        {selectedDoctor.expertise && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 pt-4 pb-8 border-t border-b border-slate-100">
                                                {selectedDoctor.expertise.map((item, id) => (
                                                    <div key={id} className="flex items-center gap-3 group">
                                                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white shadow-sm shadow-blue-200">
                                                            <i className="fa-solid fa-check"></i>
                                                        </div>
                                                        <span className="text-slate-800 text-base font-bold tracking-tight">
                                                            {item}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Recovery Footer Focus */}
                                        <p className="text-slate-500 text-base leading-relaxed opacity-90 italic">
                                            {selectedDoctor.footerText || "Dedicated to providing expert physiotherapy care through advanced diagnostic techniques and personalized treatment protocols ensuring optimal recovery."}
                                        </p>
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
