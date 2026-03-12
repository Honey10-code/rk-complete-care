import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

import { Helmet } from 'react-helmet-async';

const About = () => {
    return (
        <>
            <Helmet>
                <title>About Dr. Piyush Sharma | Best Physiotherapy Clinic in Jaipur</title>
                <meta name="description" content="Learn about Dr. Piyush Sharma (PT), Chief Physiotherapist at Welton Hospital Jaipur. Specialist in orthopedic rehab, sports injuries, and post-op recovery." />
            </Helmet>
            <Navbar />
            <section className="pt-32 pb-20 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white"></div>
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[100px] -z-10" style={{ background: "rgba(13, 148, 136,0.07)" }}></div>
                </div>

                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Image Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 z-10">
                                <img
                                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
                                    alt="Dr. Piyush Sharma"
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                                    <h3 className="text-2xl font-bold">Dr. Piyush Sharma (PT)</h3>
                                    <p style={{ color: "#2dd4bf" }} className="font-medium">Chief Physiotherapist</p>
                                    <p className="text-sm text-white/80">BPT, MPT (Orthopedics & Sports), MIAP</p>
                                </div>
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -bottom-6 -right-6 w-full h-full border border-slate-200 rounded-3xl -z-10" style={{ background: "rgba(13, 148, 136,0.04)" }}></div>
                            <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full blur-2xl" style={{ background: "rgba(13, 148, 136,0.12)" }}></div>
                        </motion.div>

                        {/* Content Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                                style={{ background: "rgba(13, 148, 136,0.08)", border: "1px solid rgba(13, 148, 136,0.18)", color: "#0d9488" }}>
                                <i className="fa-solid fa-user-doctor"></i>
                                Meet The Expert
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 leading-tight">
                                Dr. Piyush <span style={{ color: "#0d9488" }}>Sharma</span>
                            </h1>

                            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                                <p>
                                    <strong className="text-slate-800">Dr. Piyush Sharma</strong> is the Chief Physiotherapist at Welton Hospital. He specializes in treating patients with orthopedic problems and disabilities, bringing years of expertise and a compassionate approach to patient care.
                                </p>
                                <p>
                                    With a vast experience in the field, he has successfully treated thousands of patients suffering from conditions such as:
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-base">
                                    {[
                                        "Osteoarthritis", "Rheumatoid Arthritis",
                                        "Hip & Knee Joint Pain", "Frozen Shoulder",
                                        "Low Back Pain & Slip Disc", "Cervical Pain",
                                        "Ligament & Meniscus Pain", "Sports Injuries"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <i className="fa-solid fa-check-circle text-sm" style={{ color: "#0d9488" }}></i>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <p>
                                    He is highly specialized in <strong>Post-Op Rehabilitation Management</strong> for Total Hip Replacement, Total Knee Replacement, and Pelvis-Acetabular fractures. His expertise also extends to managing stiffness after post-op trauma or complex trauma surgeries, ensuring patients regain optimal mobility and function.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Why Choose Us Section */}
                    <div className="mt-24 mb-16">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 block">
                                Why Choose <span style={{ color: "#0d9488" }}>Us</span>
                            </h2>
                            <div className="w-24 h-1 mx-auto rounded-full" style={{ background: "linear-gradient(90deg, #0d9488, #f59e0b)" }}></div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { title: "Dedicated Team", desc: "Dedicated team of doctors trained from best institutes of India like PGI-Chandigarh, AIIMS-Delhi.", icon: "fa-users-viewfinder", bg: "rgba(13, 148, 136,0.08)", text: "#0f766e" },
                                { title: "Fellowship Trained Doctor", desc: "Separate fellowship trained specialist for all type of orthopaedic problems.", icon: "fa-user-graduate", bg: "rgba(45, 212, 191,0.10)", text: "#0d9488" },
                                { title: "Team Work", desc: "Evidence based: clinical work with good coordination between physician, surgery and rehabilitation team.", icon: "fa-hands-holding-circle", bg: "rgba(217, 119, 6,0.10)", text: "#d97706" },
                                { title: "Patient Comes First", desc: "Treatment at Welton hospital is a truly human experience. You are cared as a person first.", icon: "fa-heart-pulse", bg: "rgba(90,138,122,0.10)", text: "#5a8a7a" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all"
                                >
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6"
                                        style={{ background: item.bg, color: item.text }}>
                                        <i className={`fa-solid ${item.icon}`}></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Special Clinics Section */}
                    <div className="mt-20">
                        <div className="bg-slate-900 rounded-3xl p-10 md:p-16 relative overflow-hidden">
                            {/* Decorative background */}
                            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(13, 148, 136,0.08)" }}></div>
                            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl" style={{ background: "rgba(217, 119, 6,0.07)" }}></div>

                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                                        Our Special <span style={{ color: "#2dd4bf" }}>Clinics</span>
                                    </h2>
                                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                        We provide specialized care through our dedicated clinics, ensuring focused treatment for specific conditions.
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {[
                                            "Knee clinic", "Hip clinic", "Shoulder clinic",
                                            "Spine clinic", "Diabetes clinic",
                                            "Asthma & COPD clinic", "Rheumatoid & Arthritis clinic"
                                        ].map((clinic, i) => (
                                            <span key={i} className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-colors cursor-default">
                                                <i className="fa-solid fa-hospital-user mr-2" style={{ color: "#2dd4bf" }}></i>
                                                {clinic}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4 translate-y-8">
                                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                                            <i className="fa-solid fa-bone text-3xl mb-2" style={{ color: "#2dd4bf" }}></i>
                                            <p className="text-white font-bold">Orthopedic</p>
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                                            <i className="fa-solid fa-lungs text-3xl mb-2" style={{ color: "#0d9488" }}></i>
                                            <p className="text-white font-bold">Respiratory</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                                            <i className="fa-solid fa-person-cane text-3xl mb-2" style={{ color: "#f59e0b" }}></i>
                                            <p className="text-white font-bold">Geriatric</p>
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                                            <i className="fa-solid fa-child-reaching text-3xl mb-2" style={{ color: "#d97706" }}></i>
                                            <p className="text-white font-bold">Pediatric</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default About;
