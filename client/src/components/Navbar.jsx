import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/images/LOGO.png";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => { if (window.innerWidth >= 768) setIsOpen(false); };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
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
        { label: "Services", to: "/services", type: "link" },
        { label: "Gallery", to: "/gallery", type: "link" },
        { label: "Exercises", to: "/exercises", type: "link" },
        { label: "Doctors", to: "/doctors", type: "link" },
        { label: "Stories", to: "/patient-stories", type: "link" },
        { label: "Posters", to: "/clinic-posters", type: "link" },
        { label: "Contact", to: "/contact", type: "link" },
    ];

    return (
        <div className={`fixed w-full z-[100] transition-all duration-500 flex justify-center ${scrolled ? 'top-0 px-0' : 'top-4 px-4 md:px-6'}`}>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`flex items-center justify-between w-full transition-all duration-500 ${scrolled
                    ? "bg-white/95 backdrop-blur-xl shadow-md py-3 md:py-4 px-4 md:px-8 rounded-none border-b border-slate-200/50"
                    : "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-3 px-5 md:px-8 rounded-2xl md:rounded-[2rem] max-w-7xl border border-slate-100"
                    }`}
            >
                {/* Premium Logo Section */}
                <Link to="/" className="flex items-center gap-3 z-50 relative group">
                    <div className="p-1 rounded-xl bg-slate-50 border border-slate-100 shadow-sm group-hover:shadow-md group-hover:border-blue-100 transition-all duration-300 shrink-0">
                        <img
                            src={logo}
                            alt="RK The Complete Care"
                            className="h-10 md:h-12 w-auto object-contain transform group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => (e.target.style.display = "none")}
                        />
                    </div>
                </Link>

                {/* Desktop Menu with Framer Motion Shared Layout */}
                <div className="hidden lg:flex items-center justify-center flex-1 mx-4 gap-2">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.to;
                        return link.type === "link" ? (
                            <div key={link.label} className="relative">
                                <Link
                                    to={link.to}
                                    className={`relative px-4 py-2 rounded-full text-[14px] font-semibold transition-all duration-300 flex items-center justify-center ${isActive ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'} group z-10`}
                                >
                                    {link.label}
                                </Link>
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-active-indicator"
                                        className="absolute inset-0 bg-slate-100 rounded-full"
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    />
                                )}
                            </div>
                        ) : null;
                    })}
                </div>

                {/* Premium CTA Button */}
                <div className="hidden lg:block shrink-0 pl-2">
                    <Link
                        to="/booking"
                        className="book-btn px-8 py-3 rounded-full font-bold text-[14px]     
                        bg-[#2563EB] hover:bg-[#1D4ED8] 
                        text-white transition-all duration-300 
                        shadow-sm hover:shadow-md hover:-translate-y-0.5 
                        transform flex items-center gap-2"
                    >
                        <span>Book Appointment</span>
                    </Link>
                </div>

                {/* Mobile Hamburger Menu Token */}
                <button
                    className="lg:hidden z-50 w-10 h-10 flex flex-col justify-center items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors duration-300 shadow-sm"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`w-5 h-0.5 rounded-full transition-all duration-300 bg-slate-700 ${isOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                    <span className={`w-5 h-0.5 rounded-full transition-all duration-300 bg-slate-700 ${isOpen ? "opacity-0" : ""}`}></span>
                    <span className={`w-5 h-0.5 rounded-full transition-all duration-300 bg-slate-700 ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
                </button>

                {/* Enhanced Full-Screen Mobile Menu Overlay */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
                            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="fixed inset-0 w-screen h-[100dvh] bg-slate-900/40 z-40 flex flex-col items-center justify-center lg:hidden"
                        >
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="w-11/12 max-w-sm bg-white rounded-[2rem] shadow-2xl p-6 flex flex-col my-auto border border-white/50"
                            >
                                <div className="flex flex-col items-center gap-2 w-full max-h-[70vh] overflow-y-auto no-scrollbar scroll-smooth">
                                    <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-4"></div>
                                    
                                    {navLinks.map((link, i) => {
                                        const isActive = location.pathname === link.to;
                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ delay: 0.05 * i, duration: 0.3 }}
                                                key={link.label}
                                                className="w-full"
                                            >
                                                <Link 
                                                    to={link.to} 
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    className={`flex items-center justify-center text-[17px] font-black w-full text-center py-3.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100/50' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600 border border-transparent'}`}
                                                >
                                                    {link.label}
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                    
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ delay: 0.1 + (navLinks.length * 0.05), duration: 0.3 }}
                                        className="w-full mt-4 pt-4 border-t border-slate-100"
                                    >
                                        <Link 
                                            to="/booking" 
                                            onClick={() => {
                                                setIsOpen(false);
                                            }}
                                            className="book-btn flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-tr from-blue-700 to-indigo-600 text-white rounded-2xl font-black text-lg text-center shadow-[0_8px_20px_rgb(29,78,216,0.3)] hover:shadow-[0_12px_25px_rgb(29,78,216,0.4)] transition-all active:scale-95"
                                        >
                                            Book Appointment
                                            <i className="fa-solid fa-calendar-check text-[15px]"></i>
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </div>
    );
};

export default Navbar;
