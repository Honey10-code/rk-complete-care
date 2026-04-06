import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Services from '../components/Services';
import Exercises from '../components/Exercises';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import BannerCarousel from '../components/BannerCarousel';
import BookingSection from '../components/BookingSection';

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

            {/* Comprehensive Clinic Introduction */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
                {/* Premium Background Elements */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white">
                    <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-slate-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
                    <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                </div>

                <div className="container mx-auto px-6 py-20 md:py-28 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
                        {/* Elite Left Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            {/* Premium Badge with Logo */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-slate-100 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.07)] mb-8"
                            >
                                <div className="relative w-9 h-9 rounded-full bg-white border border-blue-100 shadow-sm overflow-hidden shrink-0 flex items-center justify-center">
                                    <img src="/logo.png" alt="RK" className="w-8 h-8 object-contain" />
                                </div>
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                </span>
                                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-700">Jhotwara's Premier Clinic</span>
                            </motion.div>

                            <h1 className="text-slate-900 leading-[1.1] mb-6 font-black tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                <span className="block text-4xl md:text-5xl lg:text-[3.5rem] text-slate-400 font-extrabold pb-2">Welcome to</span>
                                <span className="block text-5xl md:text-6xl lg:text-[4.5rem] bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-900 to-blue-800 pb-2">
                                    RK The Complete
                                </span>
                                <span className="block text-4xl md:text-5xl lg:text-[4.5rem] text-blue-700 mt-1">
                                    Physiotherapy Centre
                                </span>
                                <span className="block text-2xl md:text-3xl lg:text-[2.5rem] text-blue-600 mt-1 font-bold">
                                    Where Recovery Begins
                                </span>
                            </h1>

                            <p className="text-slate-500 text-lg md:text-xl font-medium mb-10 max-w-lg leading-relaxed mix-blend-multiply">
                                Experience world-class physiotherapy. We integrate advanced clinical protocols with compassionate, tailored treatment to accelerate your healing journey.
                            </p>

                            <div className="flex flex-wrap items-center gap-5">
                                <a
                                    href="#book-appointment"
                                    onClick={(e) => {
                                        const el = document.getElementById('book-appointment');
                                        if (el) {
                                            e.preventDefault();
                                            el.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                    className="book-btn px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-[15px] flex items-center gap-3 transition-all duration-300 hover:bg-blue-700 hover:shadow-[0_8px_25px_rgba(29,78,216,0.25)] hover:-translate-y-1 transform group">
                                    <i className="fa-solid fa-calendar-check text-blue-400 group-hover:text-white transition-colors"></i> Book Consultation
                                </a>
                                <a href="#services"
                                    className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-full font-bold text-[15px] hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm transition-all duration-300 flex items-center gap-2 group">
                                    Our Services <i className="fa-solid fa-arrow-right text-slate-400 group-hover:translate-x-1 transition-all"></i>
                                </a>
                            </div>

                            {/* Refined Trust indicator */}
                            <div className="mt-12 flex flex-col sm:flex-row items-center sm:items-center gap-4">
                                <div className="flex -space-x-3">
                                    <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" alt="Patient" />
                                    <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" alt="Patient" />
                                    <img className="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" alt="Patient" />
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-700">5k+</div>
                                </div>
                                <div className="text-center sm:text-left text-sm text-slate-500 font-semibold">
                                    <div className="flex items-center justify-center sm:justify-start text-amber-400 text-[13px] gap-0.5 mb-0.5">
                                        <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                                    </div>
                                    Trusted by <span className="text-slate-800">5000+</span> Patients
                                </div>
                            </div>
                        </motion.div>

                        {/* High-End Right Image Layout */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[8px] border-white z-10 w-full aspect-[4/5] md:aspect-auto md:h-[600px]">
                                <img
                                    src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop"
                                    alt="Physiotherapy Facility"
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[1.5s] ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute top-10 -right-6 w-24 h-24 bg-[radial-gradient(circle,_rgba(226,232,240,1)_1px,_transparent_1px)] bg-[length:8px_8px] -z-10"></div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 rounded-full -z-10 blur-xl"></div>

                            {/* Glassmorphic Stats Float */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="absolute bottom-8 -left-4 md:-left-12 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-5 md:p-6 border border-white z-20 flex gap-6"
                            >
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm">
                                            <i className="fa-solid fa-ranking-star"></i>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest leading-tight">Recovery<br />Rate</p>
                                    </div>
                                    <p className="font-black text-slate-900 text-3xl">98<span className="text-blue-600 text-xl">%</span></p>
                                </div>
                                <div className="w-px bg-slate-200"></div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm">
                                            <i className="fa-solid fa-clock-rotate-left"></i>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest leading-tight">Years<br />Active</p>
                                    </div>
                                    <p className="font-black text-slate-900 text-3xl">15<span className="text-blue-600 text-xl">+</span></p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                    {/* Stats Row Dropdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="mt-20 relative"
                    >
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80"></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 relative z-10 divide-x divide-slate-100">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    className="flex flex-col items-center text-center px-4"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 flex items-center justify-center text-blue-600 text-xl mb-4 shadow-inner border border-white">
                                        <i className={`fa-solid ${stat.icon}`}></i>
                                    </div>
                                    <p className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                                    <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest mt-1.5">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400/50 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] uppercase font-bold tracking-widest">Scroll</span>
                    <i className="fa-solid fa-chevron-down text-sm"></i>
                </motion.div>
            </section>

            {/* Quick Access Teasers */}
            <section className="py-24 bg-slate-50 border-b border-slate-100 relative">
                {/* Decorative mesh */}
                <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Services Teaser */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white p-10 rounded-[2rem] border border-slate-100/80 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col items-center text-center group transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-10 transition-all duration-500 group-hover:bg-blue-600"></div>
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-700 text-2xl mb-8 group-hover:scale-110 group-hover:text-white group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-500 shadow-sm border border-white">
                                <i className="fa-solid fa-hand-holding-medical"></i>
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-3 uppercase tracking-tight group-hover:text-blue-700 transition-colors">Elite Services</h3>
                            <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">Advanced orthopedic rehab and personalized therapy plans for holistic healing.</p>
                            <Link to="/services" className="mt-auto px-6 py-2.5 rounded-full bg-slate-50 group-hover:bg-blue-50 text-blue-700 font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all duration-300">
                                Explore <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </motion.div>

                        {/* Doctors Teaser */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white p-10 rounded-[2rem] border border-slate-100/80 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col items-center text-center group transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -z-10 transition-all duration-500 group-hover:bg-indigo-600"></div>
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-700 text-2xl mb-8 group-hover:scale-110 group-hover:text-white group-hover:from-indigo-600 group-hover:to-indigo-800 transition-all duration-500 shadow-sm border border-white">
                                <i className="fa-solid fa-user-doctor"></i>
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-3 uppercase tracking-tight group-hover:text-indigo-700 transition-colors">Lead Specialists</h3>
                            <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">Meet Dr. Piyush Sharma and our dedicated expert team of clinical therapists.</p>
                            <Link to="/doctors" className="mt-auto px-6 py-2.5 rounded-full bg-slate-50 group-hover:bg-indigo-50 text-indigo-700 font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all duration-300">
                                Meet Experts <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </motion.div>

                        {/* Exercises Teaser */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white p-10 rounded-[2rem] border border-slate-100/80 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] flex flex-col items-center text-center group transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10 transition-all duration-500 group-hover:bg-emerald-500"></div>
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center text-emerald-600 text-2xl mb-8 group-hover:scale-110 group-hover:text-white group-hover:from-emerald-500 group-hover:to-emerald-600 transition-all duration-500 shadow-sm border border-white">
                                <i className="fa-solid fa-person-running"></i>
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-3 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">Recovery Support</h3>
                            <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">Access clinical exercise protocols and guides designed specifically for your recovery.</p>
                            <Link to="/exercises" className="mt-auto px-6 py-2.5 rounded-full bg-slate-50 group-hover:bg-emerald-50 text-emerald-600 font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all duration-300">
                                View Guides <i className="fa-solid fa-arrow-right"></i>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Services Section */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="section-badge mx-auto bg-blue-50 border-blue-100 text-blue-700">
                            Professional Treatments · व्यावसायिक उपचार
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 leading-tight">
                            Specialized Clinical <span className="text-blue-700">Services</span>
                        </h2>
                        <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                            Expert physiotherapy and rehabilitation for orthopaedic and neurological recovery.
                        </p>
                    </div>

                    <Services limit={6} isHomePage={true} />

                    <div className="mt-16 text-center">
                        <Link to="/services" className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-slate-200 group">
                            Explore All Services
                            <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                        </Link>
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
                            Access our most effective home-based protocols designed by our physiotherapists.
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
            <BookingSection />
            <Contact />
            <Footer />
        </>
    );
};

export default Home;
