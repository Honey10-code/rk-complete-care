import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api, { getGalleryImages } from '../services/api';

// Placeholder premium clinic/physiotherapy images
const fallbackImages = [
    { _id: '1', image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop", category: "Clinic", title: "Modern Clinic Reception" },
    { _id: '2', image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop", category: "Therapy", title: "Active Physiotherapy Session" },
    { _id: '3', image: "https://images.unsplash.com/photo-1576091160550-2173ff9e5eb3?q=80&w=2068&auto=format&fit=crop", category: "Equipment", title: "Advanced Medical Equipment" },
    { _id: '4', image: "https://images.unsplash.com/photo-1588286840104-44dad180e1b3?q=80&w=2070&auto=format&fit=crop", category: "Therapy", title: "Neck Alignment Therapy" }
];

const categories = ["All", "Clinic", "Therapy", "Equipment"];

const GalleryPage = () => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const data = await getGalleryImages();
                if (data && data.length > 0) {
                    setGalleryImages(data);
                } else {
                    setGalleryImages(fallbackImages);
                }
            } catch (err) {
                setGalleryImages(fallbackImages);
            }
        };
        fetchGallery();
    }, []);

    const filteredImages = selectedCategory === "All" 
        ? galleryImages 
        : galleryImages.filter(img => img.category === selectedCategory);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Helmet>
                <title>Clinic Gallery | RK The Complete Care</title>
                <meta name="description" content="View images of our highly-equipped physiotherapy clinic, advanced medical equipment, and active recovery therapy sessions." />
            </Helmet>

            <Navbar />

            {/* Header Section */}
            <header className="pt-40 pb-16 relative overflow-hidden bg-white border-b border-slate-200">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-widest mb-6 border border-blue-100 shadow-sm">
                            <i className="fa-regular fa-images"></i> Inside The Clinic
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">Gallery</span>
                        </h1>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
                            Take a virtual tour through our state-of-the-art facilities and witness our dedicated approach to your clinical recovery.
                        </p>
                    </motion.div>
                </div>
            </header>

            {/* Gallery Content */}
            <main className="flex-grow container mx-auto px-6 py-16">
                
                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                                selectedCategory === cat 
                                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200" 
                                    : "bg-white text-slate-600 hover:bg-blue-50 border border-slate-200"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Images Layout */}
                <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    <AnimatePresence>
                        {filteredImages.map((image) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                key={image._id || image.id}
                                className="break-inside-avoid relative group rounded-[1.5rem] overflow-hidden bg-slate-200 cursor-pointer shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-1"
                                onClick={() => setSelectedImage(image)}
                            >
                                <img 
                                    src={image.image || image.src} 
                                    alt={image.title || image.alt} 
                                    className="w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest rounded-lg mb-2 inline-block">
                                        {image.category}
                                    </span>
                                    <h3 className="text-white font-bold text-lg leading-tight shadow-sm">
                                        {image.title || image.alt}
                                    </h3>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </main>

            {/* Lightbox / Fullscreen Image Viewer Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-4 md:p-8"
                        onClick={() => setSelectedImage(null)}
                    >
                        {/* Close Button */}
                        <button 
                            className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-900 flex items-center justify-center transition-all backdrop-blur-md"
                            onClick={() => setSelectedImage(null)}
                        >
                            <i className="fa-solid fa-xmark text-xl"></i>
                        </button>
                        
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative max-w-5xl w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()} // Prevent click-through closing
                        >
                            <img 
                                src={selectedImage.image || selectedImage.src} 
                                alt={selectedImage.title || selectedImage.alt} 
                                className="w-full h-full object-contain bg-black/50"
                            />
                            
                            <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 bg-gradient-to-t from-black/90 to-transparent">
                                <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest rounded-lg mb-2 inline-block">
                                    {selectedImage.category}
                                </span>
                                <h3 className="text-2xl text-white font-bold">{selectedImage.title || selectedImage.alt}</h3>
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
