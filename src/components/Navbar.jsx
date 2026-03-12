import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/images/LOGO.png";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => { if (window.innerWidth >= 768) setIsOpen(false); };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navLinks = [
        { label: "Home", to: "/", type: "link" },
        { label: "About", to: "/about", type: "link" },
        { label: "Services", href: "#services", type: "anchor" },
        { label: "Exercises", href: "#exercises", type: "anchor" },
        { label: "Doctors", href: "#doctors", type: "anchor" },
        { label: "Stories", to: "/patient-stories", type: "link" },
        { label: "Posters", to: "/clinic-posters", type: "link" },
        { label: "Contact", to: "/contact", type: "link" },
    ];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled
                ? "bg-white/97 backdrop-blur-xl shadow-sm shadow-slate-200/80 py-3 border-b border-slate-100"
                : "bg-[#0f172a]/85 backdrop-blur-md py-5"
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 z-50 relative group">
                    <div className={`p-1.5 rounded-xl transition-all duration-300 shrink-0 ${scrolled ? 'bg-slate-50' : 'bg-white/15 backdrop-blur-sm'}`}>
                        <img
                            src={logo}
                            alt="RK The Complete Care"
                            className="h-12 md:h-16 w-auto object-contain"
                            onError={(e) => (e.target.style.display = "none")}
                        />
                    </div>
                    <div className="hidden sm:block">
                        <span className={`block text-[15px] font-black tracking-tight leading-none ${scrolled ? 'text-[#0f766e]' : 'text-white'}`}>
                            RK The Complete Care
                        </span>
                        <span className={`block text-[15px] font-semibold mt-0.5 ${scrolled ? 'text-[#0d9488]' : 'text-slate-300'}`}>
                            Physiotherapy Centre
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) =>
                        link.type === "link" ? (
                            <Link
                                key={link.label}
                                to={link.to}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${scrolled
                                    ? "text-slate-600 hover:bg-slate-100 hover:text-[#0d9488]"
                                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ) : (
                            <a
                                key={link.label}
                                href={link.href}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${scrolled
                                    ? "text-slate-600 hover:bg-slate-100 hover:text-[#0d9488]"
                                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {link.label}
                            </a>
                        )
                    )}

                    <Link
                        to="/booking"
                        className="ml-3 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5"
                        style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)", color: "#f9fafb", boxShadow: "0 4px 15px rgba(13, 148, 136,0.30)" }}
                    >
                        <i className="fa-solid fa-calendar-plus text-xs"></i>
                        Book Appointment
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden z-50 w-10 h-10 flex flex-col justify-center items-center gap-1.5 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={`w-5 h-0.5 rounded transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2 bg-[#0d9488]" : scrolled ? "bg-slate-600" : "bg-white"}`}></span>
                    <span className={`w-5 h-0.5 rounded transition-all duration-300 ${isOpen ? "opacity-0" : scrolled ? "bg-slate-600" : "bg-white"}`}></span>
                    <span className={`w-5 h-0.5 rounded transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2 bg-[#0d9488]" : scrolled ? "bg-slate-600" : "bg-white"}`}></span>
                </button>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: "100%" }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-6 md:hidden"
                        >
                            {/* Decorative bg */}
                            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-40 -z-0" style={{ background: "rgba(13, 148, 136,0.12)" }}></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-40 -z-0" style={{ background: "rgba(217, 119, 6,0.10)" }}></div>

                            <div className="relative z-10 flex flex-col items-center gap-4 w-full px-8">
                                {navLinks.map((link) =>
                                    link.type === "link" ? (
                                        <Link key={link.label} to={link.to} onClick={() => setIsOpen(false)}
                                            className="text-xl font-bold text-slate-700 hover:text-[#0d9488] transition-colors w-full text-center py-3 border-b border-slate-100">
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <a key={link.label} href={link.href} onClick={() => setIsOpen(false)}
                                            className="text-xl font-bold text-slate-700 hover:text-[#0d9488] transition-colors w-full text-center py-3 border-b border-slate-100">
                                            {link.label}
                                        </a>
                                    )
                                )}
                                <Link to="/booking" onClick={() => setIsOpen(false)}
                                    className="mt-4 w-full py-4 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
                                    style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)", boxShadow: "0 6px 20px rgba(13, 148, 136,0.30)" }}>
                                    <i className="fa-solid fa-calendar-plus"></i> Book Appointment
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default Navbar;
