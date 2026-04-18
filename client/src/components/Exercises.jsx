import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getExercises } from '../services/api';

const Exercises = ({ limit, isHomePage = false }) => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
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

    // Reset modal state when closed or changed
    useEffect(() => {
        setCurrentStep(0);
        setZoom(1);
        setIsFullscreen(false);
    }, [selectedExercise]);

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

    const handleNext = () => {
        if (selectedExercise && selectedExercise.steps && currentStep < selectedExercise.steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            setZoom(1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            setZoom(1);
        }
    };

    const toggleFullscreen = () => {
        const elem = document.getElementById('lightbox-image-container');
        if (!isFullscreen) {
            if (elem.requestFullscreen) elem.requestFullscreen();
            else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
            else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
    };

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
                                <div className="absolute bottom-4 left-4 flex gap-1">
                                    {Array.from({ length: exercise.steps?.length || 1 }).map((_, i) => (
                                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                                    ))}
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
                                            View Guide
                                        </span>
                                        <i className="fa-solid fa-arrow-right text-[12px] group-hover:transform group-hover:translate-x-32 opacity-100 group-hover:opacity-0 transition-all duration-300 absolute"></i>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Premium Lightbox Modal Popup */}
            <AnimatePresence>
                {selectedExercise && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6"
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl"
                            onClick={() => setSelectedExercise(null)}
                        ></div>

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="relative w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] bg-slate-900 md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col z-10 border border-slate-800"
                        >
                            {/* Header Section */}
                            <div className="absolute top-0 inset-x-0 z-20 p-6 flex items-start justify-between pointer-events-none">
                                <div className="flex flex-col">
                                    <div className="mb-2">
                                        <span className="inline-block px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg border border-emerald-400/50">
                                            {selectedExercise.steps?.length || 1} Steps Protocol
                                        </span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-lg">
                                        {selectedExercise.title}
                                    </h3>
                                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest">
                                        {selectedExercise.hindi}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedExercise(null)}
                                    className="pointer-events-auto w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-rose-500 transition-all shadow-lg border border-white/10"
                                >
                                    <i className="fa-solid fa-xmark text-lg"></i>
                                </button>
                            </div>

                            {/* Image Container with Zoom & Pan */}
                            <div 
                                id="lightbox-image-container"
                                className="flex-grow relative bg-black flex items-center justify-center overflow-hidden touch-none"
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        onDragEnd={(e, { offset, velocity }) => {
                                            const swipe = offset.x;
                                            if (swipe < -50) handleNext();
                                            else if (swipe > 50) handlePrev();
                                        }}
                                        className="w-full h-full flex items-center justify-center p-4 md:p-12"
                                    >
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            <motion.img
                                                src={selectedExercise.steps ? selectedExercise.steps[currentStep] : selectedExercise.image}
                                                alt={`Step ${currentStep + 1}`}
                                                animate={{ scale: zoom }}
                                                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl pointer-events-none select-none"
                                            />
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Step Label Indicator */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                    <div className="px-6 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white/50 text-4xl font-black opacity-30 select-none">
                                        STEP {currentStep + 1}
                                    </div>
                                </div>

                                {/* Navigation Arrows */}
                                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                        disabled={currentStep === 0}
                                        className={`pointer-events-auto w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all ${currentStep === 0 ? 'opacity-0 scale-90' : 'bg-white/10 hover:bg-emerald-500 text-white shadow-xl backdrop-blur-md border border-white/10'}`}
                                    >
                                        <i className="fa-solid fa-chevron-left text-xl"></i>
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                        disabled={currentStep === (selectedExercise.steps?.length || 1) - 1}
                                        className={`pointer-events-auto w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all ${currentStep === (selectedExercise.steps?.length || 1) - 1 ? 'opacity-0 scale-90' : 'bg-white/10 hover:bg-emerald-500 text-white shadow-xl backdrop-blur-md border border-white/10'}`}
                                    >
                                        <i className="fa-solid fa-chevron-right text-xl"></i>
                                    </button>
                                </div>

                                {/* Floating Action Bar (Zoom, Fullscreen) */}
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-2xl z-30">
                                    <button onClick={() => setZoom(prev => Math.max(1, prev - 0.5))} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/20 text-white transition-all"><i className="fa-solid fa-minus"></i></button>
                                    <div className="text-white/60 font-black text-[10px] uppercase tracking-widest px-4 border-l border-r border-white/10">
                                        {Math.round(zoom * 100)}% ZOOM
                                    </div>
                                    <button onClick={() => setZoom(prev => Math.min(3, prev + 0.5))} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/20 text-white transition-all"><i className="fa-solid fa-plus"></i></button>
                                    <div className="w-px h-6 bg-white/10 mx-2"></div>
                                    <button onClick={toggleFullscreen} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/20 text-white transition-all">
                                        <i className={`fa-solid ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
                                    </button>
                                </div>
                            </div>

                            {/* Footer / Branding */}
                            <div className="bg-slate-950 p-6 md:px-10 flex items-center justify-between border-t border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        {Array.from({ length: selectedExercise.steps?.length || 1 }).map((_, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => setCurrentStep(i)}
                                                className={`w-10 h-10 rounded-xl border-2 transition-all overflow-hidden ${currentStep === i ? 'border-emerald-500 scale-110 z-10' : 'border-transparent opacity-40 hover:opacity-70'}`}
                                            >
                                                <img src={selectedExercise.steps ? selectedExercise.steps[i] : selectedExercise.image} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="hidden sm:block ml-4">
                                        <p className="text-white font-black text-[10px] uppercase tracking-widest leading-none">RK The Complete Care</p>
                                        <p className="text-slate-500 text-[9px] font-bold mt-1">PHYSIOTHERAPY AT HOME PROTOCOLS</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => {
                                        setSelectedExercise(null);
                                        const el = document.getElementById('book-appointment');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2"
                                >
                                    <i className="fa-solid fa-user-doctor"></i>
                                    Book Consult
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Exercises;
