import React, { useState, useEffect } from "react";
import logo from "../assets/images/LOGO.png";
import { getClinicInfo } from "../services/api";

const Footer = () => {
    const [clinicInfo, setClinicInfo] = useState({
        phones: ['+91 8769556475', '+91 9782468376'],
        email: 'rkthecompletecare@gmail.com',
        address: '21, Nirmal Vihar, Dadi ka Phatak, Near Kaushik School, Benad Road, Jhotwara, Jaipur',
        openingHours: { morning: '09:00 AM - 01:00 PM', evening: '04:00 PM - 07:00 PM', sunday: '10:00 AM - 02:00 PM' },
        socialLinks: { facebook: '#', instagram: '#', twitter: '#', whatsapp: 'https://wa.me/918769556475', google: 'https://g.page/r/CXkFsimafLKiEAE/review' }
    });

    useEffect(() => {
        getClinicInfo()
            .then(data => { if (data) setClinicInfo(data); })
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
            <footer id="footer" className="relative bg-slate-900 pt-16 pb-10 border-t-4 border-blue-700">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">

                        {/* Column 1: Brand */}
                        <div>
                            <div className="mb-6 flex items-center gap-3">
                                <div className="relative p-1.5 rounded-full bg-white border-2 border-blue-600/30 shadow-lg shrink-0 overflow-hidden w-16 h-16 flex items-center justify-center">
                                    <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-green-400/10 pointer-events-none" />
                                    <img src={logo} alt="RK The Complete Care" className="w-full h-full object-cover scale-[1.35]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-black text-sm leading-tight">RK The Complete Care</span>
                                    <span className="text-blue-400 text-[9px] font-bold uppercase tracking-widest">Where Recovery Begins</span>
                                </div>
                            </div>
                            <p className="text-slate-400 mb-6 leading-relaxed text-sm">
                                Dedicated to your recovery. Experience professional, personalized physiotherapy care for a better, pain-free life.
                            </p>
                            {/* Social Icons */}
                            <div className="flex gap-2 flex-wrap">
                                {socialIcons.map(({ icon, key, color }) => (
                                    <a key={key}
                                        href={clinicInfo.socialLinks?.[key] || '#'}
                                        target="_blank" rel="noopener noreferrer"
                                        className={`w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200`}>
                                        <i className={`fa-brands ${icon} text-sm`}></i>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div>
                            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">
                                Quick Links
                            </h3>
                            <ul className="space-y-3">
                                {quickLinks.map(link => (
                                    <li key={link.label}>
                                        <a href={link.href}
                                            className="text-slate-400 hover:text-blue-400 transition-colors text-sm flex items-center gap-2">
                                            <i className="fa-solid fa-chevron-right text-[10px] text-blue-500/50"></i>
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Physiotherapy Treatments */}
                        <div>
                            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-stethoscope text-blue-500 text-xs"></i>
                                Physiotherapy
                            </h3>
                            <ul className="grid grid-cols-2 gap-x-3 gap-y-2">
                                {[
                                    'Neck Pain', 'Back Pain', 'Knee Pain', 'Shoulder Pain',
                                    'Frozen Shoulder', 'Slip/Herniated Disc', 'Sciatica', 'Ankle Pain',
                                    'Rheumatoid Arthritis', 'Sports Rehab', 'Tennis Elbow', 'Vertigo', 'Osteoporosis'
                                ].map(t => (
                                    <li key={t}>
                                        <a href="/services"
                                            className="text-slate-400 hover:text-blue-400 transition-colors text-xs flex items-center gap-1.5 leading-snug">
                                            <i className="fa-solid fa-chevron-right text-[9px] text-blue-500/50 shrink-0"></i>
                                            {t}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 4: Contact */}
                        <div>
                            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-6">
                                Contact Info
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-slate-400 text-sm">
                                    <i className="fa-solid fa-location-dot mt-1 text-blue-500"></i>
                                    <span className="leading-relaxed">{clinicInfo.address}</span>
                                </li>
                                <li className="flex gap-3 text-slate-400 text-sm">
                                    <i className="fa-solid fa-phone text-blue-500 mt-1"></i>
                                    <div>
                                        {(clinicInfo.phones || []).map((p, i) => (
                                            <a key={i} href={`tel:${p.replace(/\s/g, '')}`} className="block hover:text-white transition-colors">{p}</a>
                                        ))}
                                    </div>
                                </li>
                                <li className="flex gap-3 text-slate-400 text-sm">
                                    <i className="fa-solid fa-clock text-blue-500 mt-1"></i>
                                    <div className="space-y-1">
                                        <p><span className="text-white font-medium">Mon–Sat:</span></p>
                                        <p>{clinicInfo.openingHours?.morning || '09:00 AM - 01:00 PM'}</p>
                                        <p>{clinicInfo.openingHours?.evening || '04:00 PM - 07:00 PM'}</p>
                                        <p><span className="text-white font-medium">Sunday:</span> {clinicInfo.openingHours?.sunday || '10:00 AM - 12:00 PM'}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
                        <p>© {new Date().getFullYear()} <span className="text-slate-300 font-semibold">RK The Complete Care</span>. All Rights Reserved.</p>
                        <p className="font-medium">Designed By HONEY PATHAK</p>
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
