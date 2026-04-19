import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="bg-white min-h-screen">
            <Helmet>
                <title>About RK The Complete Care | Trusted Physiotherapy Clinic Jaipur</title>
                <meta name="description" content="Learn about RK The Complete Care, a trusted physiotherapy clinic in Jaipur focused on pain relief, mobility and recovery." />
                <link rel="canonical" href="https://rkphysiocare.in/about" />
                <meta property="og:title" content="About RK The Complete Care | Trusted Physiotherapy Clinic Jaipur" />
                <meta property="og:description" content="Learn about RK The Complete Care, a trusted physiotherapy clinic in Jaipur focused on pain relief, mobility and recovery." />
                <meta property="og:url" content="https://rkphysiocare.in/about" />
            </Helmet>
            <Navbar />
            
            <section className="pt-16 pb-20 relative overflow-hidden bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Clinic Image Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white z-10 bg-gradient-to-br from-blue-950 to-blue-800 aspect-video flex items-center justify-center p-12">
                                <div className="text-center text-white">
                                    <div className="relative mx-auto mb-6 w-36 h-36 flex items-center justify-center">
                                        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 to-green-400/20 blur-xl" />
                                        <div className="relative bg-white rounded-xl shadow-2x border-4 border-blue-200/40">
                                            <img src="/logo.png" alt="RK Logo" className="h-24 w-24 object-cover" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter italic">RK The Complete Care</h3>
                                    <div className="w-20 h-1 bg-blue-400 mx-auto rounded-full"></div>
                                    <p className="mt-4 text-blue-200 font-bold uppercase tracking-widest text-xs">Where Recovery Begins</p>
                                </div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -bottom-6 -right-6 w-full h-full border border-blue-100 rounded-2xl -z-0 bg-blue-50/50"></div>
                        </motion.div>

                        {/* Clinic Content Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="section-badge mb-6">
                                <i className="fa-solid fa-hospital"></i>
                                About Our Clinic
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                                Jaipur's Premiere <br/><span className="text-blue-700">Physiotherapy Centre</span>
                            </h1>

                            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                                <p>
                                    <strong className="text-slate-900">RK The Complete Care</strong> is Jaipur's most trusted physiotherapy and rehabilitation destination. Founded on the principles of evidence-based clinical practice and compassionate care, we provide specialized treatment for a wide range of orthopedic and neurological conditions.
                                </p>
                                <p>
                                    Our clinic is equipped with the latest therapeutic technologies, allowing our expert team to deliver personalized recovery protocols that combine manual therapy, advanced modalities, and targeted exercise science.
                                </p>
                                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                    <Link to="/doctors" className="px-8 py-3 bg-blue-700 text-white rounded-xl font-bold text-center hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10">
                                        Meet Our Specialists
                                    </Link>
                                    <Link to="/services" className="px-8 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-center hover:bg-slate-100 transition-all">
                                        Explore Our Services
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="section-badge mx-auto">Why Choose Us</div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-4">
                            Commitment to <span className="text-blue-700"> Excellence</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "Dedicated Team", desc: "Trained from top institutes like PGI-Chandigarh and AIIMS-Delhi.", icon: "fa-users", color: "blue" },
                            { title: "Specialized Care", desc: "Fellowship trained specialists for all types of orthopedic issues.", icon: "fa-user-graduate", color: "blue" },
                            { title: "Evidence Based", desc: "Clinical work with seamless coordination between surgical and rehab teams.", icon: "fa-stethoscope", color: "blue" },
                            { title: "Patient First", desc: "A truly human experience. We care for you as a person, not just a patient.", icon: "fa-heart", color: "blue" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="glass-card hover:border-blue-200"
                            >
                                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-xl text-blue-700 mb-6 font-bold">
                                    <i className={`fa-solid ${item.icon}`}></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Special Clinics Section */}
            <section className="py-24 bg-slate-900">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="section-badge bg-slate-800 border-slate-700 text-blue-400">Our Clinics</div>
                            <h2 className="text-3xl md:text-4xl font-black text-white mt-4 mb-6">
                                Specialized <span className="text-blue-500">Therapy Clinics</span>
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                We provide specialized care through dedicated clinics, ensuring focused and expert treatment for specific conditions.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    "Knee clinic", "Hip clinic", "Shoulder clinic",
                                    "Spine clinic", "Diabetes clinic",
                                    "Asthma & COPD clinic", "Rheumatoid & Arthritis clinic"
                                ].map((clinic, i) => (
                                    <span key={i} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-bold hover:bg-slate-700 transition-colors cursor-default">
                                        <i className="fa-solid fa-hospital-user mr-2 text-blue-400"></i>
                                        {clinic}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                                    <i className="fa-solid fa-bone text-4xl mb-3 text-blue-400"></i>
                                    <p className="text-white font-bold text-lg">Orthopedic</p>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                                    <i className="fa-solid fa-lungs text-4xl mb-3 text-blue-500"></i>
                                    <p className="text-white font-bold text-lg">Respiratory</p>
                                </div>
                            </div>
                            <div className="space-y-6 pt-12">
                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                                    <i className="fa-solid fa-person-cane text-4xl mb-3 text-blue-300"></i>
                                    <p className="text-white font-bold text-lg">Geriatric</p>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                                    <i className="fa-solid fa-child-reaching text-4xl mb-3 text-blue-400"></i>
                                    <p className="text-white font-bold text-lg">Pediatric</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <Footer />
        </div>
    );
};

export default About;
