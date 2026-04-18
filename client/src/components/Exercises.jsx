import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getExercises } from '../services/api';

const Exercises = ({ limit, isHomePage = false }) => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const data = await getExercises();
                setExercises(data);

                // Deep linking: Open modal if ID is in URL
                const exerciseId = searchParams.get('id');
                if (exerciseId && data.length > 0) {
                    const found = data.find(e => e.id === exerciseId);
                    if (found) setSelectedExercise(found);
                }
            } catch (err) {
                console.error("Error fetching exercises:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchExercises();
    }, [searchParams]);

    const displayedExercises = limit ? exercises.slice(0, limit) : exercises;

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (selectedExercise) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedExercise]);

    if (loading && !isHomePage) {
        return (
            <div className="py-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <section id="exercises" className={`py-24 relative overflow-hidden ${isHomePage ? 'bg-white' : 'bg-slate-50'}`}>
            <div className="container mx-auto px-6 relative z-10">
                {!isHomePage && (
                    <div className="text-center mb-16">
                        <div className="section-badge mx-auto bg-emerald-50 border-emerald-100 text-emerald-700">
                            Stay Active · सक्रिय रहें
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 leading-tight">
                            Essential <span className="text-emerald-600">Recovery Guides</span>
                        </h2>
                        <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                            Simple yet effective clinical exercise protocols to maintain your mobility and strength at home.
                        </p>
                    </div>
                )}

                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ${!isHomePage && 'lg:grid-cols-4'}`}>
                    {displayedExercises.map((exercise, index) => (
                        <motion.div
                            key={exercise.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="group relative bg-white rounded-[2rem] p-3 transition-all duration-500 border border-slate-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(16,185,129,0.08)] flex flex-col hover:-translate-y-2 cursor-pointer h-full"
                            onClick={() => setSelectedExercise(exercise)}
                        >
                            {/* Background Accent on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] pointer-events-none"></div>

                            {/* Premium Image Box */}
                            <div className="h-48 relative rounded-[1.5rem] overflow-hidden bg-slate-100 z-10">
                                <img
                                    src={exercise.image}
                                    alt={exercise.title}
                                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.15]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>

                                {/* Label overlay */}
                                <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg text-[9px] font-black uppercase text-emerald-700 border border-emerald-100 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    Step-by-Step
                                </div>
                            </div>

                            {/* Refined Details Box */}
                            <div className="p-5 pt-6 flex flex-col flex-grow relative z-10 text-center items-center">
                                <h3 className="text-[1.15rem] font-black text-slate-800 mb-1 leading-tight group-hover:text-emerald-600 transition-colors">
                                    {exercise.title}
                                </h3>
                                <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest leading-none mb-5">
                                    ({exercise.hindi})
                                </p>

                                <div className="mt-auto w-full flex justify-center">
                                    <button className="flex items-center justify-center gap-2 w-10 h-10 rounded-full bg-slate-50 text-slate-400 group-hover:w-full group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-all duration-300 overflow-hidden relative">
                                        <span className="absolute transform translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 font-bold text-[10px] uppercase tracking-widest whitespace-nowrap">
                                            View Protocol
                                        </span>
                                        <i className="fa-solid fa-arrow-right text-[12px] group-hover:transform group-hover:translate-x-32 opacity-100 group-hover:opacity-0 transition-all duration-300 absolute"></i>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Exercise Details Modal Popup */}
            <AnimatePresence>
                {selectedExercise && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                            onClick={() => setSelectedExercise(null)}
                        ></div>

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-2xl min-h-[450px] md:min-h-[550px] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col z-10"
                        >
                            {/* Full Frame Background Image */}
                            <img
                                src={selectedExercise.image}
                                alt={selectedExercise.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {/* Gradient Overlay to ensure text readability */}
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/20 to-slate-900/90"></div>

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedExercise(null)}
                                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-500 hover:shadow-lg transition-all"
                            >
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>

                            {/* Name and Tag in Upper Left Section */}
                            <div className="relative z-10 p-6 md:p-10 flex flex-col pointer-events-none">
                                <div className="mb-3">
                                    <span className="inline-block px-3 py-1.5 bg-emerald-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-lg shadow-sm border border-emerald-400/50 backdrop-blur-md">
                                        Guided Exercise
                                    </span>
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight drop-shadow-lg">
                                    {selectedExercise.title}
                                </h3>
                                <p className="text-emerald-300 font-black text-sm uppercase tracking-widest drop-shadow-md">
                                    ({selectedExercise.hindi})
                                </p>
                            </div>

                            {/* Bottom section with branding and interactive button */}
                            <div className="relative z-10 p-6 md:p-10 mt-auto flex items-end justify-between pointer-events-auto">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-emerald-500/90 backdrop-blur-sm flex items-center justify-center text-white text-2xl border border-emerald-400 shadow-xl relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay"></div>
                                        <i className={`fa-solid ${selectedExercise.icon} relative z-10 group-hover:scale-110 transition-transform`}></i>
                                    </div>
                                    <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-emerald-100 leading-tight">
                                        RK The<br className="hidden sm:block" />Complete Care
                                    </p>
                                </div>

                                <Link
                                    to="/booking"
                                    onClick={(e) => {
                                        if (isHomePage) {
                                            e.preventDefault();
                                            setSelectedExercise(null);
                                            const el = document.getElementById('book-appointment');
                                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-5 py-3 md:px-8 md:py-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-1 flex items-center justify-center gap-2 group whitespace-nowrap"
                                >
                                    <i className="fa-solid fa-calendar-check text-lg group-hover:rotate-12 transition-transform"></i>
                                    <span className="hidden sm:inline">Book Appointment</span>
                                    <span className="sm:hidden">Book Now</span>
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Exercises;
