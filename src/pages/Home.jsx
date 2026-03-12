import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Services from '../components/Services';
import Exercises from '../components/Exercises';
import Doctors from '../components/Doctors';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import BannerCarousel from '../components/BannerCarousel';

const stats = [
    { value: "5000+", label: "Patients Treated", icon: "fa-users" },
    { value: "10+", label: "Expert Doctors", icon: "fa-user-doctor" },
    { value: "15+", label: "Years Experience", icon: "fa-award" },
    { value: "98%", label: "Recovery Rate", icon: "fa-heart-pulse" },
];

const Home = () => {
    return (
        <>
            <Helmet>
                <title>Best Physiotherapy Clinic in Jaipur | RK The Complete Care</title>
                <meta name="description" content="Expert physiotherapy, orthopedic rehabilitation, and chiropractic care in Jaipur. Dr. Piyush Sharma and team provide personalized treatment for pain relief and recovery." />
                <meta name="keywords" content="physiotherapy jaipur, orthopedic doctor, chiropractor, back pain treatment, knee replacement rehab, sports injury" />
            </Helmet>
            <Navbar />

            {/* Banner Section */}
            <BannerCarousel />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
                {/* Background — smooth deep teal-navy */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0f172a 0%, #0f766e 55%, #0f172a 100%)" }}></div>
                    {/* Soft ambient orbs */}
                    <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full blur-[120px] animate-float"
                        style={{ background: "rgba(13, 148, 136,0.22)" }}></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] animate-float"
                        style={{ background: "rgba(217, 119, 6,0.12)", animationDelay: "3s" }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[80px] animate-float"
                        style={{ background: "rgba(45, 212, 191,0.10)", animationDelay: "1.5s" }}></div>
                    {/* Subtle grid */}
                    <div className="absolute inset-0 opacity-[0.04]"
                        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
                </div>

                <div className="container mx-auto px-6 py-32 md:py-40 relative z-10">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full text-white/85 text-sm font-semibold mb-6"
                            >
                                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#2dd4bf" }}></span>
                                Jhotwara's #1 Physiotherapy Centre
                            </motion.div>

                            <h1 className="text-white leading-tight mb-6 font-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <span className="block text-4xl md:text-5xl lg:text-6xl">RK – The</span>
                                <span className="block text-5xl md:text-6xl lg:text-7xl"
                                    style={{ background: "linear-gradient(135deg, #2dd4bf, #a0c8d5, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                    Complete Care
                                </span>
                                <span className="block text-2xl md:text-3xl font-semibold mt-2" style={{ color: "#f59e0b" }}>
                                    Physiotherapy Centre
                                </span>
                            </h1>

                            <p className="text-white/70 text-lg mb-8 max-w-lg leading-relaxed">
                                Experience premium, personalized physiotherapy care. We combine advanced techniques with compassionate treatment to help you regain strength and mobility.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <a href="tel:+918769556475"
                                    className="px-8 py-4 text-white rounded-2xl font-bold text-base flex items-center gap-2 transition-all duration-300 hover:-translate-y-1"
                                    style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)", boxShadow: "0 8px 24px rgba(13, 148, 136,0.35)" }}>
                                    <i className="fa-solid fa-phone"></i> Get Consultation
                                </a>
                                <a href="#services"
                                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/25 text-white rounded-2xl font-bold text-base hover:bg-white/18 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                                    <i className="fa-solid fa-stethoscope"></i> Explore Services
                                </a>
                            </div>

                            {/* Trust indicators */}
                            <div className="flex items-center gap-4 mt-8">
                                <div className="flex -space-x-2">
                                    {[['R', '#0d9488'], ['K', '#0f766e'], ['P', '#d97706'], ['S', '#2dd4bf']].map(([letter, bg], i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white/25 flex items-center justify-center text-white text-xs font-bold"
                                            style={{ background: bg }}>
                                            {letter}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-white/75 text-sm">
                                    <span className="font-bold" style={{ color: "#f59e0b" }}>★★★★★</span>
                                    <span className="ml-1">5000+ happy patients</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85, x: 60 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
                            className="relative hidden md:block"
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15">
                                <img
                                    src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop"
                                    alt="Physiotherapy Treatment"
                                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                                    onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Physiotherapy'; }}
                                />
                                <div className="absolute inset-0 flex items-end p-8"
                                    style={{ background: "linear-gradient(to top, rgba(30,50,64,0.75) 0%, transparent 60%)" }}>
                                    <div className="text-white">
                                        <p className="font-bold text-xl mb-1">Expert Physiotherapy</p>
                                        <p className="text-sm text-white/75">Personalized treatment plans for every patient</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating stat cards */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-slate-100"
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
                                    style={{ background: "linear-gradient(135deg, #0d9488, #2dd4bf)" }}>
                                    <i className="fa-solid fa-user-doctor"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Specialists</p>
                                    <p className="font-black text-slate-800 text-lg">10+ Doctors</p>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-slate-100"
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
                                    style={{ background: "linear-gradient(135deg, #d97706, #f59e0b)" }}>
                                    <i className="fa-solid fa-heart-pulse"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Recovery</p>
                                    <p className="font-black text-slate-800 text-lg">98% Rate</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-12 border-t border-white/10"
                    >
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center text-white">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl"
                                    style={{ color: "#2dd4bf" }}>
                                    <i className={`fa-solid ${stat.icon}`}></i>
                                </div>
                                <p className="text-3xl font-black text-white">{stat.value}</p>
                                <p className="text-white/60 text-sm font-medium mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-2"
                >
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <i className="fa-solid fa-chevron-down text-sm"></i>
                </motion.div>
            </section>

            <Services />
            <Exercises />
            <Doctors />
            <Testimonials />
            <Contact />
            <Footer />
        </>
    );
};

export default Home;
