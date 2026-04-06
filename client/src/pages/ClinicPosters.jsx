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
            <section className="relative pt-32 pb-20 bg-slate-900 overflow-hidden">
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
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <i className="fa-solid fa-image text-5xl mb-4 block opacity-30"></i>
                        <p className="font-semibold text-lg">No blogs yet</p>
                        <p className="text-sm mt-1">Clinic blogs will appear here once uploaded by the admin.</p>
                    </div>
                ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
                        {filtered.map((poster, i) => (
                            <motion.div
                                key={poster._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.06 }}
                                onClick={() => setLightbox(poster)}
                                className="group break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={poster.image}
                                        alt={poster.title || "Clinic Poster"}
                                        className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={e => { e.target.src = "https://placehold.co/400x500?text=Poster"; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <i className="fa-solid fa-expand text-white text-xl"></i>
                                    </div>
                                    {poster.category && poster.category !== "General" && (
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-lg">{poster.category}</span>
                                        </div>
                                    )}
                                </div>
                                {(poster.title || poster.description) && (
                                    <div className="p-4">
                                        {poster.title && <h3 className="font-black text-slate-800 text-sm">{poster.title}</h3>}
                                        {poster.description && <p className="text-slate-500 text-xs mt-1 leading-relaxed">{poster.description}</p>}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            <AnimatePresence>
                {lightbox && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()} className="relative max-w-3xl w-full">
                            <button onClick={() => setLightbox(null)} className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all z-10">
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                            <img src={lightbox.image} alt={lightbox.title} className="w-full rounded-2xl shadow-2xl max-h-[80vh] object-contain" />
                            {(lightbox.title || lightbox.description) && (
                                <div className="mt-4 text-center">
                                    {lightbox.title && <h3 className="text-white font-black text-lg">{lightbox.title}</h3>}
                                    {lightbox.description && <p className="text-white/60 text-sm mt-1">{lightbox.description}</p>}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClinicPosters;
