import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

// Smooth, harmonious service colors — all muted tones
const services = [
    { title: 'Sports Injury Treatment', titleHi: 'खेल चोट उपचार', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop', desc: 'Specialized care for athletes to recover quickly and safely.', icon: 'fa-person-running', bg: '#0d9488' },
    { title: 'Neck Pain Treatment', titleHi: 'गर्दन दर्द उपचार', image: 'https://images.unsplash.com/photo-1588286840104-44dad180e1b3?q=80&w=2070&auto=format&fit=crop', desc: 'Relief from chronic neck pain caused by posture or injury.', icon: 'fa-head-side-mask', bg: '#0f766e' },
    { title: 'Back Pain Treatment', titleHi: 'पीठ दर्द उपचार', image: 'https://images.unsplash.com/photo-1609188076864-c35269136b09?q=80&w=2070&auto=format&fit=crop', desc: 'Effective therapies for lower and upper back pain management.', icon: 'fa-person', bg: '#d97706' },
    { title: 'Knee Pain Treatment', titleHi: 'घुटने का दर्द उपचार', image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2068&auto=format&fit=crop', desc: 'Non-invasive treatments to restore knee function and reduce pain.', icon: 'fa-bone', bg: '#5a8a7a' },
    { title: 'Shoulder Pain Treatment', titleHi: 'कंधे का दर्द उपचार', image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=2070&auto=format&fit=crop', desc: 'Restore mobility and strength to your shoulder joint.', icon: 'fa-dumbbell', bg: '#6a7a8a' },
    { title: 'Slip Disc Therapy', titleHi: 'स्लिप डिस्क थेरेपी', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop', desc: 'Targeted therapy to manage and heal slip disc conditions.', icon: 'fa-circle-nodes', bg: '#4a7a6a' },
    { title: 'Paralysis Rehab', titleHi: 'पक्षाघात पुनर्वास', image: 'https://images.unsplash.com/photo-1576091160550-217358c7e618?q=80&w=2070&auto=format&fit=crop', desc: 'Comprehensive rehabilitation for paralysis recovery.', icon: 'fa-wheelchair', bg: '#3d6a7a' },
    { title: 'Stroke Rehabilitation', titleHi: 'स्ट्रोक पुनर्वास', image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2071&auto=format&fit=crop', desc: 'Helping stroke survivors regain independence and mobility.', icon: 'fa-brain', bg: '#8a6050' },
    { title: 'Post Surgery Rehab', titleHi: 'सर्जरी के बाद पुनर्वास', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop', desc: 'Optimized recovery programs following surgical procedures.', icon: 'fa-heart-pulse', bg: '#2dd4bf' },
    { title: 'Pediatric Physiotherapy', titleHi: 'बाल चिकित्सा फिजियोथेरेपी', image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=2047&auto=format&fit=crop', desc: 'Gentle and effective care for children\'s physical development.', icon: 'fa-child', bg: '#f59e0b' },
];

const Services = () => {
    return (
        <>
            <Helmet>
                <title>Physiotherapy Services & Treatments | RK The Complete Care</title>
                <meta name="description" content="Comprehensive physiotherapy treatments for back pain, neck pain, sports injuries, paralysis, and post-surgery rehabilitation in Jaipur." />
            </Helmet>
            <section id="services" className="py-24 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #ffffff, #f4f7f8 40%, #ffffff)" }}></div>
                    <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: "linear-gradient(90deg, #0d9488, #2dd4bf, #d97706)" }}></div>
                </div>

                <div className="container mx-auto px-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="section-badge mx-auto mb-4">
                            <i className="fa-solid fa-stethoscope"></i>
                            Expert Care · विशेषज्ञ देखभाल
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#0f172a" }}>
                            Specialized{" "}
                            <span style={{ background: "linear-gradient(135deg, #0d9488, #2dd4bf)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                Services
                            </span>
                        </h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
                            We provide specialized treatments for a wide range of conditions, ensuring specific and effective care for every patient.
                        </p>
                    </motion.div>

                    {/* Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-400 overflow-hidden border border-slate-100 hover:-translate-y-2"
                                style={{ '--hover-color': service.bg }}
                            >
                                {/* Image */}
                                <div className="h-44 overflow-hidden relative">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent"></div>
                                    {/* Icon badge */}
                                    <div className="absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm shadow-md"
                                        style={{ background: service.bg }}>
                                        <i className={`fa-solid ${service.icon}`}></i>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-base font-bold text-slate-800 mb-0.5 transition-colors group-hover:text-[#0d9488]">{service.title}</h3>
                                    <p className="text-xs font-medium mb-2" style={{ color: service.bg }}>{service.titleHi}</p>
                                    <p className="text-sm text-slate-500 leading-relaxed">{service.desc}</p>
                                </div>

                                {/* Bottom accent line */}
                                <div className="h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                                    style={{ background: service.bg }}></div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                        className="text-center mt-14"
                    >
                        <a href="tel:+918769556475"
                            className="inline-flex items-center gap-3 px-10 py-4 text-white rounded-2xl font-bold text-base transition-all duration-300 hover:-translate-y-1"
                            style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)", boxShadow: "0 8px 24px rgba(13, 148, 136,0.30)" }}>
                            <i className="fa-solid fa-phone-volume"></i>
                            Book a Consultation Today
                            <i className="fa-solid fa-arrow-right text-sm"></i>
                        </a>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default Services;
