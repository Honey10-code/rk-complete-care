import React from 'react';
import { motion } from 'framer-motion';

const exercises = [
    { title: 'Neck Stretch (गर्दन का व्यायाम)', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop' },
    { title: 'Shoulder Rotation (कंधे का व्यायाम)', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop' },
    { title: 'Back Stretch (पीठ का व्यायाम)', image: 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?q=80&w=2070&auto=format&fit=crop' },
    { title: 'Knee Bending (घुटने का व्यायाम)', image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=2052&auto=format&fit=crop' },
    { title: 'Ankle Rotation (टखने का व्यायाम)', image: 'https://images.unsplash.com/photo-1598136490941-30d885318abd?q=80&w=2069&auto=format&fit=crop' },
    { title: 'Leg Raise (पैर उठाने का व्यायाम)', image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2069&auto=format&fit=crop' },
    { title: 'Bridging (कमर उठाने का व्यायाम)', image: 'https://images.unsplash.com/photo-1544367563-12123d8d5e58?q=80&w=2070&auto=format&fit=crop' },
    { title: 'Squat (उठक-बैठक)', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop' },
    { title: 'Wall Push (दीवार धक्का व्यायाम)', image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=2035&auto=format&fit=crop' },
    { title: 'Resistance Band (रबर बैंड व्यायाम)', image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop' },
];

const Exercises = () => {
    return (
        <section id="exercises" className="py-20" style={{ background: "#eef2f4" }}>
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h4 className="font-semibold uppercase tracking-wider mb-2 text-sm" style={{ color: "#d97706" }}>Stay Active (सक्रिय रहें)</h4>
                    <h2 style={{ color: "#0f172a" }}>Essential Exercises (आवश्यक व्यायाम)</h2>
                    <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
                        Simple yet effective exercises to maintain your mobility and strength at home. (घर पर अपनी गतिशीलता और शक्ति बनाए रखने के लिए सरल लेकिन प्रभावी व्यायाम।)
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {exercises.map((exercise, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer group"
                        >
                            <div className="h-40 overflow-hidden bg-gray-200 relative">
                                <img
                                    src={exercise.image}
                                    alt={exercise.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                            </div>
                            <div className="p-4 text-center">
                                <h3 className="text-sm font-semibold text-gray-800">{exercise.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Exercises;
