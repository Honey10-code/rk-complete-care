import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
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
            <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-50">
                {/* Background — Clean & Professional */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)" }}></div>
                    {/* Subtle pattern instead of orbs */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: 'radial-gradient(#1e40af 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
                </div>

                <div className="container mx-auto px-6 py-24 md:py-32 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                        >
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 border border-blue-200 rounded-full text-blue-800 text-[10px] font-bold uppercase tracking-wider mb-6"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                Jhotwara's #1 Physiotherapy Centre
                            </motion.div>

                            <h1 className="text-slate-900 leading-tight mb-6 font-extrabold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <span className="block text-4xl md:text-5xl lg:text-6xl">RK – The</span>
                                <span className="block text-5xl md:text-6xl lg:text-7xl text-blue-800">
                                    Complete Care
                                </span>
                                <span className="block text-xl md:text-2xl font-bold mt-3 text-slate-600">
                                    Physiotherapy & Rehabilitation
                                </span>
                            </h1>

                            <p className="text-slate-600 text-lg mb-8 max-w-lg leading-relaxed">
                                Professional, personalized physiotherapy care. We combine advanced therapy with compassionate treatment to help you recover faster and live pain-free.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <a href="tel:+918769556475"
                                    className="px-8 py-3.5 bg-blue-700 text-white rounded-xl font-bold text-base flex items-center gap-2 transition-all duration-200 hover:bg-blue-800 shadow-lg shadow-blue-200">
                                    <i className="fa-solid fa-phone"></i> Book Consultation
                                </a>
                                <a href="#services"
                                    className="px-8 py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-base hover:bg-slate-100 transition-all duration-200 flex items-center gap-2">
                                    Our Services
                                </a>
                            </div>

                            {/* Simple Trust indicator */}
                            <div className="mt-10 flex items-center gap-3">
                                <div className="flex items-center text-amber-500 text-sm">
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                    <i className="fa-solid fa-star"></i>
                                </div>
                                <span className="text-slate-500 font-medium text-sm">Trusted by 5000+ patients in Jaipur</span>
                            </div>
                        </motion.div>

                        {/* Right Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="relative hidden md:block"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                                <img
                                    src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop"
                                    alt="Physiotherapy Treatment"
                                    className="w-full h-auto object-cover"
                                    onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=Physiotherapy'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 text-transparent to-transparent"></div>
                            </div>

                            {/* Simple stat labels */}
                            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 border border-slate-100">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Success Rate</p>
                                <p className="font-black text-blue-800 text-2xl">98%</p>
                            </div>

                            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 border border-slate-100">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Experience</p>
                                <p className="font-black text-blue-800 text-2xl">15+ Yrs</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-slate-200"
                    >
                        {stats.map((stat, i) => (
                            <div key={i} className="flex flex-col items-center md:items-start">
                                <div className="text-blue-700 text-xl mb-2">
                                    <i className={`fa-solid ${stat.icon}`}></i>
                                </div>
                                <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">{stat.label}</p>
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

            {/* Quick Access Teasers */}
            <section className="py-20 bg-white border-b border-slate-50">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Services Teaser */}
                        <motion.div whileHover={{ y: -5 }} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center group">
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 text-xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <i className="fa-solid fa-hand-holding-medical"></i>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Elite Services</h3>
                            <p className="text-slate-500 text-xs mb-6 font-medium leading-relaxed">Advanced orthopedic rehab and personalized therapy plans.</p>
                            <Link to="/services" className="mt-auto text-blue-700 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                Explore Services <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </motion.div>

                        {/* Doctors Teaser */}
                        <motion.div whileHover={{ y: -5 }} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center group">
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 text-xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <i className="fa-solid fa-user-doctor"></i>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Lead Specialists</h3>
                            <p className="text-slate-500 text-xs mb-6 font-medium leading-relaxed">Meet Dr. Piyush Sharma and our dedicated expert team.</p>
                            <Link to="/doctors" className="mt-auto text-blue-700 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                Meet Experts <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </motion.div>

                        {/* Exercises Teaser */}
                        <motion.div whileHover={{ y: -5 }} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-center text-center group">
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 text-xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <i className="fa-solid fa-person-running"></i>
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Recovery Support</h3>
                            <p className="text-slate-500 text-xs mb-6 font-medium leading-relaxed">Access clinical protocols and guides designed for you.</p>
                            <Link to="/exercises" className="mt-auto text-blue-700 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                View Guides <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Exercises Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="section-badge mx-auto bg-blue-50 border-blue-100 text-blue-700">
                            Home Rehabilitation · घर पर पुनर्वास
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 leading-tight">
                            Featured Clinical <span className="text-blue-700">Recovery Guides</span>
                        </h2>
                        <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                            Access our most effective home-based protocols designed by our expert physiotherapists.
                        </p>
                    </div>

                    <Exercises limit={4} isHomePage={true} />

                    <div className="mt-16 text-center">
                        <Link to="/exercises" className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-slate-200 group">
                            Explore All Exercises 
                            <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                        </Link>
                    </div>
                </div>
            </section>

            <Testimonials />
            <Contact />
            <Footer />
        </>
    );
};

export default Home;
