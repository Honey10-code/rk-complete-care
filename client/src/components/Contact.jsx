import React from 'react';
import { motion } from 'framer-motion';

const contactItems = [
    {
        icon: 'fa-location-dot',
        label: 'Our Location',
        bg: '#0d9488',
        content: (
            <p className="text-slate-500 leading-relaxed text-sm">
                21, Nirmal Vihar, Dadi ka Phatak,<br />
                Near Victor Public School, Benad Road,<br />
                Jhotwara, Jaipur – 302012
            </p>
        )
    },
    {
        icon: 'fa-phone',
        label: 'Phone Numbers',
        bg: '#0f766e',
        content: (
            <div className="space-y-1">
                <a href="tel:+918769556475" className="block text-sm text-slate-500 hover:text-[#0d9488] transition-colors font-medium">+91 8769556475</a>
                <a href="tel:+919782468376" className="block text-sm text-slate-500 hover:text-[#0d9488] transition-colors font-medium">+91 9782468376</a>
            </div>
        )
    },
    {
        icon: 'fa-envelope',
        label: 'Email Us',
        bg: '#6a7a8a',
        content: (
            <a href="mailto:rk.completecare@gmail.com" className="text-sm text-slate-500 hover:text-[#0d9488] transition-colors break-all">
                rk.completecare@gmail.com
            </a>
        )
    },
    {
        icon: 'fa-clock',
        label: 'Opening Hours',
        bg: '#d97706',
        content: (
            <div className="text-sm text-slate-500 space-y-1">
                <p><span className="font-semibold text-slate-700">Mon – Sat:</span></p>
                <p className="ml-3">Morning: 09:00 AM – 01:00 PM</p>
                <p className="ml-3">Evening: 04:00 PM – 08:00 PM</p>
                <p><span className="font-semibold text-slate-700">Sunday:</span> 09:00 AM – 12:00 PM</p>
            </div>
        )
    },
];


const Contact = () => {
    return (
        <React.Fragment>
            <section id="contact-info" className="py-24 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #eef2f4, #ffffff)" }}></div>
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
                            <i className="fa-solid fa-location-dot"></i>
                            Find Us · हमसे मिलें
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#0f172a" }}>
                            Get In{" "}
                            <span style={{ background: "linear-gradient(135deg, #0d9488, #2dd4bf)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                Touch
                            </span>
                        </h2>
                        <p className="text-slate-500 text-lg max-w-xl mx-auto">
                            We're here to help you on your recovery journey. Reach out anytime.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-10 items-start">
                        {/* Contact Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            {contactItems.map((item, i) => (
                                <div key={i}
                                    className="flex items-start gap-5 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300" style={{ background: item.bg }}>
                                        <i className={`fa-solid ${item.icon}`}></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-1.5">{item.label}</h4>
                                        {item.content}
                                    </div>
                                </div>
                            ))}

                            {/* Quick Action Buttons */}
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <a href="tel:+918769556475"
                                    className="flex items-center justify-center gap-2 py-3.5 text-white rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all"
                                    style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)", boxShadow: "0 4px 14px rgba(13, 148, 136,0.28)" }}>
                                    <i className="fa-solid fa-phone"></i> Call Now
                                </a>
                                <a href="https://wa.me/918769556475" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 py-3.5 text-white rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all"
                                    style={{ background: "linear-gradient(135deg, #4a8a68, #357a55)", boxShadow: "0 4px 14px rgba(74,138,104,0.28)" }}>
                                    <i className="fa-brands fa-whatsapp"></i> WhatsApp
                                </a>
                            </div>
                        </motion.div>

                        {/* Map */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 h-[480px] relative group"
                        >
                            <a
                                href="https://maps.app.goo.gl/5puqhfAmyGvwu8m17"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 z-10 cursor-pointer"
                            >
                                <span className="sr-only">Open Clinic Location on Google Maps</span>
                            </a>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3555.8464122193122!2d75.74185697629602!3d26.971762676611963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db368ac6c1b05%3A0xa2b27c9a29b20579!2sRK%20%E2%80%93%20The%20Complete%20Care%20Physiotherapy%20Centre!5e0!3m2!1sen!2sin!4v1771333214344!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Clinic Location"
                                className="grayscale-[0.2] transition-all group-hover:grayscale-0"
                            ></iframe>
                        </motion.div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

export default Contact;
