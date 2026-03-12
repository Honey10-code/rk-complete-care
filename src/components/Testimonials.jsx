import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

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
                const res = await axios.get('/api/testimonials');
                if (res.data && res.data.length > 0) {
                    setTestimonials(res.data);
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
        <section id="testimonials" className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #ffffff, #eef2f4 40%, #ffffff)" }}></div>
                <div className="absolute top-0 left-0 w-full h-0.5" style={{ background: "linear-gradient(90deg, #0d9488, #2dd4bf, #d97706)" }}></div>
                <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(13, 148, 136,0.08)" }}></div>
                <div className="absolute top-1/2 right-10 w-48 h-48 rounded-full blur-3xl" style={{ background: "rgba(45, 212, 191,0.07)" }}></div>
            </div>

            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="section-badge mx-auto mb-4">
                        <i className="fa-solid fa-star"></i>
                        Patient Stories · मरीज़ों की राय
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "#0f172a" }}>
                        What Our{" "}
                        <span style={{ background: "linear-gradient(135deg, #0d9488, #2dd4bf)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                            Patients Say
                        </span>
                    </h2>
                    <div className="flex justify-center gap-3 flex-wrap mt-6">
                        <a href="https://g.page/r/CXkFsimafLKiEAE/review" target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-2.5 text-white rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all"
                            style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)", boxShadow: "0 4px 14px rgba(13, 148, 136,0.28)" }}>
                            <i className="fa-brands fa-google"></i> Review us on Google
                        </a>
                        <a href="https://g.page/r/CXkFsimafLKiEAE" target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 hover:-translate-y-0.5 transition-all"
                            style={{ color: "#0d9488" }}>
                            <i className="fa-solid fa-star" style={{ color: "#f59e0b" }}></i> See all reviews
                        </a>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    {/* Carousel Container */}
                    <div className="relative min-h-[300px] flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white rounded-3xl shadow-xl border border-sky-100 w-full md:w-4/5 mx-auto text-center p-10 md:p-12 relative hover:shadow-2xl hover:border-sky-200 transition-all duration-300"
                            >
                                <i className="fa-solid fa-quote-left text-5xl absolute top-8 left-8" style={{ color: "rgba(13, 148, 136,0.10)" }}></i>

                                <div className="text-lg mb-6 flex justify-center gap-1" style={{ color: "#f59e0b" }}>
                                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                        <i key={i} className="fa-solid fa-star"></i>
                                    ))}
                                </div>

                                <p className="text-xl md:text-2xl italic text-slate-700 mb-8 leading-relaxed font-light">
                                    "{testimonials[currentIndex].message || testimonials[currentIndex].text}"
                                </p>

                                {testimonials[currentIndex].isReviewLink && (
                                    <div className="mb-8">
                                        {testimonials[currentIndex].name === "Your Experience Matters" ? (
                                            <a href="https://g.page/r/CXkFsimafLKiEAE/review" target="_blank" rel="noopener noreferrer" className="btn btn-primary px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center gap-2">
                                                <i className="fa-brands fa-google"></i> Leave a Review
                                            </a>
                                        ) : (
                                            <a href="https://g.page/r/CXkFsimafLKiEAE" target="_blank" rel="noopener noreferrer" className="btn btn-primary px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center gap-2">
                                                <i className="fa-brands fa-google"></i> Read on Google
                                            </a>
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 rounded-2xl mb-3 flex items-center justify-center text-2xl text-white font-black shadow-md"
                                        style={{ background: "linear-gradient(135deg, #0d9488, #2dd4bf)" }}>
                                        {testimonials[currentIndex].name.charAt(0)}
                                    </div>
                                    <h5 className="mb-0 font-black text-xl" style={{ color: "#0f766e" }}>{testimonials[currentIndex].name}</h5>
                                    <span className="text-sm text-slate-400 mt-1 uppercase tracking-wide font-semibold">{testimonials[currentIndex].location}</span>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <button onClick={prevTestimonial} className="hidden md:flex absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 transition-all items-center justify-center text-slate-400 z-10 hover:text-white hover:border-transparent"
                        style={{}} onMouseEnter={e => { e.currentTarget.style.background = '#0d9488'; }} onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}>
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button onClick={nextTestimonial} className="hidden md:flex absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 transition-all items-center justify-center text-slate-400 z-10 hover:text-white hover:border-transparent"
                        onMouseEnter={e => { e.currentTarget.style.background = '#0d9488'; }} onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}>
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>

                    {/* Indicators */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8' : 'bg-slate-200 hover:bg-slate-300 w-2.5'}`}
                                style={index === currentIndex ? { background: "linear-gradient(90deg, #0d9488, #2dd4bf)", width: "2rem" } : {}}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
