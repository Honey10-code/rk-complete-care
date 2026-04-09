import React, { useState, useEffect } from "react";
import logo from "../assets/images/LOGO.png";
import { getClinicInfo, getServices } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
    const [clinicInfo, setClinicInfo] = useState({
        phones: ["+91 8769556475", "+91 9782468376"],
        email: "rk.completecare@gmail.com",
        address: "21, Nirmal Vihar, Dadi ka Phatak, Near Victor Public School, Benad Road, Jhotwara, Jaipur",
        openingHours: { morning: "09:00 AM - 01:00 PM", evening: "04:00 PM - 08:00 PM", sunday: "09:00 AM - 12:00 PM" },
        socialLinks: { facebook: "https://www.facebook.com/profile.php?id=61581299196924", instagram: "https://www.instagram.com/rkthecompletecare/", whatsapp: "https://wa.me/918769556475", google: "https://g.page/r/CXkFsimafLKiEAE/review" }
    });
    const [servicesList, setServicesList] = useState([]);

    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        getClinicInfo()
            .then(data => { if (data) setClinicInfo(data); })
            .catch(() => { });

        getServices()
            .then(data => { if (data) setServicesList(data); })
            .catch(() => { });

        const handleScroll = () => setShowScrollTop(window.scrollY > 400);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    // Categories for grouping logic
    const categoryMapping = {
        "Specialized Rehab": ["Post-Op Care", "Geriatric Care", "Vertigo", "Osteoporosis", "Ankle Pain"],
        "Physiotherapy": [] // Rest go here
    };

    const quickLinks = [
        { label: "Home", href: "/" },
        { label: "Services", href: "/#services" },
        { label: "Exercises", href: "/#exercises" },
        { label: "Our Doctors", href: "/doctors" },
        { label: "Testimonials", href: "/#testimonials" },
        { label: "Book Appointment", href: "/#book-appointment", primary: true },
    ];

    const socialIcons = [
        { icon: "fa-facebook-f", key: "facebook", color: "hover:bg-blue-600", label: "Facebook" },
        { icon: "fa-instagram", key: "instagram", color: "hover:bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600", label: "Instagram" },
        { icon: "fa-whatsapp", key: "whatsapp", color: "hover:bg-green-600", label: "WhatsApp" },
        { icon: "fa-google", key: "google", color: "hover:bg-red-500", label: "Google" },
    ];

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <footer id="footer" className="relative bg-slate-950 text-slate-300 overflow-hidden font-sans">
            {/* Background Aesthetics */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/5 blur-[100px] rounded-full" />
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: `radial-gradient(#ffffff 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }}
                />
            </div>

            <div className="container mx-auto px-6 relative z-10 pt-20 pb-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16"
                >
                    {/* Column 1: Clinic Identity (3 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div variants={itemVariants} className="flex items-center gap-4">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-500"></div>
                                <div className="relative p-1.5 rounded-full bg-white/95 backdrop-blur-md border border-white/50 shadow-2xl w-20 h-20 flex items-center justify-center overflow-hidden">
                                    <img src={logo} alt="RK The Complete Care" className="w-full h-full object-cover scale-[1.3] transform group-hover:scale-110 transition duration-500" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-white font-black text-xl italic tracking-tight leading-none">RK <span className="text-blue-500">The Complete Care</span></h2>
                            </div>
                        </motion.div>

                        <motion.p variants={itemVariants} className="text-slate-400 leading-relaxed text-sm max-w-sm">
                            At RK The Complete Care, we combine advanced physiotherapy techniques with compassionate care to help you reclaim your mobility and live a pain-free life.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex gap-3">
                            {socialIcons.map(({ icon, key, color, label }) => (
                                <a
                                    key={key}
                                    href={clinicInfo.socialLinks?.[key] || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 ${color} hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg`}
                                >
                                    <i className={`fa-brands ${icon} text-lg`}></i>
                                </a>
                            ))}
                        </motion.div>
                    </div>

                    {/* Column 2: Quick Links (2 cols) */}
                    <div className="lg:col-span-2">
                        <motion.h3 variants={itemVariants} className="text-white font-bold text-sm uppercase tracking-wider mb-8 flex items-center gap-2">
                            <span className="w-6 h-[2px] bg-blue-500"></span>
                            Explore
                        </motion.h3>
                        <ul className="space-y-4">
                            {quickLinks.map(link => (
                                <motion.li key={link.label} variants={itemVariants}>
                                    <Link
                                        to={link.href}
                                        className={`group text-sm flex items-center gap-2 transition-all duration-300 ${link.primary ? 'text-blue-400 font-bold hover:text-blue-300' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        <i className="fa-solid fa-arrow-right text-[10px] opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all"></i>
                                        {link.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Treatments & Specialties (4 cols) */}
                    <div className="lg:col-span-4">
                        <motion.h3 variants={itemVariants} className="text-white font-bold text-sm uppercase tracking-wider mb-8 flex items-center gap-2">
                            <span className="w-6 h-[2px] bg-emerald-500"></span>
                            Specialties
                        </motion.h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                            {[
                                { title: "Physiotherapy", icon: "fa-person-dots-from-line", filter: (s) => !categoryMapping["Specialized Rehab"].includes(s.title) },
                                { title: "Specialized Rehab", icon: "fa-user-nurse", filter: (s) => categoryMapping["Specialized Rehab"].includes(s.title) }
                            ].map((cat) => (
                                <div key={cat.title} className="space-y-4">
                                    <h4 className="text-xs font-bold text-blue-400/80 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5 pb-2">
                                        <i className={`fa-solid ${cat.icon}`}></i>
                                        {cat.title}
                                    </h4>
                                    <ul className="space-y-2.5">
                                        {servicesList.filter(cat.filter).map(s => (
                                            <li key={s.id}>
                                                <Link to={`/services?condition=${s.id}`} className="text-[11px] text-slate-500 hover:text-blue-400 transition-all block leading-tight hover:translate-x-1">
                                                    {s.title}
                                                </Link>
                                            </li>
                                        ))}
                                        {servicesList.length === 0 && (
                                            <li className="text-[10px] text-slate-600 italic">No services listed</li>
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Column 4: Schedule & Consultants (2 cols) */}
                    <div className="lg:col-span-2">
                        <motion.h3 variants={itemVariants} className="text-white font-bold text-sm uppercase tracking-wider mb-8 flex items-center gap-2">
                            <span className="w-6 h-[2px] bg-orange-500"></span>
                            Opening Hours
                        </motion.h3>
                        <div className="space-y-4 mb-8">
                            <motion.div variants={itemVariants} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm group hover:border-blue-500/30 transition-all">
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter mb-1">Mon - Sat</p>
                                <p className="text-xs text-slate-300 font-medium">{clinicInfo.openingHours.morning}</p>
                                <p className="text-xs text-slate-300 font-medium mt-0.5">{clinicInfo.openingHours.evening}</p>
                            </motion.div>
                            <motion.div variants={itemVariants} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm group hover:border-orange-500/30 transition-all">
                                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-tighter mb-1">Sunday</p>
                                <p className="text-xs text-slate-300 font-medium">{clinicInfo.openingHours.sunday}</p>
                            </motion.div>
                        </div>

                        <motion.h3 variants={itemVariants} className="text-white font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                            <span className="w-6 h-[2px] bg-blue-500"></span>
                            Lead Consultants
                        </motion.h3>
                        <div className="space-y-3">
                            <motion.div variants={itemVariants} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <p className="text-xs font-bold text-slate-200">Dr. Piyush Sharma</p>
                            </motion.div>
                            <motion.div variants={itemVariants} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                <p className="text-xs font-bold text-slate-200">Dr. Soniya Pathak</p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Contact & Map Strip */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="grid lg:grid-cols-12 gap-6 pb-12 border-b border-slate-900 items-stretch"
                >
                    <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
                        {/* Address Box */}
                        <a
                            href="https://maps.app.goo.gl/5puqhfAmyGvwu8m17"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 hover:bg-white/[0.04] transition-all group items-start"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <i className="fa-solid fa-location-dot text-lg md:text-xl"></i>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Clinical Address</p>
                                <p className="text-xs md:text-sm text-slate-300 leading-relaxed italic group-hover:text-white transition-colors">{clinicInfo.address}</p>
                            </div>
                        </a>
                        {/* Contact Box */}
                        <div className="p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 hover:bg-white/[0.04] transition-all items-start">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-500 shrink-0">
                                <i className="fa-solid fa-headset text-lg md:text-xl"></i>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Quick Contact</p>
                                <div className="space-y-1">
                                    {(clinicInfo.phones || []).map((p, i) => (
                                        <a key={i} href={`tel:${p.replace(/\s/g, "")}`} className="block text-sm font-semibold text-slate-200 hover:text-emerald-400 transition-colors">{p}</a>
                                    ))}
                                    <a href={`mailto:${clinicInfo.email}`} className="block text-[10px] md:text-xs text-slate-500 truncate hover:text-blue-400 transition-colors uppercase tracking-tight">{clinicInfo.email}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Small Map Hub - Restored for visibility */}
                    <div className="lg:col-span-4 relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl min-h-[160px] lg:min-h-0">
                        <a
                            href="https://maps.app.goo.gl/5puqhfAmyGvwu8m17"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 z-20 cursor-pointer"
                        >
                            <span className="sr-only">Open Clinic Profile on Google Maps</span>
                        </a>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3555.847170220273!2d75.74184381110409!3d26.971738676514477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db368ac6c1b05%3A0xa2b27c9a29b20579!2sRK%20%E2%80%93%20The%20Complete%20Care%20Physiotherapy%20Centre!5e0!3m2!1sen!2sin!4v1775719822325!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            className="transition-all duration-700 scale-105 group-hover:scale-100"
                        />
                        <div className="absolute bottom-3 right-3 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest flex items-center gap-1.5 group-hover:bg-white group-hover:text-slate-950 transition-all shadow-xl z-30">
                            Navigate <i className="fa-solid fa-location-arrow"></i>
                        </div>
                    </div>
                </motion.div>

                {/* Bottom Bar */}
                <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-medium tracking-wide text-slate-500">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <p>© {new Date().getFullYear()} <span className="text-white font-black italic">RK<span className="text-blue-500">The Complete Care</span></span>. All Rights Reserved.</p>
                        <div className="flex gap-4 uppercase font-bold tracking-widest text-[9px]">
                            <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
                            <span className="text-slate-700 font-normal">|</span>
                            <Link to="/terms-of-service" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 py-2 px-4 rounded-full bg-white/[0.03] border border-white/5">
                        <span className="uppercase text-[9px] text-slate-600">Developed By</span>
                        <span className="text-slate-300 font-black tracking-widest text-[11px]">HONEY <span className="text-blue-500">PATHAK</span></span>
                    </div>
                </div>
            </div>

            {/* Floating Interaction Elements */}
            <AnimatePresence>
                {/* Back to Top */}
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        onClick={scrollToTop}
                        className="fixed bottom-24 right-5 w-10 h-10 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-blue-600 transition-all z-50 shadow-2xl group"
                    >
                        <i className="fa-solid fa-chevron-up group-hover:-translate-y-1 transition-transform"></i>
                    </motion.button>
                )}

                {/* WhatsApp FAB */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="fixed bottom-6 left-6 z-50 pointer-events-auto"
                >
                    <a
                        href="https://wa.me/918769556475"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block w-14 h-14 rounded-2xl overflow-hidden group shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-green-600 to-emerald-400 group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-white text-3xl">
                            <i className="fa-brands fa-whatsapp drop-shadow-lg"></i>
                        </div>
                        <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                    </a>
                </motion.div>

                {/* Call FAB */}
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="fixed bottom-6 right-6 z-50 pointer-events-auto"
                >
                    <a
                        href="tel:+918769556475"
                        className="relative block w-14 h-14 rounded-2xl overflow-hidden group shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-400 group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-white text-2xl">
                            <i className="fa-solid fa-phone drop-shadow-lg"></i>
                        </div>
                        <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                    </a>
                </motion.div>
            </AnimatePresence>
        </footer>
    );
};

export default Footer;
;
