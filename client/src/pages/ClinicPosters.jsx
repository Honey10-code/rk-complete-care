import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getClinicPosters } from "../services/api";
import logoImg from "../assets/images/LOGO.png";

const CATEGORIES = ["All", "Awareness", "Services", "Events", "Health Tips", "Offers", "General"];

// ── Blog Detail View (Services Style) ───────────────────────────────────────────
const BlogDetail = ({ poster, onBack, onSelectPoster, allPosters }) => {
    return (
        <motion.div
            key={poster._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="pb-20"
        >
            {/* Gradient Header Banner */}
            <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                <div className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
                <div className="relative z-10 px-8 py-16 md:py-24 text-center">
                    <button
                        onClick={onBack}
                        className="absolute left-6 top-8 flex items-center gap-2 text-white/60 hover:text-white text-xs font-black uppercase tracking-widest transition-all hover:-translate-x-1"
                    >
                        <i className="fa-solid fa-arrow-left"></i> All Articles
                    </button>
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
                        <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">{poster.category || "General"}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-4xl mx-auto drop-shadow-md">
                        {poster.title}
                    </h1>
                </div>
            </div>

            {/* Content Layout */}
            <div className="grid lg:grid-cols-[1fr_320px] gap-12">
                {/* Main Content */}
                <div className="space-y-12">
                    {/* Featured Image */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 bg-white">
                        <img
                            src={poster.image}
                            alt={poster.title}
                            className="w-full h-auto object-cover max-h-[600px]"
                            onError={e => { e.target.src = 'https://placehold.co/1200x600?text=' + poster.title; }}
                        />
                    </div>

                    {/* Article Body */}
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
                        
                        {poster.description && (
                            <div className="relative z-10 text-slate-500 text-lg md:text-xl leading-relaxed font-medium mb-12 italic border-l-4 border-blue-500 pl-6">
                                "{poster.description}"
                            </div>
                        )}

                        {/* Structured Sections */}
                        {poster.sections && poster.sections.length > 0 && (
                            <div className="relative z-10 space-y-16">
                                {poster.sections.map((sec, idx) => (
                                    <div key={idx} className="group">
                                        {sec.heading && (
                                            <h2 className={`text-2xl md:text-4xl font-black tracking-tight mb-6 transition-colors ${
                                                sec.headingColor === 'blue' ? 'text-blue-600' :
                                                sec.headingColor === 'emerald' ? 'text-emerald-600' :
                                                sec.headingColor === 'indigo' ? 'text-indigo-600' :
                                                sec.headingColor === 'rose' ? 'text-rose-600' :
                                                sec.headingColor === 'amber' ? 'text-amber-600' :
                                                sec.headingColor === 'slate' ? 'text-slate-700' : 'text-slate-900'
                                            }`}>
                                                {sec.heading}
                                            </h2>
                                        )}
                                        {sec.subHeading && (
                                            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-4">
                                                {sec.subHeading}
                                            </p>
                                        )}
                                        {sec.details && (
                                            <p className={`text-slate-600 text-lg leading-relaxed ${sec.detailsWeight === 'bold' ? 'font-black text-slate-800' : 'font-medium'}`}>
                                                {sec.details}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Article Footer */}
                        <div className="relative z-10 mt-20 pt-10 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-slate-100 overflow-hidden p-1">
                                    <img src={logoImg} alt="RK Logo" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <p className="text-slate-800 font-black text-sm uppercase tracking-wider">RK The Complete Care</p>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Where Recovery Begins...</p>
                                </div>
                            </div>
                            <Link to="/booking" className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1">
                                Book Consult <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <aside className="space-y-8">
                    <div className="sticky top-24 space-y-8">
                        {/* More Articles Sidebar */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <i className="fa-solid fa-bars-staggered text-blue-500"></i> Other Articles
                            </h4>
                            <div className="space-y-3">
                                {allPosters.slice(0, 8).map(p => (
                                    <button
                                        key={p._id}
                                        onClick={() => onSelectPoster(p._id)}
                                        className={`w-full text-left p-4 rounded-2xl text-[11px] font-black transition-all group flex gap-3 ${
                                            p._id === poster._id
                                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-100'
                                                : 'bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                    >
                                        <div className={`w-2 h-2 rounded-full mt-0.5 shrink-0 ${p._id === poster._id ? 'bg-white' : 'bg-blue-300'}`}></div>
                                        <span className="line-clamp-2">{p.title}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* CTA Sidebar */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                            <h4 className="text-xl font-black leading-tight mb-4 relative z-10">Ready to start your recovery?</h4>
                            <p className="text-blue-100 text-xs mb-8 font-medium leading-relaxed relative z-10">Our expert doctors are here to help you get back to what you love.</p>
                            <Link to="/booking" className="block w-full text-center py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all relative z-10">
                                Book Appointment Now <i className="fa-solid fa-arrow-right ml-2 text-xs"></i>                                
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </motion.div>
    );
};

// ── Main Page Component ────────────────────────────────────────────────────────
const ClinicPosters = () => {
    const [posters, setPosters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        getClinicPosters()
            .then(data => setPosters(data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const articleId = searchParams.get('article');
    const selectedPoster = posters.find(p => p._id === articleId);

    const handleSelectPoster = (id) => {
        setSearchParams({ article: id });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setSearchParams({});
    };

    const filtered = filter === "All" ? posters : posters.filter(p => p.category === filter);
    const availableCategories = ["All", ...new Set(posters.map(p => p.category).filter(Boolean))];

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center py-64 space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-black animate-pulse uppercase tracking-[0.3em] text-[10px]">Accessing Medical Archives...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-12 pb-24">
                <AnimatePresence mode="wait">
                    {selectedPoster ? (
                        <BlogDetail
                            poster={selectedPoster}
                            onBack={handleBack}
                            onSelectPoster={handleSelectPoster}
                            allPosters={posters}
                        />
                    ) : (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Hero */}
                            <header className="mb-20 text-center">
                                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-5 py-2 mb-8 shadow-sm">
                                    <i className="fa-solid fa-sparkles text-blue-500 text-xs"></i>
                                    <span className="text-blue-700 text-[10px] font-black uppercase tracking-[0.2em]">Clinical Publication Board</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                    Official Clinic <span className="text-blue-600">Archive</span>
                                </h1>
                                <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                                    Explore expert insights on physiotherapy, wellness, and clinic updates from our recovery specialists.
                                </p>
                            </header>

                            {/* Category filter */}
                            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                                {availableCategories.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setFilter(c)}
                                        className={`px-6 py-3 rounded-2xl text-[11px] font-black tracking-widest uppercase transition-all shadow-sm border ${
                                            filter === c
                                                ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100 -translate-y-1"
                                                : "bg-white text-slate-500 border-slate-100 hover:border-blue-200 hover:text-blue-600"
                                        }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>

                            {filtered.length === 0 ? (
                                <div className="text-center py-40 bg-white rounded-[3rem] border border-slate-100 shadow-sm px-10">
                                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-300">
                                        <i className="fa-solid fa-newspaper text-5xl"></i>
                                    </div>
                                    <p className="font-black text-3xl text-slate-900 mb-3">No articles found</p>
                                    <p className="text-slate-400 text-sm max-w-sm mx-auto font-medium">Our clinical team is currently preparing updates for this category.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filtered.map((poster, i) => (
                                        <motion.article
                                            key={poster._id}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: i * 0.1 }}
                                            viewport={{ once: true }}
                                            onClick={() => handleSelectPoster(poster._id)}
                                            className="group bg-white rounded-[3rem] p-4 transition-all duration-500 border border-slate-100 overflow-hidden hover:shadow-[0_40px_80px_rgba(37,99,235,0.12)] hover:-translate-y-3 cursor-pointer flex flex-col h-full"
                                        >
                                            <div className="relative h-64 rounded-[2.5rem] overflow-hidden mb-8">
                                                <img
                                                    src={poster.image}
                                                    alt={poster.title}
                                                    className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                                                    onError={e => { e.target.src = "https://placehold.co/400x500?text=Poster"; }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                <div className="absolute top-5 left-5">
                                                    <span className="bg-white/95 backdrop-blur-md text-blue-600 text-[10px] font-black px-4 py-2 rounded-2xl shadow-xl uppercase tracking-widest">{poster.category || "General"}</span>
                                                </div>
                                            </div>

                                            <div className="px-4 pb-4 flex flex-col flex-grow">
                                                <h3 className="font-black text-slate-900 text-xl leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 mb-4">
                                                    {poster.title}
                                                </h3>
                                                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow opacity-80 font-medium line-clamp-3">
                                                    {poster.description}
                                                </p>
                                                <div className="w-full py-5 bg-slate-50 group-hover:bg-blue-600 text-slate-400 group-hover:text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-3">
                                                    Read Publication
                                                    <i className="fa-solid fa-arrow-right-long transition-transform group-hover:translate-x-3"></i>
                                                </div>
                                            </div>
                                        </motion.article>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Footer />
        </div>
    );
};

export default ClinicPosters;
