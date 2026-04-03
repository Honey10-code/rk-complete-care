import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTestimonials } from '../services/api';

const fallbackTestimonials = [
    {
        _id: 'f1',
        name: "Rahul Verma",
        location: "Jaipur",
        message: "Dr. Piyush is amazing. My back pain is completely gone after just 5 sessions. The clinic environment is very soothing.",
        rating: 5,
        isReviewLink: true
    },
    {
        _id: 'f2',
        name: "Priya Singh",
        location: "Jhotwara",
        message: "Best physiotherapy center in Jhotwara. Dr. Soniya was very patient with my mother's knee rehabilitation.",
        rating: 5,
        isReviewLink: true
    },
    {
        _id: 'f3',
        name: "Amit Kumar",
        location: "Vidhyadhar Nagar",
        message: "Highly professional staff and advanced equipment. I recovered from my sports injury much faster than expected.",
        rating: 5,
        isReviewLink: true
    },
    {
        _id: 'f4',
        name: "Sneha Gupta",
        location: "Vaishali Nagar",
        message: "The post-surgery care I received here was exceptional. They really care about your recovery journey.",
        rating: 5,
        isReviewLink: true
    },
    {
        _id: 'f5',
        name: "Your Experience Matters",
        location: "Rate us on Google",
        message: "Had a great experience? We'd love to hear from you! Click below to share your feedback.",
        rating: 5,
        isReviewLink: true
    }
];

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState(fallbackTestimonials);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const data = await getTestimonials();
                if (data && data.length > 0) {
                    setTestimonials(data);
                }
            } catch (err) {
                console.error('Could not fetch testimonials, using fallback data.');
            }
        };
        fetchTestimonials();
    }, []);

    // Auto-rotate timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section id="testimonials" className="py-24 relative overflow-hidden bg-slate-50 border-t border-slate-100">
            {/* Background elements */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-100/40 via-slate-50 to-white"></div>
            <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl -z-10 -translate-x-1/2"></div>
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl -z-10 translate-x-1/3"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16 relative">
                    <div className="section-badge mx-auto bg-blue-50 border-blue-100 text-blue-700 shadow-sm">
                        <i className="fa-solid fa-star text-amber-500"></i>
                        Patient Stories · मरीज़ों की राय
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-slate-900 mt-4 leading-tight tracking-tight">
                        What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">Patients Say</span>
                    </h2>
                    
                    <div className="flex justify-center gap-4 flex-wrap mt-10">
                        <a href="https://g.page/r/CXkFsimafLKiEAE/review" target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_25px_rgba(37,99,235,0.5)] transform hover:-translate-y-0.5 group">
                            <i className="fa-brands fa-google text-lg"></i> Review us on Google
                        </a>
                        <a href="https://g.page/r/CXkFsimafLKiEAE" target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-3.5 bg-white border border-slate-200 rounded-full font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 text-slate-700 shadow-sm group">
                            <i className="fa-solid fa-star text-amber-400 group-hover:scale-110 transition-transform"></i> See all reviews
                        </a>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto relative mt-12">
                    {/* Carousel Container */}
                    <div className="relative min-h-[350px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {testimonials?.length > 0 && (
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_15px_60px_rgba(0,0,0,0.06)] border border-white w-full md:w-[85%] mx-auto text-center p-10 md:p-16 relative overflow-hidden"
                                    style={{
                                        boxShadow: "0 20px 40px -10px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)"
                                    }}
                                >
                                    {/* Quote watermark */}
                                    <i className="fa-solid fa-quote-left text-[8rem] absolute -top-4 -left-2 text-slate-50/80 -z-10 rotate-[-10deg]"></i>

                                    <div className="text-xl mb-6 flex justify-center gap-1.5 text-amber-400">
                                        {[...Array((testimonials[currentIndex]?.rating || 5))].map((_, i) => (
                                            <i key={i} className="fa-solid fa-star drop-shadow-sm"></i>
                                        ))}
                                    </div>

                                    <p className="text-xl md:text-2xl text-slate-700 mb-10 leading-[1.7] font-medium relative z-10">
                                        "{testimonials[currentIndex]?.message || testimonials[currentIndex]?.text || 'No review content available.'}"
                                    </p>

                                    <div className="flex flex-col items-center justify-center relative z-10 pt-6 border-t border-slate-100">
                                        <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center text-2xl text-white font-black bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md ring-4 ring-white">
                                            {testimonials[currentIndex]?.name?.charAt(0) || 'U'}
                                        </div>
                                        <h5 className="font-extrabold text-xl text-slate-900 tracking-tight">{testimonials[currentIndex]?.name || 'Anonymous User'}</h5>
                                        <span className="text-[11px] text-blue-600 mt-1 uppercase tracking-widest font-black bg-blue-50 px-3 py-1 rounded-full">{testimonials[currentIndex]?.location || 'India'}</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Desktop Navigation Buttons */}
                    <button onClick={prevTestimonial} className="hidden lg:flex absolute top-1/2 -left-4 xl:-left-12 transform -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 transition-all duration-300 items-center justify-center text-slate-400 hover:text-blue-600 hover:scale-110 z-20">
                        <i className="fa-solid fa-chevron-left text-lg"></i>
                    </button>
                    <button onClick={nextTestimonial} className="hidden lg:flex absolute top-1/2 -right-4 xl:-right-12 transform -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 transition-all duration-300 items-center justify-center text-slate-400 hover:text-blue-600 hover:scale-110 z-20">
                        <i className="fa-solid fa-chevron-right text-lg"></i>
                    </button>

                    {/* Progress Indicators */}
                    <div className="flex justify-center gap-3 mt-12 pb-4">
                        {testimonials?.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`Go to slide ${index + 1}`}
                                className={`h-2.5 rounded-full transition-all duration-500 ${index === currentIndex ? 'w-10 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm' : 'bg-slate-200 hover:bg-slate-300 w-2.5'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
