import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fallbackDoctors = [
        {
            _id: 'fallback-1',
            name: 'Dr. Piyush Sharma (PT)',
            qualification: 'MPT (Ortho & Sports)',
            designation: 'HOD – Dept. of Physiotherapy\nWelton Hospital, Jaipur',
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop',
            specialty: 'Orthopaedic & Sports'
        },
        {
            _id: 'fallback-2',
            name: 'Dr. Soniya Pathak (PT)',
            qualification: 'BPT (CDNT, CCT)',
            designation: 'Consultant Physiotherapist',
            image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1974&auto=format&fit=crop',
            specialty: 'Neuro & Pediatric'
        }
    ];

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get('/api/doctors');
                setDoctors(res.data && res.data.length > 0 ? res.data : fallbackDoctors);
            } catch {
                setDoctors(fallbackDoctors);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    return (
        <section id="doctors" className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(135deg, #0f172a 0%, #0f766e 55%, #0f172a 100%)" }}>
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(13, 148, 136,0.15)" }}></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(217, 119, 6,0.10)" }}></div>
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            </div>

            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-sm font-semibold mb-4">
                        <i className="fa-solid fa-user-doctor text-teal-300"></i>
                        Our Experts · हमारे विशेषज्ञ
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Meet Our{" "}
                        <span style={{ background: "linear-gradient(135deg, #2dd4bf, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                            Specialists
                        </span>
                    </h2>
                    <p className="text-white/60 text-lg max-w-xl mx-auto">
                        Highly qualified physiotherapists dedicated to your complete recovery
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center gap-8 flex-wrap">
                        {[1, 2].map(i => (
                            <div key={i} className="w-full max-w-sm bg-white/10 rounded-3xl overflow-hidden animate-pulse">
                                <div className="h-80 bg-white/10"></div>
                                <div className="p-8 space-y-3">
                                    <div className="h-5 bg-white/10 rounded w-3/4 mx-auto"></div>
                                    <div className="h-4 bg-white/10 rounded w-1/2 mx-auto"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-8">
                        {doctors.map((doc, i) => (
                            <div key={doc._id}
                                className="group w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:bg-white/15 hover:-translate-y-3 transition-all duration-500 shadow-2xl">
                                {/* Image */}
                                <div className="h-80 relative overflow-hidden">
                                    <img
                                        src={doc.image}
                                        alt={doc.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => { e.target.src = 'https://placehold.co/400x320?text=Doctor'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                                    {/* Specialty badge */}
                                    <div className="absolute top-4 left-4 px-3 py-1.5 backdrop-blur-sm rounded-full text-white text-xs font-bold" style={{ background: "rgba(13, 148, 136,0.85)" }}>
                                        {doc.specialty || 'Physiotherapy'}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-8 text-center">
                                    <h3 className="text-xl font-black text-white mb-1">{doc.name}</h3>
                                    <p className="font-semibold text-sm mb-2" style={{ color: "#f59e0b" }}>{doc.qualification}</p>
                                    <p className="text-white/60 text-sm mb-6 leading-relaxed">{doc.designation}</p>

                                    {/* Divider */}
                                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>

                                    <a href="tel:+918769556475"
                                        className="w-full py-3 text-white rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                                        style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)", boxShadow: "0 4px 14px rgba(13, 148, 136,0.28)" }}>
                                        <i className="fa-solid fa-calendar-check"></i>
                                        Book Appointment
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Doctors;
