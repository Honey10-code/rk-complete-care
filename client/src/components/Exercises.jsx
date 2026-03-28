import React from 'react';
import { motion } from 'framer-motion';

const exercises = [
    { title: 'Neck Stretch', hindi: '(गर्दन का व्यायाम)', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop' },
    { title: 'Shoulder Rotation', hindi: '(कंधे का व्यायाम)', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop' },
    { title: 'Back Stretch', hindi: '(पीठ का व्यायाम)', image: 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?q=80&w=2070&auto=format&fit=crop' },
    { title: 'Knee Bending', hindi: '(घुटने का व्यायाम)', image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=2052&auto=format&fit=crop' },
    { title: 'Ankle Rotation', hindi: '(टखने का व्यायाम)', image: 'https://images.unsplash.com/photo-1598136490941-30d885318abd?q=80&w=2069&auto=format&fit=crop' },
    { title: 'Leg Raise', hindi: '(पैर उठाने का व्यायाम)', image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2069&auto=format&fit=crop' },
    { title: 'Bridging', hindi: '(कमर उठाने का व्यायाम)', image: 'https://images.unsplash.com/photo-1544367563-12123d8d5e58?q=80&w=2070&auto=format&fit=crop' },
    { title: 'Squat', hindi: '(उठक-बैठक)', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop' },
];

const Exercises = ({ limit, isHomePage = false }) => {
    const displayedExercises = limit ? exercises.slice(0, limit) : exercises;

    return (
        <section id="exercises" className={`py-24 relative overflow-hidden ${isHomePage ? 'bg-white' : 'bg-slate-50'}`}>
            <div className="container mx-auto px-6 relative z-10">
                {!isHomePage && (
                    <div className="text-center mb-16">
                        <div className="section-badge mx-auto bg-blue-50 border-blue-100 text-blue-700">
                            Stay Active · सक्रिय रहें
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 leading-tight">
                            Essential <span className="text-blue-700">Recovery Guides</span>
                        </h2>
                        <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                            Simple yet effective clinical exercise protocols to maintain your mobility and strength at home.
                        </p>
                    </div>
                )}

                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ${!isHomePage && 'lg:grid-cols-4'}`}>
                    {displayedExercises.map((exercise, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col h-full"
                        >
                            {/* Image Part */}
                            <div className="h-56 overflow-hidden bg-slate-100 relative">
                                <img
                                    src={exercise.image}
                                    alt={exercise.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/10 transition-all"></div>
                                {/* Label overlay */}
                                <div className="absolute top-4 right-4 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[8px] font-black uppercase text-blue-800 border border-blue-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Step-by-Step Guide
                                </div>
                            </div>

                            {/* Info Part */}
                            <div className="p-6 text-center flex-grow flex flex-col items-center justify-center">
                                <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-blue-700 transition-colors tracking-tight leading-tight">
                                    {exercise.title}
                                </h3>
                                <p className="text-blue-600/60 font-bold text-[10px] uppercase tracking-widest leading-none mb-4">
                                    {exercise.hindi}
                                </p>
                                
                                <div className="w-10 h-0.5 bg-slate-100 group-hover:bg-blue-200 transition-colors mb-4 mx-auto"></div>
                                
                                <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-700 transition-all flex items-center gap-2">
                                    View Protocol <i className="fa-solid fa-arrow-right text-[8px]"></i>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Exercises;
