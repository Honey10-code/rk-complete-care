import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const exercises = [
    { 
        id: 'neck-stretch',
        title: 'Neck Stretch', 
        hindi: '(गर्दन का व्यायाम)', 
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop',
        icon: 'fa-user-nurse',
        fullDetails: 'Perform this stretch slowly to relieve tension in the cervical spine. Sit straight, gently tilt your right ear toward your right shoulder using your hand for light pressure. Hold for 30 seconds. Switch sides. This effectively combats "text neck" and poor posture-induced stiffness.'
    },
    { 
        id: 'shoulder-rotation',
        title: 'Shoulder Rotation', 
        hindi: '(कंधे का व्यायाम)', 
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
        icon: 'fa-dumbbell',
        fullDetails: 'Essential for maintaining rotator cuff health and scapular mobility. Keep your arms relaxed at your sides. Slowly roll your shoulders up, back, down, and forward in smooth, large circles. Perform 10 backward rotations, then 10 forward rotations to lubricate the shoulder joint.'
    },
    { 
        id: 'back-stretch',
        title: 'Back Stretch', 
        hindi: '(पीठ का व्यायाम)', 
        image: 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?q=80&w=2070&auto=format&fit=crop',
        icon: 'fa-child-reaching',
        fullDetails: 'The Child’s Pose (Balasana) is highly recommended for lower back decompression. Kneel on the floor, toes together, knees apart. Sit on your heels and walk your hands forward until your forehead touches the floor. Breathe deeply into your lower back and hold for 1 minute.'
    },
    { 
        id: 'knee-bending',
        title: 'Knee Bending', 
        hindi: '(घुटने का व्यायाम)', 
        image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=2052&auto=format&fit=crop',
        icon: 'fa-bed',
        fullDetails: 'Critical for post-op knee recovery or arthritis management (Heel Slides). Lie flat on your back or sit straight. Slowly slide your heel toward your glutes, bending your knee as far as comfortably possible. Hold for 5 seconds, then slowly straighten. Repeat 15 times per leg.'
    },
    { 
        id: 'ankle-rotation',
        title: 'Ankle Rotation', 
        hindi: '(टखने का व्यायाम)', 
        image: 'https://images.unsplash.com/photo-1598136490941-30d885318abd?q=80&w=2069&auto=format&fit=crop',
        icon: 'fa-shoe-prints',
        fullDetails: 'Improves proprioception and joint mobility. Lift your foot slightly off the floor. Draw a large, slow circle in the air with your big toe. Make 10 clockwise circles, followed by 10 counter-clockwise circles. This is excellent for recovering from sprains or prolonged immobilization.'
    },
    { 
        id: 'leg-raise',
        title: 'Leg Raise', 
        hindi: '(पैर उठाने का व्यायाम)', 
        image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2069&auto=format&fit=crop',
        icon: 'fa-arrows-up-to-line',
        fullDetails: 'The Straight Leg Raise (SLR) is a fundamental isometric exercise for strengthening the quadriceps without stressing the knee joint. Lie on your back, keep one knee bent and the other straight. Tighten the thigh muscle of the straight leg and lift it about 12 inches. Hold for 5 seconds, lower slowly. Do 15 reps.'
    },
    { 
        id: 'bridging',
        title: 'Bridging', 
        hindi: '(कमर उठाने का व्यायाम)', 
        image: 'https://images.unsplash.com/photo-1544367563-12123d8d5e58?q=80&w=2070&auto=format&fit=crop',
        icon: 'fa-mattress',
        fullDetails: 'Core and glute activation work designed to stabilize the lumbar spine. Lie on your back with arms at your sides, knees bent, and feet flat on the floor. Squeeze your glute roots and lift your hips until your body forms a straight line from your shoulders to knees. Hold for 5 seconds, lower with control. Perform 12 reps.'
    },
    { 
        id: 'squat',
        title: 'Squat', 
        hindi: '(उठक-बैठक)', 
        image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop',
        icon: 'fa-person-arrow-down-to-line',
        fullDetails: 'Functional lower-body strengthening. From a standing position (feet shoulder-width apart), initiate the movement by pushing your hips back as if sitting in a chair. Keep your chest up and knees behind your toes. Descend to a manageable depth, then drive through your heels to stand up. Repeat 10-15 times.'
    },
];

const Exercises = ({ limit, isHomePage = false }) => {
    const displayedExercises = limit ? exercises.slice(0, limit) : exercises;
    const [selectedExercise, setSelectedExercise] = useState(null);

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
                                <p className="text-emerald-600/70 font-bold text-[10px] uppercase tracking-widest leading-none mb-5">
                                    {exercise.hindi}
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
                            className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row z-10"
                        >
                            {/* Close Button */}
                            <button 
                                onClick={() => setSelectedExercise(null)}
                                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 hover:bg-white hover:text-red-500 hover:shadow-lg transition-all"
                            >
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>

                            {/* Modal Image */}
                            <div className="w-full md:w-5/12 h-64 md:h-auto relative">
                                <img 
                                    src={selectedExercise.image} 
                                    alt={selectedExercise.title} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-900/80 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/90 backdrop-blur-sm flex items-center justify-center text-2xl mb-4 border border-emerald-400">
                                        <i className={`fa-solid ${selectedExercise.icon}`}></i>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">RK The Complete Care</p>
                                </div>
                            </div>

                            {/* Modal Text */}
                            <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col">
                                <div className="mb-2">
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">
                                        Guided Exercise
                                    </span>
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-1 leading-tight">
                                    {selectedExercise.title}
                                </h3>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">
                                    {selectedExercise.hindi}
                                </p>
                                
                                <div className="prose prose-slate prose-sm text-slate-600 font-medium leading-relaxed mb-8">
                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl mb-4">
                                        <p className="text-sm font-semibold text-slate-800 m-0 leading-relaxed">
                                            {selectedExercise.fullDetails}
                                        </p>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">
                                        <i className="fa-solid fa-circle-exclamation text-amber-500 mr-1"></i>
                                        Please consult your physiotherapist before attempting this home exercise, especially if you experience acute pain.
                                    </p>
                                </div>

                                <div className="mt-auto pt-6 border-t border-slate-100 flex flex-wrap gap-4">
                                    <a 
                                        href="https://wa.me/918769556475"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
                                    >
                                        <i className="fa-brands fa-whatsapp text-lg"></i> Consult Doctor
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Exercises;
