import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTestimonials } from '../services/api';

const fallbackTestimonials = [
    {
        _id: 'f1',
        name: "Thaker Rathore",
        location: "Jaipur",
        message: "I visited RK – The Complete Care Physiotherapy Centre for physiotherapy treatment and had a positive experience. The clinic environment is clean and comfortable. Dr. Piyush Sharma guided the treatment well and explained the exercises clearly. Dr. Soniya Pathak was also supportive during the sessions. Overall, I am satisfied with the care and would visit again if needed.",
        rating: 5
    },
    {
        _id: 'f2',
        name: "Pragati Mathur",
        location: "Jaipur",
        message: "I am currently 2.5 months post-op for proximal tibia fracture and Dr. Piyush is my physiotherapist. He is very friendly, very calm while explaining everything and he explains everything clearly as well. He is very consistent and always available whenever needed. Under his guidance I have been recovering very well. I am able to walk quite effectively and my muscle strength has improved very very much.",
        rating: 5
    },
    {
        _id: 'f3',
        name: "Tarun Singh",
        location: "Jaipur",
        message: "Dr.Piyush ji sir is a very awesome doctor, His care towards patient is extremely superior.....!",
        rating: 5
    },
    {
        _id: 'f4',
        name: "Rahul Sharma",
        location: "Jaipur",
        message: "The facilities and the treatment of this clinic is very very impressive. My mother was having heel and knee pain and was suffering from this from last 2years. After the treatment and within 5 sitting my mother is now completely fine and very happy as she is a working women. She is very happy. All thanks to dr piyush Sharma and dr soniya ji. Highly recommend clinic from my side",
        rating: 5
    },
    {
        _id: 'f5',
        name: "Vikas Jangid",
        location: "Jaipur",
        message: "One of the best physiotherapy clinics in Jaipur. Very professional approach and effective treatment for my back pain.",
        rating: 5
    },
    {
        _id: 'f6',
        name: "Anjali Gupta",
        location: "Jaipur",
        message: "Highly recommended! Dr. Piyush and his team are very professional and caring.",
        rating: 5
    },
    {
        _id: 'f7',
        name: "Sandeep Saini",
        location: "Jaipur",
        message: "The way they handle patients is very impressive. Recovery is much faster with their guidance.",
        rating: 5
    }
];

const getGradient = (name) => {
    const gradients = [
        "from-blue-500 to-indigo-600",
        "from-emerald-500 to-teal-600",
        "from-violet-500 to-purple-600",
        "from-rose-500 to-orange-600",
        "from-cyan-500 to-blue-600"
    ];
    const index = name?.charCodeAt(0) % gradients.length || 0;
    return gradients[index];
};

const TestimonialCard = ({ testimonial }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const message = testimonial?.message || testimonial?.text || '';
    const shouldTruncate = message.length > 150;
    const displayText = isExpanded ? message : message.slice(0, 150) + (shouldTruncate ? '...' : '');

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative bg-white rounded-[2rem] p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.06)] border border-slate-100 hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.12)] hover:border-blue-100 transition-all duration-500 flex flex-col"
        >
            {/* Header: Avatar + Info */}
            <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getGradient(testimonial.name)} flex items-center justify-center text-white text-xl font-black shadow-lg ring-4 ring-white`}>
                    {testimonial.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                    <h5 className="font-extrabold text-slate-900 truncate leading-tight">{testimonial.name}</h5>
                    <p className="text-[10px] text-blue-600 uppercase font-black tracking-widest flex items-center gap-1.5 opacity-80">
                        <i className="fa-solid fa-location-dot"></i> {testimonial.location || 'Jaipur'}
                    </p>
                </div>
                <div className="flex-none bg-blue-50/50 p-2 rounded-xl text-blue-600 border border-blue-100/50 group-hover:scale-110 transition-transform">
                    <i className="fa-brands fa-google text-lg"></i>
                </div>
            </div>

            {/* Content */}
            <div className="flex gap-1 mb-4 text-xs text-amber-400">
                {[...Array(5)].map((_, i) => (
                    <i key={i} className="fa-solid fa-star"></i>
                ))}
            </div>

            <div className="relative flex-1">
                <p className="text-slate-600 leading-relaxed font-medium text-[15px]">
                    "{displayText}"
                </p>
                {shouldTruncate && (
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-3 text-blue-600 font-bold text-xs hover:text-blue-700 transition-colors flex items-center gap-1 group/btn"
                    >
                        {isExpanded ? 'Show Less' : 'Read More'}
                        <i className={`fa-solid fa-chevron-down text-[9px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}></i>
                    </button>
                )}
            </div>

            {/* Footer Badge */}
            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Verified Experience
                </div>
                <div className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 font-black px-2 py-1 rounded-lg border border-emerald-100">
                    <i className="fa-solid fa-circle-check"></i>
                    GOOGLE REVIEW
                </div>
            </div>
        </motion.div>
    );
};

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState(fallbackTestimonials);
    const [visibleCount, setVisibleCount] = useState(6);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const data = await getTestimonials();
                if (data && data.length > 0) {
                    setTestimonials(data);
                }
            } catch (err) {
                console.error('Testimonials load failed:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    const visibleTestimonials = useMemo(() => {
        return testimonials.slice(0, visibleCount);
    }, [testimonials, visibleCount]);

    return (
        <section id="testimonials" className="py-24 relative overflow-hidden bg-white border-t border-slate-50">
            {/* Artistic Background Nodes */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-blue-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-50/40 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 shadow-sm mb-6"
                    >
                        <i className="fa-solid fa-certificate text-blue-500"></i>
                        Wall of Love · मरीज़ों की राय
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                        Stories of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">Recovery</span>
                    </h2>
                    
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto mb-10">
                        Join 5000+ happy patients who started their journey to a pain-free life at RKCare.
                    </p>

                    {/* Summary Rating Chip */}
                    <div className="flex justify-center">
                        <div className="px-8 py-4 bg-slate-900 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center gap-4 sm:gap-8 border border-white/10 group cursor-default">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className="fa-solid fa-star text-sm"></i>
                                    ))}
                                </div>
                                <span className="text-white font-black text-xl">4.9/5</span>
                            </div>
                            <div className="hidden sm:block w-px h-8 bg-white/20"></div>
                            <div className="text-slate-400 text-sm font-bold flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                100+ Verified Patient Reviews on Google
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    <AnimatePresence>
                        {visibleTestimonials.map((testimonial, index) => (
                            <TestimonialCard key={testimonial._id || index} testimonial={testimonial} />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center gap-8">
                    {visibleCount < testimonials.length && (
                        <button 
                            onClick={() => setVisibleCount(prev => prev + 6)}
                            className="px-10 py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-black text-sm hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm active:scale-95 flex items-center gap-3"
                        >
                            <i className="fa-solid fa-plus-circle"></i> Load More Stories
                        </button>
                    )}

                    <div className="flex flex-wrap justify-center gap-4">
                        <a 
                            href="https://g.page/r/CXkFsimafLKiEAE/review" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-[2rem] font-black text-sm shadow-[0_15px_40px_-8px_rgba(37,99,235,0.4)] hover:shadow-[0_20px_50px_-5px_rgba(37,99,235,0.6)] transform hover:-translate-y-1 transition-all group"
                        >
                            <i className="fa-brands fa-google text-xl transition-transform group-hover:rotate-12"></i>
                            Share Your Experience on Google
                        </a>
                        <a 
                            href="https://g.page/r/CXkFsimafLKiEAE" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-white border-2 border-slate-100 text-slate-800 rounded-[2rem] font-black text-sm hover:border-blue-200 hover:bg-slate-50 transition-all transform hover:-translate-y-1 group"
                        >
                            <i className="fa-solid fa-magnifying-glass text-blue-600"></i>
                            View All Google Reviews
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
