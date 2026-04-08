import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { getClinicPosters } from "../services/api";

const CATEGORIES = ["All", "Awareness", "Services", "Events", "Health Tips", "Offers", "General"];

const ClinicPosters = () => {
    const [posters, setPosters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [lightbox, setLightbox] = useState(null);

    useEffect(() => {
        getClinicPosters()
            .then(data => setPosters(data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const filtered = filter === "All" ? posters : posters.filter(p => p.category === filter);
    const availableCategories = ["All", ...new Set(posters.map(p => p.category).filter(Boolean))];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-16 pb-20 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
                            <i className="fa-solid fa-images text-blue-400 text-sm"></i>
                            <span className="text-white/70 text-sm font-bold uppercase tracking-widest">Clinic Updates · Announcements</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">
                            Clinic <span className="text-blue-500">Blogs</span>
                        </h1>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                            Stay updated with our latest health tips, service announcements, events, and special offers.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filter + Grid */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                {/* Category filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {availableCategories.map(c => (
                        <button key={c} onClick={() => setFilter(c)}
                            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${filter === c ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white text-slate-500 border border-slate-100 hover:border-blue-200 hover:text-blue-600"}`}>
                            {c}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-bold animate-pulse uppercase tracking-[0.2em] text-[10px]">Loading Blogs...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm px-10">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="fa-solid fa-image text-4xl text-slate-200"></i>
                        </div>
                        <p className="font-black text-2xl text-slate-800">No blogs published yet</p>
                        <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">Our clinical team is currently preparing updates. Stay tuned for health tips and clinic news!</p>
                    </div>
                ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                        {filtered.map((poster, i) => (
                            <motion.div
                                key={poster._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                onClick={() => setLightbox(poster)}
                                className="group break-inside-avoid bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)] hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                            >
                                <div className="relative overflow-hidden aspect-[4/5]">
                                    <img
                                        src={poster.image}
                                        alt={poster.title || "Clinic Poster"}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                        onError={e => { e.target.src = "https://placehold.co/400x500?text=Poster"; }}
                                    />
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                        <div className="text-white">
                                            <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-blue-200">View Article</p>
                                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                                <i className="fa-solid fa-expand text-sm"></i>
                                            </div>
                                        </div>
                                    </div>
                                    {poster.category && poster.category !== "General" && (
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-blue-600/90 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-wider">{poster.category}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    {poster.title && (
                                        <h3 className="font-black text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {poster.title}
                                        </h3>
                                    )}
                                    {poster.description && (
                                        <p className="text-slate-500 text-sm mt-3 leading-relaxed line-clamp-3 font-medium opacity-80">
                                            {poster.description}
                                        </p>
                                    )}
                                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            Official Update
                                        </span>
                                        <i className="fa-solid fa-arrow-right-long text-blue-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></i>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            <AnimatePresence>
                {lightbox && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 bg-slate-950/90 z-[200] flex items-start justify-center p-4 md:p-10 backdrop-blur-md overflow-y-auto pt-20 pb-20" 
                        onClick={() => setLightbox(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 40 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.95, opacity: 0, y: 40 }} 
                            onClick={e => e.stopPropagation()} 
                            className="relative max-w-2xl w-full my-auto"
                        >
                            {/* Top Right Close Button */}
                            <button 
                                onClick={() => setLightbox(null)} 
                                className="absolute -top-12 -right-2 md:-right-10 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/30 flex items-center justify-center transition-all z-20 border border-white/10 group shadow-2xl"
                            >
                                <i className="fa-solid fa-xmark text-lg group-hover:rotate-90 transition-transform duration-300"></i>
                            </button>

                            <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/5">
                                {/* Image Area */}
                                <div className="relative bg-[#0a0c10] flex items-center justify-center min-h-[350px] overflow-hidden">
                                    <img 
                                        src={lightbox.image} 
                                        alt={lightbox.title} 
                                        className="w-full h-full object-contain block mx-auto hover:scale-105 transition-transform duration-700" 
                                    />
                                    {/* Category Badge on Top Left */}
                                    <div className="absolute top-6 left-6">
                                        <span className="px-3 py-1 bg-[#2563eb] text-white text-[9px] font-black uppercase tracking-[0.15em] rounded-lg shadow-xl shadow-blue-900/40 border border-blue-400/20">
                                            {lightbox.category || "General"}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Content Area */}
                                {(lightbox.title || lightbox.description) && (
                                    <div className="p-10 md:p-14 bg-[#111827]">
                                        {lightbox.title && (
                                            <h3 className="text-white text-4xl md:text-5xl font-black tracking-tight leading-tight mb-8 drop-shadow-sm">
                                                {lightbox.title}
                                            </h3>
                                        )}
                                        {lightbox.description && (
                                            <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-medium max-w-3xl mb-12 opacity-90">
                                                {lightbox.description}
                                            </p>
                                        )}
                                        
                                        {/* Separator Line */}
                                        <div className="w-full h-px bg-white/5 mb-10"></div>

                                        {/* Icon Footer */}
                                        <div className="flex flex-wrap items-center gap-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center border border-blue-500/20 shadow-lg">
                                                    <i className="fa-solid fa-bolt text-blue-500 text-xs"></i>
                                                </div>
                                                <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Clinic Update</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-600/10 flex items-center justify-center border border-emerald-500/20 shadow-lg">
                                                    <i className="fa-solid fa-shield-heart text-emerald-500 text-xs"></i>
                                                </div>
                                                <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">RK THE COMPLETE CARE</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClinicPosters;
