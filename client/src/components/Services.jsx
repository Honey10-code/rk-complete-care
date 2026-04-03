import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const services = [
    { 
        id: 'sports-injury',
        title: 'Sports Injury Treatment', 
        titleHi: '(खेल चोट उपचार)', 
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop', 
        desc: 'Specialized recovery care for athletes to safely regain peak performance.', 
        icon: 'fa-person-running',
        fullDetails: 'Our sports injury treatment is designed for both professional athletes and weekend warriors. We utilize advanced biomechanical analysis, targeted manual therapy, and sport-specific rehabilitation exercises to not only heal the injury but prevent future occurrences. Protocols include soft tissue mobilization, kinesio taping, and functional capacity evaluation.'
    },
    { 
        id: 'neck-pain',
        title: 'Neck Pain Treatment', 
        titleHi: '(गर्दन दर्द उपचार)', 
        image: 'https://images.unsplash.com/photo-1588286840104-44dad180e1b3?q=80&w=2070&auto=format&fit=crop', 
        desc: 'Advanced relief for chronic neck pain and posture-related issues.', 
        icon: 'fa-head-side-mask',
        fullDetails: 'We provide specialized cervical spine rehabilitation targeting root causes of neck pain. Whether from poor posture (text neck), whiplash, or degenerative disc disease, our approach includes cervical traction, trigger point therapy, ergonomic assessments, and specific strengthening of deep neck flexors to ensure long-term relief.'
    },
    { 
        id: 'back-pain',
        title: 'Back Pain Treatment', 
        titleHi: '(पीठ दर्द उपचार)', 
        image: 'https://images.unsplash.com/photo-1609188076864-c35269136b09?q=80&w=2070&auto=format&fit=crop', 
        desc: 'Targeted therapies for persistent lower and upper back pain relief.', 
        icon: 'fa-person',
        fullDetails: 'Back pain is complex and requires a personalized approach. Our clinical pathways encompass everything from acute muscle strains to chronic sciatica. We employ spinal manipulation, core stabilization protocols (like McKenzie Method), dry needling, and posture correction to restore spinal health and pain-free movement.'
    },
    { 
        id: 'knee-pain',
        title: 'Knee Pain Treatment', 
        titleHi: '(घुटने का दर्द उपचार)', 
        image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2068&auto=format&fit=crop', 
        desc: 'Clinical treatments to restore knee mobility and joint function.', 
        icon: 'fa-bone',
        fullDetails: 'Knee rehabilitation covers ACL/MCL tears, meniscus injuries, and osteoarthritis. We integrate isometric strengthening, proprioception training, and patellar mobilization. Our cutting-edge modalities to reduce inflammation combined with evidence-based load management guarantee a steady return to your daily activities and rigorous sports.'
    },
    { 
        id: 'shoulder-pain',
        title: 'Shoulder Pain Treatment', 
        titleHi: '(कंधे का दर्द उपचार)', 
        image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=2070&auto=format&fit=crop', 
        desc: 'Restore full range of motion and strength to your shoulder.', 
        icon: 'fa-dumbbell',
        fullDetails: 'Shoulder joint complexity demands precise care. We successfully treat rotator cuff tendinopathy, frozen shoulder (adhesive capsulitis), and impingement syndromes. Treatment phases feature joint mobilizations, scapular dyskinesis correction, and progressive resistance training to rebuild stability and overhead strength.'
    },
    { 
        id: 'slip-disc',
        title: 'Slip Disc Therapy', 
        titleHi: '(स्लिप डिस्क थेरेपी)', 
        image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop', 
        desc: 'Specialized protocols to manage and rehabilitate slip disc conditions.', 
        icon: 'fa-circle-nodes',
        fullDetails: 'Herniated or bulging discs require meticulous, non-surgical intervention. Our focused slip disc therapy avoids aggravation while promoting disc retraction. We utilize directional preference exercises, specialized spinal decompression techniques, and intensive core recruitment strategies to centralize pain and heal the spinal segments safely.'
    },
];

const Services = ({ limit, isHomePage = false }) => {
    const displayedServices = limit ? services.slice(0, limit) : services;
    const [selectedService, setSelectedService] = useState(null);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (selectedService) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedService]);

    return (
        <>
            {!isHomePage && (
                <Helmet>
                    <title>Physiotherapy Services & Treatments | RK The Complete Care</title>
                    <meta name="description" content="Comprehensive physiotherapy treatments for back pain, neck pain, sports injuries, paralysis, and post-surgery rehabilitation in Jaipur." />
                </Helmet>
            )}
            <section id="services" className={`py-24 relative overflow-hidden ${isHomePage ? 'bg-white' : 'bg-slate-50'}`}>
                <div className="container mx-auto px-6 relative z-10">
                    {!isHomePage && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <div className="section-badge mx-auto bg-blue-50 border-blue-100 text-blue-700">
                                <i className="fa-solid fa-stethoscope"></i>
                                Expert Care · विशेषज्ञ देखभाल
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black mb-4 text-slate-900 leading-tight">
                                Our Specialized <span className="text-blue-700">Clinical Services</span>
                            </h2>
                            <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                                Professional treatments for a wide range of orthopaedic and neurological conditions.
                            </p>
                        </motion.div>
                    )}

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayedServices.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="group relative bg-white rounded-[2rem] p-3 transition-all duration-500 border border-slate-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(37,99,235,0.08)] flex flex-col hover:-translate-y-2 cursor-pointer"
                                onClick={() => setSelectedService(service)}
                            >
                                {/* Background Accent on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] pointer-events-none"></div>

                                {/* Premium Image Box */}
                                <div className="h-52 relative rounded-[1.5rem] overflow-hidden bg-slate-100 z-10">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.15]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                                    
                                    {/* Floating Icon */}
                                    <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-blue-700 text-lg shadow-[0_8px_20px_rgba(0,0,0,0.1)] border border-white/50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        <i className={`fa-solid ${service.icon}`}></i>
                                    </div>

                                    {/* Protocol Tag */}
                                    <div className="absolute bottom-4 left-4">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-400/30">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                                            CLINICAL PROTOCOL
                                        </div>
                                    </div>
                                </div>

                                {/* Refined Details Box */}
                                <div className="p-6 pt-8 flex flex-col flex-grow relative z-10 text-center items-center">
                                    <h3 className="text-[1.35rem] font-black text-slate-800 mb-2 leading-tight group-hover:text-blue-700 transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="inline-block px-3 py-1 rounded-full bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-widest border border-slate-100 mb-5">
                                        {service.titleHi}
                                    </p>
                                    
                                    <p className="text-slate-500 text-[15px] font-medium leading-relaxed opacity-90 px-2 line-clamp-2">
                                        {service.desc}
                                    </p>
                                    
                                    <div className="mt-auto pt-8 w-full flex justify-center">
                                        <button className="flex items-center justify-center gap-2 w-12 h-12 rounded-full bg-slate-50 text-slate-400 group-hover:w-[180px] group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition-all duration-300 overflow-hidden relative">
                                            <span className="absolute transform translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 font-bold text-[11px] uppercase tracking-widest whitespace-nowrap">
                                                Learn More
                                            </span>
                                            <i className="fa-solid fa-arrow-right text-[14px] group-hover:transform group-hover:translate-x-32 opacity-100 group-hover:opacity-0 transition-all duration-300 absolute"></i>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {!isHomePage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            viewport={{ once: true }}
                            className="text-center mt-16"
                        >
                            <a href="tel:+918769556475"
                                className="inline-flex items-center gap-3 px-10 py-4 bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-200 hover:bg-blue-800 shadow-xl shadow-blue-100 group">
                                Book a Consultation Today
                                <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                            </a>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Service Details Modal Popup */}
            <AnimatePresence>
                {selectedService && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
                    >
                        {/* Backdrop */}
                        <div 
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                            onClick={() => setSelectedService(null)}
                        ></div>

                        {/* Modal Content */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row z-10"
                        >
                            {/* Close Button */}
                            <button 
                                onClick={() => setSelectedService(null)}
                                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 hover:bg-white hover:text-red-500 hover:shadow-lg transition-all"
                            >
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>

                            {/* Modal Image */}
                            <div className="w-full md:w-5/12 h-64 md:h-auto relative">
                                <img 
                                    src={selectedService.image} 
                                    alt={selectedService.title} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900/80 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <div className="w-12 h-12 rounded-xl bg-blue-600/90 backdrop-blur-sm flex items-center justify-center text-2xl mb-4 border border-blue-400">
                                        <i className={`fa-solid ${selectedService.icon}`}></i>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-300">RK The Complete Care</p>
                                </div>
                            </div>

                            {/* Modal Text */}
                            <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col">
                                <div className="mb-2">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100">
                                        Clinical Protocol
                                    </span>
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-1 leading-tight">
                                    {selectedService.title}
                                </h3>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">
                                    {selectedService.titleHi}
                                </p>
                                
                                <div className="prose prose-slate prose-sm text-slate-600 font-medium leading-relaxed mb-8">
                                    <p className="text-lg text-slate-800 font-semibold mb-4">{selectedService.desc}</p>
                                    <p>{selectedService.fullDetails}</p>
                                </div>

                                <div className="mt-auto pt-6 border-t border-slate-100 flex flex-wrap gap-4">
                                    <a 
                                        href="tel:+918769556475"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
                                    >
                                        <i className="fa-solid fa-calendar-check"></i> Book Session
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Services;
