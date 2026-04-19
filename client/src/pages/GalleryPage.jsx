import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api, { getGalleryImages, getVideos } from '../services/api';

// Placeholder premium clinic/physiotherapy images
const fallbackImages = [
    { _id: '1', image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop", category: "Clinic", title: "Modern Clinic Reception" },
    { _id: '2', image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop", category: "Therapy", title: "Active Physiotherapy Session" },
    { _id: '3', image: "https://images.unsplash.com/photo-1576091160550-2173ff9e5eb3?q=80&w=2068&auto=format&fit=crop", category: "Equipment", title: "Advanced Medical Equipment" },
    { _id: '4', image: "https://images.unsplash.com/photo-1588286840104-44dad180e1b3?q=80&w=2070&auto=format&fit=crop", category: "Therapy", title: "Neck Alignment Therapy" }
];

const categories = ["All", "Clinic", "Therapy", "Equipment"];

const GalleryPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'photos';
    
    const [galleryImages, setGalleryImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedItem, setSelectedItem] = useState(null); // Can be image or video
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeTab === 'photos') {
                    const data = await getGalleryImages();
                    setGalleryImages(data && data.length > 0 ? data : fallbackImages);
                } else {
                    const data = await getVideos();
                    setVideos(data || []);
                }
            } catch (err) {
                console.error("Gallery fetch error:", err);
                if (activeTab === 'photos') setGalleryImages(fallbackImages);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeTab]);

    const filteredImages = selectedCategory === "All" 
        ? galleryImages 
        : galleryImages.filter(img => img.category === selectedCategory);

    const getYoutubeID = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const getVimeoID = (url) => {
        const match = url.match(/vimeo\.com\/(\d+)/);
        return match ? match[1] : null;
    };

    const renderEmbed = (url) => {
        const ytId = getYoutubeID(url);
        if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1`;
        const vimeoId = getVimeoID(url);
        if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
        return url;
    };

    const getThumbnail = (url) => {
        const ytId = getYoutubeID(url);
        if (ytId) return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
        return "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=2070&auto=format&fit=crop"; // Video placeholder
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Helmet>
                <title>{activeTab === 'photos' ? 'Clinic Gallery & Inside Look' : 'Clinical Education Videos'} | RK The Complete Care</title>
                <meta name="description" content="See our modern clinic facilities and watch educational physiotherapy videos for better health insights." />
                <link rel="canonical" href={`https://rkphysiocare.in/gallery${activeTab === 'videos' ? '?tab=videos' : ''}`} />
                <meta property="og:title" content={`${activeTab === 'photos' ? 'Clinic Gallery & Inside Look' : 'Clinical Education Videos'} | RK The Complete Care`} />
                <meta property="og:description" content="See our modern clinic facilities and watch educational physiotherapy videos for better health insights." />
                <meta property="og:url" content={`https://rkphysiocare.in/gallery${activeTab === 'videos' ? '?tab=videos' : ''}`} />
            </Helmet>

            <Navbar />

            {/* Header Section */}
            <header className="pt-20 pb-16 relative overflow-hidden bg-white border-b border-slate-200">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-widest mb-6 border border-blue-100 shadow-sm">
                            <i className={activeTab === 'photos' ? "fa-regular fa-images" : "fa-solid fa-circle-play"}></i> 
                            {activeTab === 'photos' ? "Inside The Clinic" : "Clinical Education"}
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">{activeTab === 'photos' ? "Gallery" : "Videos"}</span>
                        </h1>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                            {activeTab === 'photos' 
                                ? "Take a virtual tour through our state-of-the-art facilities and witness our dedicated approach to your clinical recovery."
                                : "Explore our informational videos, therapy walkthroughs, and success stories to help you on your journey to recovery."}
                        </p>
                    </motion.div>

                    {/* Tab Switcher */}
                    <div className="flex justify-center mt-12">
                        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 shadow-inner border border-slate-200">
                            <button 
                                onClick={() => setSearchParams({ tab: 'photos' })}
                                className={`px-8 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === 'photos' ? "bg-white text-blue-600 shadow-md" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                <i className="fa-solid fa-camera"></i> Photos
                            </button>
                            <button 
                                onClick={() => setSearchParams({ tab: 'videos' })}
                                className={`px-8 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === 'videos' ? "bg-white text-blue-600 shadow-md" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                <i className="fa-solid fa-play"></i> Videos
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Gallery Content */}
            <main className="flex-grow container mx-auto px-6 py-16">
                
                {activeTab === 'photos' && (
                    <>
                        <div className="flex flex-wrap justify-center gap-3 mb-12">
                            {categories.map((cat) => (
                                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${selectedCategory === cat ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200" : "bg-white text-slate-600 hover:bg-blue-50 border border-slate-200"}`}>{cat}</button>
                            ))}
                        </div>

                        <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                            <AnimatePresence>
                                {filteredImages.map((image) => (
                                    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }} key={image._id || image.id} className="break-inside-avoid relative group rounded-[1.5rem] overflow-hidden bg-slate-200 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1" onClick={() => setSelectedItem({ ...image, type: 'image' })}>
                                        <img src={image.image || image.src} alt={image.title} className="w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" loading="lazy" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                            <span className="px-3 py-1 bg-blue-600/90 text-white text-[10px] font-black uppercase tracking-widest rounded-lg mb-2 inline-block">{image.category}</span>
                                            <h3 className="text-white font-bold text-lg leading-tight">{image.title}</h3>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </>
                )}

                {activeTab === 'videos' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {videos.map((vid, idx) => (
                                <motion.div key={vid._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setSelectedItem({ ...vid, type: 'video' })}>
                                    <div className="relative aspect-video overflow-hidden">
                                        <img src={getThumbnail(vid.videoUrl)} alt={vid.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:scale-110 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300">
                                                <i className="fa-solid fa-play text-xl ml-1"></i>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-4 left-4"><span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg">{vid.category}</span></div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{vid.title}</h3>
                                        <p className="text-slate-400 text-sm mt-2 font-medium">Click to watch video therapy</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {videos.length === 0 && !loading && (
                            <div className="col-span-full py-20 text-center text-slate-400">
                                <i className="fa-solid fa-film text-5xl mb-4 block opacity-30"></i>
                                <p className="font-bold">No videos available yet. Stay tuned!</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Premium Lightbox Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl p-4 sm:p-8" onClick={() => setSelectedItem(null)}>
                        <button className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-900 flex items-center justify-center transition-all" onClick={() => setSelectedItem(null)}><i className="fa-solid fa-xmark text-xl"></i></button>
                        
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative max-w-5xl w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
                            {selectedItem.type === 'image' ? (
                                <img src={selectedItem.image || selectedItem.src} alt={selectedItem.title} className="w-full h-full object-contain" />
                            ) : (
                                <iframe src={renderEmbed(selectedItem.videoUrl)} title={selectedItem.title} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            )}
                            <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                                <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg mb-2 inline-block">{selectedItem.category}</span>
                                <h3 className="text-2xl text-white font-bold">{selectedItem.title}</h3>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default GalleryPage;
