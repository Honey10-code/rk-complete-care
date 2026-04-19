import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { Helmet } from "react-helmet-async";
import { getPatientStories } from "../services/api";

const StarRating = ({ rating }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
            <i key={i} className={`fa-star text-sm ${i <= rating ? "fa-solid text-amber-400" : "fa-regular text-slate-300"}`}></i>
        ))}
    </div>
);

const PatientStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        getPatientStories()
            .then(data => setStories(data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const conditions = ["All", ...new Set(stories.map(s => s.condition).filter(Boolean))];
    const filtered = filter === "All" ? stories : stories.filter(s => s.condition === filter);
    const featured = stories.filter(s => s.featured);

    return (
        <div className="min-h-screen bg-slate-50">
            <Helmet>
                <title>Patient Stories & Testimonials | RK Total Physiotherapy Care</title>
                <meta name="description" content="Read real recovery stories and testimonials from patients at RK The Complete Care. See how expert physiotherapy changes lives." />
                <link rel="canonical" href="https://rkphysiocare.in/patient-stories" />
                <meta property="og:title" content="Patient Stories & Testimonials | RK Total Physiotherapy Care" />
                <meta property="og:description" content="Read real recovery stories and testimonials from patients at RK The Complete Care. See how expert physiotherapy changes lives." />
                <meta property="og:url" content="https://rkphysiocare.in/patient-stories" />
            </Helmet>
            <Navbar />

            {/* Hero */}
            <section className="relative pt-16 pb-20 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-6">
                            <i className="fa-solid fa-heart-pulse text-amber-500 text-sm"></i>
                            <span className="text-white/70 text-sm font-bold uppercase tracking-widest">Real People · Real Recovery</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-5 leading-tight">
                            Patient <span className="text-blue-500">Stories</span>
                        </h1>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                            Hear from our patients about their recovery journeys and how physiotherapy transformed their lives.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="flex justify-center gap-10 mt-12">
                        {[
                            { value: `${stories.length}+`, label: "Stories Shared" },
                            { value: "98%", label: "Success Rate" },
                            { value: "5★", label: "Avg Rating" },
                        ].map(s => (
                            <div key={s.label} className="text-center">
                                <p className="text-3xl font-black text-white">{s.value}</p>
                                <p className="text-slate-400 text-sm mt-1">{s.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Featured Story */}
            {featured.length > 0 && (
                <section className="max-w-6xl mx-auto px-6 -mt-8 mb-12 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                        className="bg-blue-600 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-blue-500/20 flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-shrink-0">
                            {featured[0].image ? (
                                <img src={featured[0].image} alt={featured[0].patientName} className="w-28 h-28 rounded-2xl object-cover ring-4 ring-white/30 shadow-xl" />
                            ) : (
                                <div className="w-28 h-28 rounded-2xl bg-white/20 flex items-center justify-center text-5xl font-black">{featured[0].patientName?.charAt(0)}</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-amber-400 text-amber-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wide"><i className="fa-solid fa-star mr-1"></i>Featured Story</span>
                                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">{featured[0].condition}</span>
                            </div>
                            <p className="text-xl font-black mb-2">{featured[0].patientName}</p>
                            <p className="text-white/70 text-sm mb-1">{featured[0].age && `${featured[0].age} years`}{featured[0].location && ` · ${featured[0].location}`}</p>
                            <p className="text-white/90 leading-relaxed line-clamp-3 mt-3">"{featured[0].story}"</p>
                            {featured[0].outcome && <p className="mt-3 text-emerald-300 font-bold text-sm"><i className="fa-solid fa-circle-check mr-2"></i>{featured[0].outcome}</p>}
                        </div>
                    </motion.div>
                </section>
            )}

            {/* Filter + Grid */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
                {/* Filter pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {conditions.map(c => (
                        <button key={c} onClick={() => setFilter(c)}
                            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${filter === c ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-white text-slate-500 border border-slate-100 hover:border-blue-200 hover:text-blue-600"}`}>
                            {c}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <i className="fa-solid fa-heart-crack text-5xl mb-4 block opacity-30"></i>
                        <p className="font-semibold text-lg">No stories yet</p>
                        <p className="text-sm mt-1">Patient stories will appear here once added by the admin.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((story, i) => (
                            <motion.div
                                key={story._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.07 }}
                                onClick={() => setSelected(story)}
                                className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            >
                                {story.image && (
                                    <div className="h-48 overflow-hidden bg-slate-100">
                                        <img src={story.image} alt={story.patientName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                )}
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            {!story.image && (
                                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-700 flex items-center justify-center font-black text-lg flex-shrink-0">
                                                    {story.patientName?.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-black text-slate-800">{story.patientName}</p>
                                                <p className="text-xs text-slate-400">{story.age && `${story.age}y`}{story.location && ` · ${story.location}`}</p>
                                            </div>
                                        </div>
                                        <StarRating rating={story.rating} />
                                    </div>
                                    <span className="inline-block bg-blue-50 text-blue-600 text-xs font-black px-3 py-1.5 rounded-xl mb-3">{story.condition} {story.conditionHi && <span className="font-black">({story.conditionHi})</span>}</span>
                                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 italic">"{story.story}"</p>
                                    {story.outcome && (
                                        <p className="mt-3 text-emerald-600 font-bold text-xs flex items-center gap-1.5">
                                            <i className="fa-solid fa-circle-check"></i>{story.outcome}
                                        </p>
                                    )}
                                    <button className="mt-4 text-blue-600 text-xs font-black hover:text-blue-800 transition-colors flex items-center gap-1">
                                        Read full story <i className="fa-solid fa-arrow-right text-[10px]"></i>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA */}
            <section className="bg-blue-600 py-16">
                <div className="max-w-3xl mx-auto px-6 text-center text-white">
                    <h2 className="text-3xl font-black mb-3">Start Your Recovery Journey</h2>
                    <p className="text-white/80 mb-8 font-medium">Join hundreds of patients who have transformed their lives with expert physiotherapy care.</p>
                    <a href="/booking" className="book-btn inline-flex items-center gap-2 bg-white text-blue-600 font-black px-8 py-4 rounded-2xl shadow-xl hover:-translate-y-0.5 transition-all">
                        <i className="fa-solid fa-calendar-check"></i> Book Your Appointment
                    </a>
                </div>
            </section>

            {/* Story Detail Modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            {selected.image && <img src={selected.image} alt={selected.patientName} className="w-full h-64 object-cover rounded-t-3xl" />}
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800">{selected.patientName}</h3>
                                        <p className="text-slate-400 text-sm mt-0.5">{selected.age && `${selected.age} years`}{selected.location && ` · ${selected.location}`}</p>
                                    </div>
                                    <button onClick={() => setSelected(null)} className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-500 flex items-center justify-center transition-all flex-shrink-0"><i className="fa-solid fa-xmark"></i></button>
                                </div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full">{selected.condition} {selected.conditionHi && <span className="font-black">({selected.conditionHi})</span>}</span>
                                    <StarRating rating={selected.rating} />
                                </div>
                                <p className="text-slate-700 leading-relaxed text-base italic mb-8">"{selected.story}"</p>

                                {/* Structured Content Sections */}
                                {selected.sections && selected.sections.length > 0 && (
                                    <div className="space-y-10 mb-8">
                                        {selected.sections.map((sec, idx) => (
                                            <div key={idx} className="space-y-3">
                                                {sec.heading && (
                                                    <h4 className={`text-xl md:text-2xl font-black tracking-tight ${
                                                        sec.headingColor === 'blue' ? 'text-blue-600' :
                                                        sec.headingColor === 'emerald' ? 'text-emerald-600' :
                                                        sec.headingColor === 'indigo' ? 'text-indigo-600' :
                                                        sec.headingColor === 'rose' ? 'text-rose-600' :
                                                        sec.headingColor === 'amber' ? 'text-amber-600' :
                                                        sec.headingColor === 'slate' ? 'text-slate-600' : 'text-blue-600'
                                                    }`}>
                                                        {sec.heading}
                                                    </h4>
                                                )}
                                                {sec.subHeading && (
                                                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                                                        {sec.subHeading}
                                                    </p>
                                                )}
                                                {sec.details && (
                                                    <p className={`text-slate-600 text-sm md:text-base leading-relaxed ${sec.detailsWeight === 'bold' ? 'font-black text-slate-800' : 'font-medium'}`}>
                                                        {sec.details}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {selected.outcome && (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                                        <i className="fa-solid fa-circle-check text-emerald-500 mt-0.5 flex-shrink-0"></i>
                                        <div>
                                            <p className="font-black text-emerald-800 text-sm mb-0.5">Outcome</p>
                                            <p className="text-emerald-700 text-sm">{selected.outcome}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                                    <a href="/booking" className="book-btn inline-flex items-center gap-2 bg-blue-600 text-white font-black px-8 py-3 rounded-xl transition-all text-sm hover:bg-blue-700 shadow-lg shadow-blue-100">
                                        <i className="fa-solid fa-calendar-check"></i> Book Appointment
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PatientStories;
