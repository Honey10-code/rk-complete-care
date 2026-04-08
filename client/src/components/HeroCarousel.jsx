import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
    {
        id: 1,
        title: "RK – The Complete Care",
        subtitle: "Physiotherapy Centre",
        highlight: "Where recovery begins...",
        description: "Experience ultra-premium, personalized physiotherapy care. We combine advanced techniques with a compassionate approach to help you regain your strength and mobility.",
        image: "https://img.freepik.com/free-photo/physiotherapist-doing-healing-treatment-patient_23-2149099355.jpg?t=st=1708170000~exp=1708173600~hmac=123", // General Physio
        color: "text-primary-blue"
    },
    {
        id: 2,
        title: "Joint Replacement",
        subtitle: "& Bone Care",
        highlight: "Regain Your Mobility",
        description: "Expert rehabilitation for Knee and Hip replacement surgeries. We help you get back on your feet faster with our specialized post-op protocols.",
        image: "https://img.freepik.com/free-photo/doctor-examining-patient-s-knee_1098-18342.jpg?t=st=1708170000~exp=1708173600~hmac=123", // Ortho/Joint
        color: "text-accent-green"
    },
    {
        id: 3,
        title: "Advanced Sports",
        subtitle: "Injury Rehabilitation",
        highlight: "Get Back to the Game",
        description: "Specialized care for athletes. From ACL injuries to muscle strains, we provide cutting-edge therapies to ensure a safe and speedy return to sports.",
        image: "https://img.freepik.com/free-photo/sports-physiotherapy-young-woman-getting-treatment_23-2149115748.jpg?t=st=1708170000~exp=1708173600~hmac=123", // Sports
        color: "text-accent-gold"
    },
    {
        id: 4,
        title: "Neurological",
        subtitle: "Rehabilitation",
        highlight: "Restoring Independence",
        description: "Comprehensive care for Stroke, Parkinson's, and Spinal Cord Injuries. Our neuro-rehab program focuses on improving balance, coordination, and daily function.",
        image: "https://img.freepik.com/free-photo/senior-man-doing-exercises-with-physiotherapist_23-2149099397.jpg?t=st=1708170000~exp=1708173600~hmac=123", // Neuro
        color: "text-primary-blue"
    }
];

const HeroCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="relative w-full h-full flex items-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                >
                    <h1 className="leading-tight mb-6 font-bold">
                        <span className={`block text-4xl md:text-6xl ${slides[currentIndex].color} italic`}>
                            {slides[currentIndex].title}
                        </span>

                        <span className="block text-5xl md:text-7xl text-text-dark tracking-tighter">
                            {slides[currentIndex].subtitle}
                        </span>

                        <span className="block text-accent-gold text-2xl font-semibold italic mt-4 tracking-wide">
                            {slides[currentIndex].highlight}
                        </span>
                    </h1>

                    <p className="text-text-muted text-lg mb-8 max-w-lg leading-relaxed">
                        {slides[currentIndex].description}
                    </p>

                    <div className="flex gap-4">
                        <button className="book-btn btn btn-primary inline-block">Get Consultation</button>
                        <a href="#services" className="px-8 py-3 rounded-full border-2 border-accent-gold text-accent-gold font-semibold hover:bg-accent-gold hover:text-white transition-all flex items-center justify-center">
                            Explore Services
                        </a>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            <div className="absolute -bottom-12 left-0 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 bg-primary-blue' : 'w-2 bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
