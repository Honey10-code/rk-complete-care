import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/images/LOGO.png";
import { getServices, getExercises } from "../services/api";

const shimmerStyle = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shimmer {
    animation: shimmer 2.5s infinite;
  }
`;

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [exercisesOpen, setExercisesOpen] = useState(false);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
    const [mobileExercisesOpen, setMobileExercisesOpen] = useState(false);
    const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false);
    const [services, setServices] = useState([]);
    const [exercises, setExercises] = useState([]);
    const location = useLocation();
    const servicesRef = useRef(null);
    const exercisesRef = useRef(null);
    const galleryRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sData = await getServices();
                setServices(sData || []);
                const eData = await getExercises();
                setExercises(eData || []);
            } catch (err) {
                console.error("Failed to fetch nav data:", err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => { if (window.innerWidth >= 1024) setIsOpen(false); };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (servicesRef.current && !servicesRef.current.contains(e.target)) setServicesOpen(false);
            if (exercisesRef.current && !exercisesRef.current.contains(e.target)) setExercisesOpen(false);
            if (galleryRef.current && !galleryRef.current.contains(e.target)) setGalleryOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Prevent background scrolling when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const navLinks = [
        { label: "Home", to: "/", type: "link" },
        { label: "About", to: "/about", type: "link" },
        { label: "Services", to: "/services", type: "dropdown" },
        { label: "Exercises", to: "/exercises", type: "dropdown" },
        { label: "Doctors", to: "/doctors", type: "link" },
        { label: "Stories", to: "/patient-stories", type: "link" },
        { label: "Blogs", to: "/clinic-posters", type: "link" },
        { label: "Gallery", to: "/gallery", type: "dropdown" },
        { label: "Contact", to: "/contact", type: "link" },
    ];

    return (
        <div className="fixed top-0 left-0 w-full z-[140] transition-all duration-500 bg-white">
            <style>{shimmerStyle}</style>

            {/* Premium Emerald Top Contact Bar with Socials */}
            <div className="w-full bg-[#064e3b] py-1.5 md:py-2 border-b border-emerald-400/20 relative shadow-lg overflow-hidden">
                {/* Dynamic Light Sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/5 to-transparent -translate-x-full animate-shimmer"></div>

                <div className="max-w-[1536px] mx-auto px-4 md:px-6 lg:px-10 flex flex-wrap justify-between items-center gap-y-1">
                    {/* Contact Details */}
                    <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-center sm:justify-start">
                        <a href="mailto:rkthecompletecare@gmail.com" className="flex items-center gap-1.5 text-[9px] md:text-[11px] font-bold text-emerald-50 hover:text-white transition-colors uppercase tracking-widest group">
                            <i className="fa-solid fa-envelope text-emerald-300 group-hover:scale-110 transition-transform"></i>
                            <span className="xs:inline">rkthecompletecare@gmail.com</span>

                        </a>
                        <a href="tel:+918769556475" className="flex items-center gap-1.5 text-[9px] md:text-[11px] font-bold text-emerald-50 hover:text-white transition-colors uppercase tracking-widest group">
                            <i className="fa-solid fa-phone text-emerald-300 group-hover:scale-110 transition-transform"></i>
                            +91 87695 56475
                        </a>
                    </div>

                    {/* Socials & Location */}
                    <div className="flex items-center gap-3 sm:gap-5 mx-auto sm:mx-0">
                        {/* Social Icons */}
                        <div className="flex items-center gap-3 border-r border-emerald-400/20 pr-4 mr-1">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-emerald-100 hover:text-white transition-all text-sm" title="Facebook">
                                <i className="fa-brands fa-facebook-f"></i>
                            </a>
                            <a href="https://www.instagram.com/rkthecompletecare/" target="_blank" rel="noopener noreferrer" className="text-emerald-100 hover:text-white transition-all text-sm" title="Instagram">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                            <a href="https://maps.app.goo.gl/5puqhfAmyGvwu8m17" target="_blank" rel="noopener noreferrer" className="text-emerald-100 hover:text-white transition-all text-sm" title="Location Map">
                                <i className="fa-solid fa-location-dot"></i>
                            </a>
                        </div>




                    </div>
                </div>
            </div>

            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full transition-all duration-500 border-b ${scrolled
                    ? "shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] py-2 md:py-3 border-blue-50/50"
                    : "py-4 md:py-5 border-transparent"
                    }`}
            >
                <div className="w-full max-w-[1536px] px-3 md:px-6 lg:px-10 mx-auto flex items-center justify-between gap-2 lg:gap-4">

                    {/* Block 1: Branding */}
                    <div className="flex-none shrink-0 z-[120]">
                        <Link to="/" className="flex items-center gap-2 md:gap-3 relative group">
                            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border-2 border-blue-100 shadow-sm group-hover:shadow-md transition-all shrink-0 overflow-hidden flex items-center justify-center">
                                <img src={logo} alt="RK" className="w-full h-full object-cover scale-[1.35] transform transition-transform duration-400 group-hover:scale-150" />
                            </div>
                            <div className="flex flex-col leading-tight">
                                <span className="text-[11px] md:text-[13px] lg:text-[15px] font-black text-slate-900 tracking-tight whitespace-nowrap">RK The Complete Care</span>
                                <span className="text-[7px] md:text-[8px] lg:text-[9px] font-bold text-blue-600 uppercase tracking-[0.1em]">Where Recovery Begins</span>
                            </div>
                        </Link>
                    </div>

                    {/* Block 2: Navigation Menu */}
                    <div className="hidden lg:flex flex-1 justify-center items-center px-2">
                        <div className="flex items-center gap-0.5 xl:gap-1 2xl:gap-2">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.to || (link.type === "dropdown" && location.pathname.startsWith(link.to));

                                if (link.label === "Services") {
                                    return (
                                        <div
                                            key={link.label}
                                            className="relative"
                                            ref={servicesRef}
                                            onMouseEnter={() => setServicesOpen(true)}
                                            onMouseLeave={() => setServicesOpen(false)}
                                        >
                                            <button
                                                onClick={() => setServicesOpen(!servicesOpen)}
                                                className={`relative px-2 xl:px-3 py-2 rounded-full text-[11px] xl:text-[13px] 2xl:text-[14px] font-bold transition-all flex items-center gap-1 xl:gap-1.5 ${isActive ? 'text-blue-700 bg-blue-50/50' : 'text-slate-600 hover:text-blue-600'} group z-10 whitespace-nowrap`}
                                            >
                                                <i className="fa-solid fa-hand-holding-medical opacity-70"></i>
                                                {link.label}
                                                <i className={`fa-solid fa-chevron-down text-[8px] transition-transform ${servicesOpen ? 'rotate-180' : ''}`}></i>
                                            </button>
                                            <AnimatePresence>
                                                {servicesOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 15, x: "-50%" }}
                                                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                                                        exit={{ opacity: 0, y: 15, x: "-50%" }}
                                                        className="absolute top-full left-1/2 mt-4 w-[480px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[150] p-2"
                                                    >
                                                        <div className="relative h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 flex items-center mb-2">
                                                            <div className="z-10 text-white">
                                                                <h4 className="font-black text-base uppercase">Elite Physiotherapy</h4>
                                                                <p className="text-[10px] opacity-80">Advanced treatment protocols</p>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-1 p-1">
                                                            {services.slice(0, 8).map(s => (
                                                                <Link
                                                                    key={s._id}
                                                                    to={`/services?condition=${s.id}`}
                                                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50/50 transition-all text-[10px] font-bold text-slate-800 uppercase"
                                                                    onClick={() => setServicesOpen(false)}
                                                                >
                                                                    <div className="w-8 h-8 rounded-lg bg-blue-100/50 flex items-center justify-center text-blue-600">
                                                                        <i className={`fa-solid ${s.icon || 'fa-notes-medical'}`}></i>
                                                                    </div>
                                                                    {s.title} <span className="ml-1 text-[9px] font-black text-blue-600/60 lowercase tracking-normal">({s.titleHi})</span>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                        {/* View All Footer */}
                                                        <div className="mt-1 p-1">
                                                            <Link
                                                                to="/services"
                                                                className="flex items-center justify-center gap-2 w-full p-4 bg-slate-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                                                                onClick={() => setServicesOpen(false)}
                                                                title="View all clinical services"
                                                            >
                                                                View All Expert Clinical Services
                                                                <i className="fa-solid fa-circle-arrow-right"></i>
                                                            </Link>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                }

                                if (link.label === "Gallery") {
                                    return (
                                        <div
                                            key={link.label}
                                            className="relative"
                                            ref={galleryRef}
                                            onMouseEnter={() => setGalleryOpen(true)}
                                            onMouseLeave={() => setGalleryOpen(false)}
                                        >
                                            <button
                                                onClick={() => setGalleryOpen(!galleryOpen)}
                                                className={`relative px-2 xl:px-3 py-2 rounded-full text-[11px] xl:text-[13px] 2xl:text-[14px] font-bold transition-all flex items-center gap-1 xl:gap-1.5 ${isActive ? 'text-blue-700 bg-blue-50/50' : 'text-slate-600 hover:text-blue-600'} group z-10 whitespace-nowrap`}
                                            >
                                                <i className="fa-solid fa-images opacity-70"></i>
                                                {link.label}
                                                <i className={`fa-solid fa-chevron-down text-[8px] transition-transform ${galleryOpen ? 'rotate-180' : ''}`}></i>
                                            </button>
                                            <AnimatePresence>
                                                {galleryOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 15 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 15 }}
                                                        className="absolute top-full left-0 mt-4 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[150] p-2"
                                                    >
                                                        <div className="space-y-1">
                                                            <Link to="/gallery?tab=photos" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-[11px] font-bold text-slate-700" onClick={() => setGalleryOpen(false)}>
                                                                <i className="fa-solid fa-camera-retro text-blue-500"></i> Our Physiotherapy Center Gallery
                                                            </Link>
                                                            <Link to="/gallery?tab=videos" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-[11px] font-bold text-slate-700" onClick={() => setGalleryOpen(false)}>
                                                                <i className="fa-solid fa-play-circle text-blue-500"></i> Video
                                                            </Link>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                }

                                if (link.label === "Exercises") {
                                    return (
                                        <div
                                            key={link.label}
                                            className="relative"
                                            ref={exercisesRef}
                                            onMouseEnter={() => setExercisesOpen(true)}
                                            onMouseLeave={() => setExercisesOpen(false)}
                                        >
                                            <button
                                                onClick={() => setExercisesOpen(!exercisesOpen)}
                                                className={`relative px-2 xl:px-3 py-2 rounded-full text-[11px] xl:text-[13px] 2xl:text-[14px] font-bold transition-all flex items-center gap-1 xl:gap-1.5 ${isActive ? 'text-blue-700 bg-blue-50/50' : 'text-slate-600 hover:text-blue-600'} group z-10 whitespace-nowrap`}
                                            >
                                                <i className="fa-solid fa-person-running opacity-70"></i>
                                                {link.label}
                                                <i className={`fa-solid fa-chevron-down text-[8px] transition-transform ${exercisesOpen ? 'rotate-180' : ''}`}></i>
                                            </button>
                                            <AnimatePresence>
                                                {exercisesOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 15, x: "-50%" }}
                                                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                                                        exit={{ opacity: 0, y: 15, x: "-50%" }}
                                                        className="absolute top-full left-1/2 mt-4 w-[480px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[150] p-2"
                                                    >
                                                        <div className="relative h-20 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 flex items-center mb-2">
                                                            <div className="z-10 text-white">
                                                                <h4 className="font-black text-base uppercase">Recovery Protocols</h4>
                                                                <p className="text-[10px] opacity-80">Home-based exercise guides</p>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-1 p-1">
                                                            {exercises.slice(0, 8).map(e => (
                                                                <Link
                                                                    key={e._id}
                                                                    to={`/exercises?id=${e.id}`}
                                                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50/50 transition-all text-[10px] font-bold text-slate-800 uppercase"
                                                                    onClick={() => setExercisesOpen(false)}
                                                                >
                                                                    <div className="w-8 h-8 rounded-lg bg-emerald-100/50 flex items-center justify-center text-emerald-600">
                                                                        <i className={`fa-solid ${e.icon || 'fa-person-running'}`}></i>
                                                                    </div>
                                                                    {e.title} <span className="ml-1 text-[9px] font-black text-emerald-600/60 lowercase tracking-normal">({e.hindi})</span>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                        <div className="mt-1 p-1">
                                                            <Link
                                                                to="/exercises"
                                                                className="flex items-center justify-center gap-2 w-full p-4 bg-slate-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                                                                onClick={() => setExercisesOpen(false)}
                                                            >
                                                                View All Home Recovery Guides
                                                                <i className="fa-solid fa-circle-arrow-right"></i>
                                                            </Link>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={link.label} className={`relative ${(link.label === "Stories" || link.label === "Blogs") ? "hidden xl:flex" : "flex"}`}>
                                        <Link to={link.to} className={`relative px-2 xl:px-3 py-2 rounded-full text-[11px] xl:text-[13px] 2xl:text-[14px] font-bold transition-all flex items-center gap-1 xl:gap-1.5 ${isActive ? 'text-blue-700 bg-blue-50/50' : 'text-slate-600 hover:text-blue-600'} group z-10 whitespace-nowrap`}>
                                            <i className={`fa-solid ${link.label === "Home" ? "fa-house-chimney" : link.label === "About" ? "fa-circle-info" : link.label === "Exercises" ? "fa-person-running" : link.label === "Doctors" ? "fa-user-doctor" : link.label === "Stories" ? "fa-comment-medical" : link.label === "Blogs" ? "fa-newspaper" : link.label === "Contact" ? "fa-paper-plane" : ""} text-[11px] xl:text-[14px] opacity-70`}></i>
                                            {link.label}
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Block 3: CTA */}
                    <div className="flex-none shrink-0 flex justify-end z-[120]">
                        <Link
                            to="/booking"
                            className="book-btn px-5 xl:px-8 py-2 md:py-3.5 rounded-full font-black text-[11px] 2xl:text-[14px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md hover:-translate-y-1 transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0"
                        >
                            Book Appointment <i className="fa-solid fa-calendar-check text-[15px]"></i>
                        </Link>
                    </div>

                    {/* Mobile Icon */}
                    <button className="lg:hidden flex-none z-[130] w-10 h-10 flex flex-col justify-center items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 shadow-sm shrink-0" onClick={() => setIsOpen(!isOpen)}>
                        <span className={`w-5 h-0.5 rounded-full bg-slate-700 transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                        <span className={`w-5 h-0.5 rounded-full bg-slate-700 transition-all ${isOpen ? "opacity-0" : ""}`}></span>
                        <span className={`w-5 h-0.5 rounded-full bg-slate-700 transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-full h-screen z-[200] lg:hidden">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setIsOpen(false)} />
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="absolute top-0 right-0 w-[85%] max-w-sm h-full bg-white flex flex-col shadow-2xl">
                            <div className="p-6 border-b flex items-center justify-between">
                                <div className="flex items-center gap-2"><div className="w-10 h-10 rounded-full border border-blue-100 overflow-hidden"><img src={logo} className="w-full h-full object-cover scale-[1.35]" /></div><span className="font-black text-slate-800 text-sm">RK CARE</span></div>
                                <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center"><i className="fa-solid fa-xmark text-lg"></i></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {navLinks.map((link, i) => (
                                    <motion.div key={link.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + (i * 0.05) }}>
                                        {link.type === "dropdown" ? (
                                            <div className="space-y-1">
                                                <button onClick={() => {
                                                    if (link.label === "Services") setMobileServicesOpen(!mobileServicesOpen);
                                                    else if (link.label === "Exercises") setMobileExercisesOpen(!mobileExercisesOpen);
                                                    else setMobileGalleryOpen(!mobileGalleryOpen);
                                                }} className="flex items-center justify-between w-full px-5 py-4 rounded-xl font-bold text-lg text-slate-600 hover:bg-slate-50">
                                                    <div className="flex items-center gap-3"><i className={`fa-solid ${link.label === "Services" ? "fa-hand-holding-medical" : link.label === "Exercises" ? "fa-person-running" : "fa-images"} opacity-50`}></i>{link.label}</div>
                                                    <i className={`fa-solid fa-chevron-down text-sm transition-transform ${(link.label === "Services" ? mobileServicesOpen : link.label === "Exercises" ? mobileExercisesOpen : mobileGalleryOpen) ? "rotate-180" : ""}`}></i>
                                                </button>
                                                <AnimatePresence>
                                                    {((link.label === "Services" && mobileServicesOpen) || (link.label === "Exercises" && mobileExercisesOpen) || (link.label === "Gallery" && mobileGalleryOpen)) && (
                                                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="overflow-hidden pl-4 space-y-1 border-l-2 border-blue-50/50 my-2">
                                                            {link.label === "Services" ? (
                                                                <>
                                                                    {services.slice(0, 10).map(s => (
                                                                        <Link
                                                                            key={s._id}
                                                                            to={`/services?condition=${s.id}`}
                                                                            onClick={() => setIsOpen(false)}
                                                                            className="flex items-center gap-2 px-5 py-3 rounded-xl text-slate-500 font-semibold text-sm hover:text-blue-600 hover:bg-blue-50/50 transition-all"
                                                                        >
                                                                            <i className="fa-solid fa-notes-medical text-[10px] opacity-40"></i>
                                                                            {s.title} <span className="ml-1 text-[10px] font-bold text-blue-600/50">({s.titleHi})</span>
                                                                        </Link>
                                                                    ))}
                                                                    <Link
                                                                        to="/services"
                                                                        onClick={() => setIsOpen(false)}
                                                                        className="flex items-center justify-between px-5 py-4 rounded-xl text-blue-600 font-black text-[11px] uppercase tracking-[0.2em] bg-blue-50/50 mt-2 shadow-inner"
                                                                    >
                                                                        View All Expert Services
                                                                        <i className="fa-solid fa-arrow-right-long"></i>
                                                                    </Link>
                                                                </>
                                                            ) : link.label === "Exercises" ? (
                                                                <>
                                                                    {exercises.slice(0, 10).map(e => (
                                                                        <Link
                                                                            key={e._id}
                                                                            to={`/exercises?id=${e.id}`}
                                                                            onClick={() => setIsOpen(false)}
                                                                            className="flex items-center gap-2 px-5 py-3 rounded-xl text-slate-500 font-semibold text-sm hover:text-emerald-600 hover:bg-emerald-50/50 transition-all"
                                                                        >
                                                                            <i className="fa-solid fa-person-running text-[10px] opacity-40"></i>
                                                                            {e.title} <span className="ml-1 text-[10px] font-bold text-emerald-600/50">({e.hindi})</span>
                                                                        </Link>
                                                                    ))}
                                                                    <Link
                                                                        to="/exercises"
                                                                        onClick={() => setIsOpen(false)}
                                                                        className="flex items-center justify-between px-5 py-4 rounded-xl text-emerald-600 font-black text-[11px] uppercase tracking-[0.2em] bg-emerald-50/50 mt-2 shadow-inner"
                                                                    >
                                                                        View All Recovery Guides
                                                                        <i className="fa-solid fa-arrow-right-long"></i>
                                                                    </Link>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Link to="/gallery?tab=photos" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-5 py-3 rounded-xl text-slate-500 font-semibold text-sm hover:text-blue-600 hover:bg-blue-50/50 transition-all">
                                                                        <i className="fa-solid fa-camera-retro text-[10px] opacity-40"></i> Photos
                                                                    </Link>
                                                                    <Link to="/gallery?tab=videos" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-5 py-3 rounded-xl text-slate-500 font-semibold text-sm hover:text-blue-600 hover:bg-blue-50/50 transition-all">
                                                                        <i className="fa-solid fa-circle-play text-[10px] opacity-40"></i> Videos
                                                                    </Link>
                                                                </>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <Link to={link.to} onClick={() => setIsOpen(false)} className={`flex items-center gap-3 px-5 py-4 rounded-xl font-bold text-lg ${location.pathname === link.to ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
                                                <i className={`fa-solid ${link.label === "Home" ? "fa-house-chimney" : link.label === "About" ? "fa-circle-info" : link.label === "Exercises" ? "fa-person-running" : link.label === "Doctors" ? "fa-user-doctor" : link.label === "Stories" ? "fa-comment-medical" : link.label === "Blogs" ? "fa-newspaper" : link.label === "Contact" ? "fa-paper-plane" : ""} opacity-70`}></i> {link.label}
                                            </Link>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar;
