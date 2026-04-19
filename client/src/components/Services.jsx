import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { getServices } from '../services/api';

// ── Condition Detail View ─────────────────────────────────────────────────────
const ConditionDetail = ({ service, onBack, onSelectService, allServices }) => {
    return (
        <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
        >
            {/* Gradient Header Banner */}
            <div className="relative rounded-2xl overflow-hidden mb-8"
                style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 40%, #0891b2 100%)' }}>
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                </div>
                <div className="relative z-10 px-8 py-10 text-center">
                    <button
                        onClick={onBack}
                        className="absolute left-6 top-6 flex items-center gap-2 text-white/80 hover:text-white text-sm font-semibold transition-colors"
                    >
                        <i className="fa-solid fa-chevron-left text-xs"></i> All Services
                    </button>
                    <p className="text-cyan-200 text-xs font-bold uppercase tracking-widest mb-2">Physiotherapy Treatment</p>
                    <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
                        Physiotherapy Treatment For {service.title} In Jaipur
                    </h1>
                </div>
            </div>

            {/* Two-column layout */}
            <div className="grid lg:grid-cols-[1fr_280px] gap-8">
                {/* Left: Image Poster + Content */}
                <div>
                    <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg border border-slate-100"
                        style={{ minHeight: '280px' }}>
                        <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-72 object-cover"
                            onError={e => { e.target.src = 'https://placehold.co/800x400?text=' + service.title; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex items-end">
                            <div className="p-6 md:p-8 max-w-md">
                                <p className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-1">
                                    {service.title} Treatment
                                </p>
                                <h2 className="text-white font-black text-xl md:text-2xl leading-tight mb-3">
                                    {service.tagline}
                                </h2>
                                <div className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-3">
                                    RK — The Complete Care Physiotherapy Centre
                                </div>
                                <a
                                    href="tel:+918769556475"
                                    className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-black text-sm px-4 py-2 rounded-xl transition-colors"
                                >
                                    <i className="fa-solid fa-phone text-xs"></i>
                                    +91 87695 56475
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                                <i className={`fa-solid ${service.icon}`}></i>
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800 text-lg">{service.title} ({service.titleHi}) — Overview</h3>
                                <p className="text-slate-400 text-xs">RK The Complete Care, Jaipur</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {Array.isArray(service.content) ? service.content.map((para, i) => (
                                <p key={i} className="text-slate-600 text-[15px] leading-relaxed">{para}</p>
                            )) : (
                                <p className="text-slate-600 text-[15px] leading-relaxed">{service.content}</p>
                            )}
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                to="/booking"
                                className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-95 shadow-emerald-100"
                            >
                                <i className="fa-solid fa-calendar-check text-lg"></i> Book Appointment
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right: Sticky Sidebar */}
                <div className="space-y-6">
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 sticky top-24">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Links</h4>
                        <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            {allServices.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => onSelectService(s.id)}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${s.id === service.id
                                        ? 'bg-cyan-500 text-white shadow-md shadow-cyan-100'
                                        : 'text-slate-500 hover:bg-white hover:text-cyan-600'
                                        }`}
                                >
                                    {s.title}
                                </button>
                            ))}
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-200">
                            <div className="p-4 bg-white rounded-xl border border-slate-100 italic text-[11px] text-slate-500 font-medium leading-relaxed">
                                "Specialized clinical procedures tailored for your {service.title.toLowerCase()} recovery."
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ── Main Services Component ───────────────────────────────────────────────────
const Services = ({ limit, isHomePage = false }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await getServices();
                setServices(data);
            } catch (err) {
                console.error("Error fetching services:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const conditionId = searchParams.get('condition');
    const selectedService = services.find(s => s.id === conditionId);
    const displayedServices = limit ? services.slice(0, limit) : services;

    const handleBack = () => {
        setSearchParams({});
    };

    const handleSelectService = (id) => {
        setSearchParams({ condition: id });
    };

    if (loading && !isHomePage) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <section id="services" className={`py-24 relative overflow-hidden ${isHomePage ? 'bg-slate-50' : 'bg-white'}`}>

            <div className="container mx-auto px-6 relative z-10">
                <AnimatePresence mode="wait">
                    {selectedService ? (
                        <ConditionDetail 
                            service={selectedService} 
                            onBack={handleBack} 
                            onSelectService={handleSelectService}
                            allServices={services}
                        />
                    ) : (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {!isHomePage && (
                                <div className="text-center mb-16">
                                    <div className="px-4 py-1.5 bg-cyan-50 border border-cyan-100 text-cyan-700 text-[10px] font-black uppercase tracking-widest rounded-full inline-block mb-4">
                                        Clinical Excellence · नैदानिक उत्कृष्टता
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                                        Specialized <span className="text-cyan-500">Treatments</span>
                                    </h2>
                                    <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                                        Evidence-based clinical protocols designed to restore your mobility and eliminate pain.
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {displayedServices.map((service, index) => (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                        viewport={{ once: true }}
                                        className="group relative bg-white rounded-[2.5rem] p-4 transition-all duration-500 border border-slate-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(8,145,178,0.1)] flex flex-col hover:-translate-y-2"
                                    >
                                        <div className="h-56 relative rounded-[2rem] overflow-hidden mb-6">
                                            <img
                                                src={service.image}
                                                alt={service.title}
                                                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                                            <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-cyan-600 shadow-lg group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500">
                                                <i className={`fa-solid ${service.icon} text-xl`}></i>
                                            </div>
                                        </div>

                                        <div className="px-4 pb-4 flex flex-col flex-grow">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-cyan-600 transition-colors">
                                                    {service.title}
                                                </h3>
                                                <span className="text-[10px] font-black text-cyan-700 uppercase tracking-widest">({service.titleHi})</span>
                                            </div>
                                            <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow font-medium">
                                                {service.desc}
                                            </p>
                                            {isHomePage ? (
                                                <Link 
                                                    to={`/services?condition=${service.id}`}
                                                    className="w-full py-4 bg-slate-50 group-hover:bg-cyan-500 text-slate-400 group-hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-cyan-200"
                                                >
                                                    Learn Procedure
                                                    <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-2"></i>
                                                </Link>
                                            ) : (
                                                <button 
                                                    onClick={() => handleSelectService(service.id)}
                                                    className="w-full py-4 bg-slate-50 group-hover:bg-cyan-500 text-slate-400 group-hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-cyan-200"
                                                >
                                                    Learn Procedure
                                                    <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-2"></i>
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Services;
