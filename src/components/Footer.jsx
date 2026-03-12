import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/images/LOGO.png";

const Footer = () => {
    const [clinicInfo, setClinicInfo] = useState({
        phones: ['+91 8769556475', '+91 9782468376'],
        email: 'rkthecompletecare@gmail.com',
        address: '21, Nirmal Vihar, Dadi ka Phatak, Near Kaushik School, Benad Road, Jhotwara, Jaipur',
        openingHours: { morning: '09:00 AM - 01:00 PM', evening: '04:00 PM - 07:00 PM', sunday: '10:00 AM - 02:00 PM' },
        socialLinks: { facebook: '#', instagram: '#', twitter: '#', whatsapp: 'https://wa.me/918769556475', google: 'https://g.page/r/CXkFsimafLKiEAE/review' }
    });

    useEffect(() => {
        axios.get('/api/clinic-info')
            .then(res => { if (res.data) setClinicInfo(res.data); })
            .catch(() => { });
    }, []);

    const quickLinks = [
        { label: 'Home', href: '/' },
        { label: 'Services', href: '#services' },
        { label: 'Exercises', href: '#exercises' },
        { label: 'Our Doctors', href: '#doctors' },
        { label: 'Testimonials', href: '#testimonials' },
        { label: 'Contact Us', href: '/contact' },
    ];

    const socialIcons = [
        { icon: 'fa-facebook-f', key: 'facebook', color: 'hover:bg-blue-600' },
        { icon: 'fa-instagram', key: 'instagram', color: 'hover:bg-pink-600' },
        { icon: 'fa-twitter', key: 'twitter', color: 'hover:bg-sky-500' },
        { icon: 'fa-whatsapp', key: 'whatsapp', color: 'hover:bg-green-600' },
        { icon: 'fa-google', key: 'google', color: 'hover:bg-red-500' },
    ];

    return (
        <>
            <footer id="footer" className="relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a2d3d 0%, #0f172a 60%, #162530 100%)" }}></div>
                <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(13, 148, 136,0.07)" }}></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(217, 119, 6,0.06)" }}></div>
                {/* Top accent line */}
                <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: "linear-gradient(90deg, #0d9488, #2dd4bf, #d97706)" }}></div>

                <div className="relative z-10 container mx-auto px-6 pt-16 pb-10">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">

                        {/* Column 1: Brand */}
                        <div>
                            <div className="mb-5 bg-white/10 backdrop-blur-sm p-3 rounded-2xl inline-block border border-white/20">
                                <img src={logo} alt="RK The Complete Care" className="h-14 w-auto object-contain max-w-[250px]" />
                            </div>
                            <p className="text-white/60 mb-6 leading-relaxed text-sm">
                                Where recovery begins. Experience premium, personalized physiotherapy care for a better, pain-free life.
                            </p>
                            {/* Social Icons */}
                            <div className="flex gap-2 flex-wrap">
                                {socialIcons.map(({ icon, key, color }) => (
                                    <a key={key}
                                        href={clinicInfo.socialLinks?.[key] || '#'}
                                        target="_blank" rel="noopener noreferrer"
                                        className={`w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white ${color} transition-all duration-200 hover:border-transparent hover:scale-110`}>
                                        <i className={`fa-brands ${icon} text-sm`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div>
                            <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                                <span className="w-1 h-5 rounded-full inline-block" style={{ background: "linear-gradient(to bottom, #0d9488, #2dd4bf)" }}></span>
                                Quick Links
                            </h3>
                            <ul className="space-y-2.5">
                                {quickLinks.map(link => (
                                    <li key={link.label}>
                                        <a href={link.href}
                                            className="text-white/55 hover:pl-2 transition-all duration-200 text-sm flex items-center gap-2 group"
                                            style={{ color: undefined }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#2dd4bf'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}>
                                            <i className="fa-solid fa-chevron-right text-xs opacity-40 group-hover:opacity-80 transition-opacity" style={{ color: '#2dd4bf' }}></i>
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Treatments */}
                        <div>
                            <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                                <span className="w-1 h-5 rounded-full inline-block" style={{ background: "linear-gradient(to bottom, #d97706, #f59e0b)" }}></span>
                                Treatments
                            </h3>
                            <ul className="space-y-2.5">
                                {['Sports Injury', 'Back & Neck Pain', 'Knee Pain', 'Slip Disc', 'Paralysis Rehab', 'Post Surgery'].map(t => (
                                    <li key={t}>
                                        <a href="#services"
                                            className="text-white/60 hover:text-teal-300 hover:pl-2 transition-all duration-200 text-sm flex items-center gap-2 group">
                                            <i className="fa-solid fa-chevron-right text-xs text-teal-500/50 group-hover:text-teal-400 transition-colors"></i>
                                            {t}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 4: Contact */}
                        <div>
                            <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                                <span className="w-1 h-5 rounded-full inline-block" style={{ background: "linear-gradient(to bottom, #2dd4bf, #0d9488)" }}></span>
                                Contact Info
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-white/60 text-sm">
                                    <i className="fa-solid fa-clock mt-0.5 flex-shrink-0" style={{ color: "#f59e0b" }}></i>
                                    <span className="leading-relaxed">{clinicInfo.address}</span>
                                </li>
                                <li className="flex gap-3 text-white/60 text-sm">
                                    <i className="fa-solid fa-phone text-teal-400 mt-0.5 flex-shrink-0"></i>
                                    <div>
                                        {(clinicInfo.phones || []).map((p, i) => (
                                            <a key={i} href={`tel:${p.replace(/\s/g, '')}`} className="block transition-colors" style={{ color: undefined }} onMouseEnter={e => e.currentTarget.style.color = '#2dd4bf'} onMouseLeave={e => e.currentTarget.style.color = ''}>{p}</a>
                                        ))}
                                    </div>
                                </li>
                                <li className="flex gap-3 text-white/60 text-sm">
                                    <i className="fa-solid fa-clock text-amber-400 mt-0.5 flex-shrink-0"></i>
                                    <div className="space-y-0.5">
                                        <p><span className="text-white font-medium">Mon–Sat:</span></p>
                                        <p>Morning: {clinicInfo.openingHours?.morning || '09:00 AM - 01:00 PM'}</p>
                                        <p>Evening: {clinicInfo.openingHours?.evening || '04:00 PM - 07:00 PM'}</p>
                                        <p><span className="text-white font-medium">Sunday:</span> {clinicInfo.openingHours?.sunday || '10:00 AM - 02:00 PM'}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
                        <p>© {new Date().getFullYear()} <span className="text-white/60 font-semibold">RK The Complete Care</span>. All Rights Reserved.</p>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#2dd4bf" }}></span>
                            <p>Designed By HONEY PATHAK</p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating WhatsApp Button */}
            <div className="fixed bottom-6 left-6 z-50 group">
                <a href="https://wa.me/918769556475" target="_blank" rel="noopener noreferrer"
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl transition-all duration-300 hover:scale-110"
                    style={{ background: "linear-gradient(135deg, #4a8a68, #357a55)", boxShadow: "0 6px 18px rgba(74,138,104,0.35)" }}>
                    <i className="fa-brands fa-whatsapp"></i>
                </a>
                <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl">
                    Chat on WhatsApp
                </span>
            </div>

            {/* Floating Call Button */}
            <div className="fixed bottom-6 right-6 z-50 group">
                <a href="tel:+918769556475"
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl transition-all duration-300 hover:scale-110"
                    style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)", boxShadow: "0 6px 18px rgba(13, 148, 136,0.35)" }}>
                    <i className="fa-solid fa-phone"></i>
                </a>
                <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-xl">
                    Call Now
                </span>
            </div>
        </>
    );
};

export default Footer;
