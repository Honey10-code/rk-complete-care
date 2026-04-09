import React, { useState, useEffect } from 'react';
import { getBanners } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const defaultSlides = [
    {
        id: 1,
        image: "/banner-v2.webp",
        title: "Premium Clinical Excellence",
        subtitle: "Expert Physiotherapy & Rehabilitation Specialist"
    },
    {
        id: 2,
        image: "/Banner2.png",
        title: "Personalized Recovery Support",
        subtitle: "Dedicated Care for Every Step of Your Journey"
    },
    {
        id: 3,
        image: "/Banner3.png",
        title: "Sports Injury Recovery",
        subtitle: "Regain Your Peak Performance and Strength"
    },
    {
        id: 4,
        image: "/Banner4.png",
        title: "Advanced Manual Therapy",
        subtitle: "Scientifically Proven Treatment Protocols"
    }
];

const BannerCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slides, setSlides] = useState(defaultSlides);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        getBanners()
            .then((data) => {
                if (isMounted && data && data.length > 0) {
                    setSlides(data);
                }
            })
            .catch((err) => console.error("Error fetching banners:", err));

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    // ⚡ PRO TIP: Never return a loader for the main banner if you have fallbacks
    // This ensures LCP (Largest Contentful Paint) is lightning fast
    if (slides.length === 0 && loading) {
        return (
            <div className="w-full h-[60vh] md:h-[85vh] bg-slate-900 overflow-hidden relative">
                <div className="absolute inset-0 bg-blue-900/20 animate-pulse"></div>
            </div>
        );
    }

    if (slides.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full h-[60vh] md:h-[85vh] overflow-hidden group z-10">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <div className="w-full h-full relative">
                        <img
                            src={slides[currentIndex].image || "/banner-v2.webp"}
                            alt={slides[currentIndex].title || "Physiotherapy Banner"}
                            className="w-full h-full object-cover absolute inset-0"
                            fetchpriority={currentIndex === 0 ? "high" : "auto"}
                            loading="eager"
                        />
                        {/* Premium Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent"></div>
                        <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply"></div>

                        {(slides[currentIndex].title || slides[currentIndex].subtitle) && (
                            <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-24 max-w-7xl text-white z-10">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.8 }}
                                    className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
                                >
                                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                                    <span className="text-xs md:text-sm font-medium tracking-wider uppercase text-blue-50">RK The Complete Care</span>
                                </motion.div>

                                <motion.h2
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                    className="text-3xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] drop-shadow-2xl"
                                >
                                    {slides[currentIndex].title}
                                </motion.h2>

                                <motion.p
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                    className="text-lg md:text-2xl font-light text-slate-200 drop-shadow-md max-w-2xl mb-10 border-l-4 border-blue-500 pl-6"
                                >
                                    {slides[currentIndex].subtitle}
                                </motion.p>

                                <motion.div
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.8 }}
                                    className="flex flex-wrap gap-4"
                                >
                                    <Link
                                        to="/booking"
                                        onClick={(e) => {
                                            if (location.pathname === '/' || location.pathname === '/home') {
                                                const el = document.getElementById('book-appointment');
                                                if (el) {
                                                    e.preventDefault();
                                                    el.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }
                                        }}
                                        className="book-btn px-8 py-4 bg-primary-blue hover:bg-blue-700 text-white rounded-full font-semibold shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_25px_rgba(37,99,235,0.6)] transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3 group"
                                    >
                                        Book Consultation
                                        <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                    </Link>
                                    <Link
                                        to="/services"
                                        className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full font-semibold border border-white/30 transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        Explore Therapies
                                    </Link>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Premium Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 md:left-8 transform -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-20 group-hover:opacity-100 opacity-0 md:opacity-100 shadow-xl"
                aria-label="Previous slide"
            >
                <i className="fa-solid fa-chevron-left text-xl"></i>
            </button>

            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-20 group-hover:opacity-100 opacity-0 md:opacity-100 shadow-xl"
                aria-label="Next slide"
            >
                <i className="fa-solid fa-chevron-right text-xl"></i>
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`transition-all duration-500 rounded-full ${index === currentIndex
                            ? 'w-12 h-2 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]'
                            : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerCarousel;
