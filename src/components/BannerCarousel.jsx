import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';



const BannerCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    // Default slides as fallback
    const defaultSlides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1576091160550-217358c7e618?q=80&w=2070&auto=format&fit=crop",
            title: "Advanced Physiotherapy Care",
            subtitle: "Regain Your Strength"
        },
        {
            id: 2,
            image: "https://plus.unsplash.com/premium_photo-1661764878654-3d0fc2eefcca?q=80&w=2070&auto=format&fit=crop",
            title: "Personalized Rehabilitation",
            subtitle: "Expert Care for Every Step"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop",
            title: "Sports Injury Recovery",
            subtitle: "Get Back in the Game Faster"
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1516549655169-df83a092fc43?q=80&w=2070&auto=format&fit=crop",
            title: "Holistic Healing",
            subtitle: "Treating the Root Cause"
        }
    ];

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await axios.get('/api/banners');
                if (res.data && res.data.length > 0) {
                    setSlides(res.data);
                } else {
                    setSlides(defaultSlides);
                }
            } catch (err) {
                console.error("Error fetching banners:", err);
                setSlides(defaultSlides);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
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

    if (loading) {
        return (
            <div className="w-full h-[50vh] min-h-[400px] md:h-[600px] bg-slate-200 animate-pulse mt-20 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-slate-300 border-t-primary-blue rounded-full animate-spin"></div>
            </div>
        );
    }

    if (slides.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden group z-0 mt-28">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
                    >
                        {(slides[currentIndex].title || slides[currentIndex].subtitle) && (
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center items-start px-10 md:px-20 text-white">
                                <motion.h2
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-4xl md:text-6xl font-bold mb-2 drop-shadow-lg"
                                >
                                    {slides[currentIndex].title}
                                </motion.h2>
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-xl md:text-2xl font-light drop-shadow-md"
                                >
                                    {slides[currentIndex].subtitle}
                                </motion.p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110 z-20 group-hover:opacity-100 opacity-0 md:opacity-100"
            >
                <i className="fa-solid fa-chevron-left text-xl"></i>
            </button>

            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110 z-20 group-hover:opacity-100 opacity-0 md:opacity-100"
            >
                <i className="fa-solid fa-chevron-right text-xl"></i>
            </button>
        </div>
    );
};

export default BannerCarousel;
