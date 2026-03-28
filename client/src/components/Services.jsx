import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const services = [
    { title: 'Sports Injury Treatment', titleHi: '(खेल चोट उपचार)', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop', desc: 'Specialized recovery care for athletes to safely regain peak performance.', icon: 'fa-person-running' },
    { title: 'Neck Pain Treatment', titleHi: '(गर्दन दर्द उपचार)', image: 'https://images.unsplash.com/photo-1588286840104-44dad180e1b3?q=80&w=2070&auto=format&fit=crop', desc: 'Advanced relief for chronic neck pain and posture-related issues.', icon: 'fa-head-side-mask' },
    { title: 'Back Pain Treatment', titleHi: '(पीठ दर्द उपचार)', image: 'https://images.unsplash.com/photo-1609188076864-c35269136b09?q=80&w=2070&auto=format&fit=crop', desc: 'Targeted therapies for persistent lower and upper back pain relief.', icon: 'fa-person' },
    { title: 'Knee Pain Treatment', titleHi: '(घुटने का दर्द उपचार)', image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2068&auto=format&fit=crop', desc: 'Clinical treatments to restore knee mobility and joint function.', icon: 'fa-bone' },
    { title: 'Shoulder Pain Treatment', titleHi: '(कंधे का दर्द उपचार)', image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=2070&auto=format&fit=crop', desc: 'Restore full range of motion and strength to your shoulder.', icon: 'fa-dumbbell' },
    { title: 'Slip Disc Therapy', titleHi: '(स्लिप डिस्क थेरेपी)', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop', desc: 'Specialized protocols to manage and rehabilitate slip disc conditions.', icon: 'fa-circle-nodes' },
];

const Services = ({ limit, isHomePage = false }) => {
    const displayedServices = limit ? services.slice(0, limit) : services;

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
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-slate-100/80 flex flex-col"
                            >
                                {/* Image Box */}
                                <div className="h-56 overflow-hidden relative bg-slate-100">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
                                    <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-blue-700 text-sm shadow-xl border border-blue-50 group-hover:bg-blue-700 group-hover:text-white transition-all">
                                        <i className={`fa-solid ${service.icon}`}></i>
                                    </div>
                                    <div className="absolute bottom-4 left-4">
                                        <div className="px-3 py-1 bg-blue-600/90 text-white text-[8px] font-black uppercase tracking-widest rounded-lg">
                                            CLINICAL PROTOCOL
                                        </div>
                                    </div>
                                </div>

                                {/* Details Box */}
                                <div className="p-8 flex flex-col items-center text-center flex-grow">
                                    <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight group-hover:text-blue-700 transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-blue-600 font-bold text-[10px] uppercase tracking-widest mb-4">
                                        {service.titleHi}
                                    </p>
                                    <div className="w-12 h-0.5 bg-blue-100 mb-4 group-hover:bg-blue-300 transition-colors"></div>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed opacity-90">
                                        {service.desc}
                                    </p>
                                    
                                    <div className="mt-auto pt-6">
                                        <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-700 transition-all flex items-center gap-2">
                                            LEARN MORE <i className="fa-solid fa-chevron-right text-[8px]"></i>
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
        </>
    );
};

export default Services;
