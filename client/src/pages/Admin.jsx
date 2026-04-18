import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/images/LOGO.png";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import api, {
    getAppointments, patchAppointment, deleteAppointment,
    getDoctors, postDoctor, deleteDoctor,
    getTestimonials, postTestimonial, deleteTestimonial,
    getClinicInfo, postClinicInfo,
    getBanners, postBanner,
    getServices, postService, updateService, deleteService,
    getExercises, postExercise, updateExercise, deleteExercise,
    updatePatientStory
} from "../services/api";

// ─── Toast System ────────────────────────────────────────────────────────────
const Toast = ({ toasts, removeToast }) => (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
            {toasts.map((t) => (
                <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: 80, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 80, scale: 0.9 }}
                    className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-slate-800 text-sm font-semibold min-w-[280px] border border-slate-100 bg-white ${t.type === "success" ? "border-l-4 border-l-emerald-500" :
                        t.type === "error" ? "border-l-4 border-l-rose-500" : "border-l-4 border-l-blue-500"
                        }`}
                >
                    <i className={`fa-solid ${t.type === "success" ? "fa-circle-check text-emerald-500" : t.type === "error" ? "fa-circle-xmark text-rose-500" : "fa-circle-info text-blue-500"} text-lg`}></i>
                    <span className="flex-1">{t.message}</span>
                    <button onClick={() => removeToast(t.id)} className="text-slate-400 hover:text-slate-600 transition-colors ml-2">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </motion.div>
            ))}
        </AnimatePresence>
    </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon, color, sub, onClick, isActive }) => (
    <div onClick={onClick} className={`bg-white rounded-2xl p-6 shadow-sm border ${isActive ? 'border-blue-400 ring-2 ring-blue-50' : 'border-slate-100 hover:border-slate-300'} flex flex-col card-hover-simple cursor-pointer transition-all`}>
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color === 'blue' ? 'bg-blue-50 text-blue-600' :
                color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                    color === 'amber' ? 'bg-amber-50 text-amber-600' :
                        color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                }`}>
                <i className={`fa-solid ${icon}`}></i>
            </div>
            {sub && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{sub}</span>}
        </div>
        <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-3xl font-black text-slate-800">{value}</h3>
        </div>
    </div>
);

// ─── Input Style ─────────────────────────────────────────────────────────────
const inp = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(13, 148, 136,0.30)] focus:border-blue-100/50 transition-all text-slate-700 text-sm";

// ─── Main Admin Component ─────────────────────────────────────────────────────
const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("appointments");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    // Toast helpers
    const addToast = useCallback((message, type = "info") => {
        const id = Date.now();
        setToasts(p => [...p, { id, message, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
    }, []);
    const removeToast = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);

    // ── Appointments ──────────────────────────────────────────────────────────
    const [appointments, setAppointments] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, today: 0 });

    const fetchAppointments = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) { navigate("/login"); return; }
            const data = await getAppointments(search);
            setAppointments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log("ERROR:", err?.response?.data || err.message);


            if (err.response?.status === 401) {
                navigate("/login");
            }
            setAppointments([]); // fallback
        } finally { setLoading(false); }
    }, [search, navigate]);

    useEffect(() => { if (activeTab === "appointments") fetchAppointments(); }, [search, activeTab, fetchAppointments]);

    // ── Socket.io Setup ──────────────────────────────────────────────────────
    useEffect(() => {
        const socketUrl = (import.meta.env.VITE_API_URL || "http://127.0.0.1:5001/api").replace('/api', '');
        const socket = io(socketUrl);

        socket.on('connect', () => {
            console.log('🔌 Connected to real-time server');
            socket.emit('join-admin-room');
        });

        socket.on('new-appointment', (data) => {
            console.log('🔔 New appointment received:', data);
            
            // 🔊 Play Notification Sound
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(err => console.error("Audio play failed:", err));

            // Add to history
            setNotifications(prev => [{ ...data, timestamp: new Date(), read: false }, ...prev]);

            // Show toast (Manual dismissal required)
            toast.success((t) => (
                <div className="flex items-center justify-between w-full gap-4">
                    <div className="flex-1">
                        <p className="font-black text-xs uppercase tracking-wider text-blue-400 mb-1">New Booking</p>
                        <p>{data.patientName}</p>
                    </div>
                    <button 
                        onClick={() => toast.dismiss(t.id)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <i className="fa-solid fa-xmark text-xs opacity-50"></i>
                    </button>
                </div>
            ), {
                duration: Infinity, 
                icon: '📅',
                position: 'top-right',
                style: {
                    borderRadius: '20px',
                    background: '#1e293b',
                    color: '#fff',
                    fontWeight: 'bold',
                    border: '1px solid #334155',
                    padding: '8px 12px 12px 16px',
                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
                    minWidth: '320px'
                },
            });

            // Refresh list
            fetchAppointments();
        });

        return () => {
            socket.disconnect();
        };
    }, [fetchAppointments]);

    useEffect(() => {
        const today = new Date().toDateString();

        const safe = Array.isArray(appointments) ? appointments : [];
        setStats({
            total: safe.length,
            pending: safe.filter(a => a.status === "Pending").length,
            confirmed: safe.filter(a => a.status === "Confirmed").length,
            completed: safe.filter(a => a.status === "Completed").length,
            cancelled: safe.filter(a => a.status === "Cancelled").length,
            today: safe.filter(a => new Date(a.date).toDateString() === today).length,
        });
    }, [appointments]);

    const filteredAppointments = (appointments || []).filter(a => {
        if (statusFilter === "All") return true;
        if (statusFilter === "Today") return new Date(a.date).toDateString() === new Date().toDateString();
        return a.status === statusFilter;
    });

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.patch(`/appointments/${id}`, { status: newStatus });
            fetchAppointments();
            addToast(`Status updated to ${newStatus}`, "success");
        } catch { addToast("Error updating status", "error"); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this appointment?")) return;
        try {
            await api.delete(`/appointments/${id}`);
            fetchAppointments();
            addToast("Appointment deleted", "success");
        } catch { addToast("Error deleting appointment", "error"); }
    };

    const handleLogout = () => { localStorage.removeItem("token"); window.location.href = "/login"; };

    // ── Edit Appointment ──────────────────────────────────────────────────────
    const [editingAppointment, setEditingAppointment] = useState(null);
    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditingAppointment(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/appointments/${editingAppointment._id}`, editingAppointment);
            setEditingAppointment(null);
            fetchAppointments();
            addToast("Appointment updated!", "success");
        } catch { addToast("Error updating appointment", "error"); }
    };

    // ── Edit Patient ─────────────────────────────────────────────────────────
    const [editingPatient, setEditingPatient] = useState(null);
    const handlePatientUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            // Map 'name' back to 'patientName' for the backend
            const updatePayload = {
                ...editingPatient,
                patientName: editingPatient.name
            };
            await api.patch(`/appointments/patient/${editingPatient.originalPhone}`, updatePayload);
            setEditingPatient(null);
            fetchAppointments();
            addToast("Patient details updated globally!", "success");
        } catch { addToast("Error updating patient details", "error"); }
    };

    // ── Delete Patient ───────────────────────────────────────────────────────
    const [deletingPatient, setDeletingPatient] = useState(null);
    const handlePatientDelete = async () => {
        if (!deletingPatient) return;
        try {
            await api.delete(`/appointments/patient/${deletingPatient.phone}`);
            setDeletingPatient(null);
            fetchAppointments();
            addToast("All records for this patient have been deleted.", "success");
        } catch { addToast("Error deleting patient records", "error"); }
    };

    // ── View Appointment ──────────────────────────────────────────────────────
    // -- View Appointment --------------------------------------------------------
    const [viewAppointment, setViewAppointment] = useState(null);

    // -- Patient History ---------------------------------------------------------
    const [viewPatientHistory, setViewPatientHistory] = useState(null); // stores patient phone
    const patientHistory = viewPatientHistory ? (Array.isArray(appointments) ? appointments : []).filter(a => a.phone === viewPatientHistory).sort((a, b) => new Date(b.date) - new Date(a.date)) : [];

    // ── Create Appointment ────────────────────────────────────────────────────
    const blankAppt = { patientName: "", phone: "", age: "", gender: "Male", date: new Date().toISOString().split("T")[0], slot: "Morning (9AM–1PM)", problem: "", clinicVisit: true, videoConsultation: false, notes: "", whatsappNotify: false, status: "Pending" };
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newAppointment, setNewAppointment] = useState(blankAppt);
    const handleCreateChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewAppointment(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/appointments`, newAppointment);
            if (newAppointment.whatsappNotify) {
                const msg = encodeURIComponent(`*New Appointment*\n*Name:* ${newAppointment.patientName}\n*Phone:* ${newAppointment.phone}\n*Date:* ${newAppointment.date}\n*Slot:* ${newAppointment.slot}\n*Problem:* ${newAppointment.problem}`);
                window.open(`https://wa.me/918769556475?text=${msg}`, "_blank");
            }
            setIsCreateModalOpen(false);
            setNewAppointment(blankAppt);
            fetchAppointments();
            addToast("Appointment created!", "success");
        } catch { addToast("Error creating appointment", "error"); }
    };

    // ── Doctors ───────────────────────────────────────────────────────────────
    const [doctors, setDoctors] = useState([]);
    const [newDoctor, setNewDoctor] = useState({ name: "", qualification: "", specialty: "", designation: "", imageUrl: "" });
    const [doctorUploadType, setDoctorUploadType] = useState("url");
    const [doctorFile, setDoctorFile] = useState(null);
    const fetchDoctors = async () => { try { const r = await api.get(`/doctors`); setDoctors(Array.isArray(r.data) ? r.data : []); } catch { setDoctors([]); } };
    useEffect(() => { if (activeTab === "doctors") fetchDoctors(); }, [activeTab]);
    const handleDoctorSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        ["name", "qualification", "specialty", "designation"].forEach(k => fd.append(k, newDoctor[k]));
        if (doctorUploadType === "url") fd.append("imageUrl", newDoctor.imageUrl);
        else if (doctorFile) fd.append("image", doctorFile);
        try {
            await api.post(`/doctors`, fd, { headers: { "Content-Type": "multipart/form-data" } });
            setNewDoctor({ name: "", qualification: "", specialty: "", designation: "", imageUrl: "" });
            setDoctorFile(null);
            fetchDoctors();
            addToast("Doctor added!", "success");
        } catch { addToast("Error adding doctor", "error"); }
    };
    const handleDeleteDoctor = async (id) => {
        if (!window.confirm("Delete this doctor?")) return;
        try { await api.delete(`/doctors/${id}`); fetchDoctors(); addToast("Doctor deleted", "success"); }
        catch { addToast("Error deleting doctor", "error"); }
    };

    // ── Testimonials ──────────────────────────────────────────────────────────
    const [testimonials, setTestimonials] = useState([]);
    const [newTestimonial, setNewTestimonial] = useState({ name: "", location: "", message: "", rating: 5 });
    const fetchTestimonials = async () => { try { const r = await api.get(`/testimonials`); setTestimonials(Array.isArray(r.data) ? r.data : []); } catch { setTestimonials([]); } };
    useEffect(() => { if (activeTab === "testimonials") fetchTestimonials(); }, [activeTab]);
    const handleTestimonialSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/testimonials`, newTestimonial);
            setNewTestimonial({ name: "", location: "", message: "", rating: 5 });
            fetchTestimonials();
            addToast("Testimonial added!", "success");
        } catch { addToast("Error adding testimonial", "error"); }
    };
    const handleDeleteTestimonial = async (id) => {
        if (!window.confirm("Delete this testimonial?")) return;
        try { await api.delete(`/testimonials/${id}`); fetchTestimonials(); addToast("Deleted", "success"); }
        catch { addToast("Error", "error"); }
    };

    // ── Clinic Info ───────────────────────────────────────────────────────────
    const [clinicInfo, setClinicInfo] = useState({ phones: ["", ""], email: "", address: "", openingHours: { morning: "", evening: "", sunday: "" }, socialLinks: { facebook: "", instagram: "", twitter: "", whatsapp: "", google: "" }, automations: { birthday: true, medicine: true, followUp: true } });
    const [clinicInfoLoaded, setClinicInfoLoaded] = useState(false);
    const fetchClinicInfo = async () => { try { const r = await api.get(`/clinic-info`); if (r.data) { setClinicInfo(r.data); setClinicInfoLoaded(true); } } catch { } };
    useEffect(() => { if (activeTab === "settings" && !clinicInfoLoaded) fetchClinicInfo(); }, [activeTab]);

    const toggleAutomation = async (key) => {
        const updatedAutomations = { 
            ...(clinicInfo.automations || { birthday: true, medicine: true, followUp: true }), 
            [key]: !clinicInfo?.automations?.[key] 
        };
        const updatedInfo = { ...clinicInfo, automations: updatedAutomations };
        setClinicInfo(updatedInfo);
        try {
            await api.post(`/clinic-info`, updatedInfo);
            addToast(`${key.charAt(0).toUpperCase() + key.slice(1)} automation ${updatedAutomations[key] ? 'Enabled' : 'Disabled'}`, "success");
        } catch { addToast("Error updating automation", "error"); }
    };

    const handleClinicInfoSubmit = async (e) => {
        e.preventDefault();
        try { await api.post(`/clinic-info`, clinicInfo); addToast("Settings saved!", "success"); }
        catch { addToast("Error saving settings", "error"); }
    };

    // ── Banners ───────────────────────────────────────────────────────────────
    const [banners, setBanners] = useState([]);
    const [newBanner, setNewBanner] = useState({ image: "", title: "", subtitle: "" });
    const [uploadType, setUploadType] = useState("url");
    const [file, setFile] = useState(null);
    const fetchBanners = async () => { try { const r = await api.get(`/banners`); setBanners(Array.isArray(r.data) ? r.data : []); } catch { setBanners([]); } };
    useEffect(() => { if (activeTab === "banners") fetchBanners(); }, [activeTab]);
    const handleBannerSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append("title", newBanner.title);
        fd.append("subtitle", newBanner.subtitle);
        if (uploadType === "url") fd.append("imageUrl", newBanner.image);
        else if (file) fd.append("image", file);
        try {
            const res = await api.post(`/banners`, fd, { headers: { "Content-Type": "multipart/form-data" } });
            if (res.status === 201 || res.status === 200) {
                setNewBanner({ image: "", title: "", subtitle: "" }); setFile(null);
                fetchBanners(); addToast("Banner added successfully!", "success");
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Unknown Error";
            addToast(`Error adding banner: ${errorMsg}`, "error");
            console.error("Banner upload error:", err);
        }
    };
    const handleDeleteBanner = async (id) => {
        if (!window.confirm("Delete this banner?")) return;
        try { await api.delete(`/banners/${id}`); fetchBanners(); addToast("Banner deleted", "success"); }
        catch { addToast("Error", "error"); }
    };

    // ── Nav items ─────────────────────────────────────────────────────────────
    // Patient Stories state
    const [stories, setStories] = useState([]);
    const [editingStory, setEditingStory] = useState(null);
    const [viewingStory, setViewingStory] = useState(null);
    const [newStory, setNewStory] = useState({ patientName: "", age: "", location: "", condition: "", conditionHi: "", story: "", outcome: "", imageUrl: "", rating: 5, featured: false });
    const [storyUploadType, setStoryUploadType] = useState("url");
    const [storyFile, setStoryFile] = useState(null);
    const fetchStories = async () => { try { const r = await api.get(`/patient-stories`); setStories(Array.isArray(r.data) ? r.data : []); } catch { setStories([]); } };
    useEffect(() => { if (activeTab === "stories") fetchStories(); }, [activeTab]);
    const handleStorySubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        ["patientName", "age", "location", "condition", "conditionHi", "story", "outcome", "rating"].forEach(k => fd.append(k, newStory[k]));
        fd.append("featured", String(newStory.featured));
        if (storyUploadType === "url") fd.append("imageUrl", newStory.imageUrl);
        else if (storyFile) fd.append("image", storyFile);
        try {
            if (editingStory) {
                await updatePatientStory(editingStory._id, fd);
                addToast("Story updated!", "success");
            } else {
                await api.post(`/patient-stories`, fd, { headers: { "Content-Type": "multipart/form-data" } });
                addToast("Story added!", "success");
            }
            setNewStory({ patientName: "", age: "", location: "", condition: "", conditionHi: "", story: "", outcome: "", imageUrl: "", rating: 5, featured: false });
            setEditingStory(null);
            setStoryFile(null); 
            fetchStories();
        } catch { addToast("Error saving story", "error"); }
    };
    const handleEditStory = (story) => {
        setEditingStory(story);
        setNewStory({
            patientName: story.patientName || "",
            age: story.age || "",
            location: story.location || "",
            condition: story.condition || "",
            conditionHi: story.conditionHi || "",
            story: story.story || "",
            outcome: story.outcome || "",
            imageUrl: story.image || "",
            rating: story.rating || 5,
            featured: story.featured || false
        });
        setStoryUploadType("url");
        // Scroll to form
        const formElement = document.getElementById("story-form");
        if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
    };
    const handleDeleteStory = async (id) => {
        if (!window.confirm("Delete this story?")) return;
        try { await api.delete(`/patient-stories/${id}`); fetchStories(); addToast("Story deleted", "success"); }
        catch { addToast("Error", "error"); }
    };

    // Clinic Posters state
    const [posters, setPosters] = useState([]);
    const [newPoster, setNewPoster] = useState({ title: "", description: "", category: "General", imageUrl: "" });
    const [posterUploadType, setPosterUploadType] = useState("file");
    const [posterFile, setPosterFile] = useState(null);
    const POSTER_CATS = ["General", "Awareness", "Services", "Events", "Health Tips", "Offers"];
    const fetchPosters = async () => { try { const r = await api.get(`/clinic-posters`); setPosters(Array.isArray(r.data) ? r.data : []); } catch { setPosters([]); } };
    useEffect(() => { if (activeTab === "posters") fetchPosters(); }, [activeTab]);
    const handlePosterSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (posterUploadType === "file" && !posterFile) {
            addToast("Please select a file to upload", "error");
            return;
        }
        if (posterUploadType === "url" && !newPoster.imageUrl) {
            addToast("Please enter an image URL", "error");
            return;
        }

        const fd = new FormData();
        ["title", "description", "category"].forEach(k => fd.append(k, newPoster[k]));
        if (posterUploadType === "url") fd.append("imageUrl", newPoster.imageUrl);
        else if (posterFile) fd.append("image", posterFile);
        try {
            await api.post(`/clinic-posters`, fd, { headers: { "Content-Type": "multipart/form-data" } });
            setNewPoster({ title: "", description: "", category: "General", imageUrl: "" });
            setPosterFile(null); fetchPosters(); addToast("Poster uploaded!", "success");
        } catch { addToast("Error uploading poster", "error"); }
    };
    const handleDeletePoster = async (id) => {
        if (!window.confirm("Delete this poster?")) return;
        try { await api.delete(`/clinic-posters/${id}`); fetchPosters(); addToast("Poster deleted", "success"); }
        catch { addToast("Error", "error"); }
    };

    // ── Gallery Images ────────────────────────────────────────────────────────
    const [galleryImages, setGalleryImages] = useState([]);
    const [newGalleryImage, setNewGalleryImage] = useState({ title: "", category: "Clinic", imageUrl: "" });
    const [galleryUploadType, setGalleryUploadType] = useState("file");
    const [galleryFile, setGalleryFile] = useState(null);
    const GALLERY_CATS = ["Clinic", "Therapy", "Equipment"];
    
    const fetchGalleryImages = async () => {
        try {
            const r = await api.get(`/gallery`);
            setGalleryImages(Array.isArray(r.data) ? r.data : []);
        } catch { setGalleryImages([]); }
    };
    useEffect(() => { if (activeTab === "gallery") fetchGalleryImages(); }, [activeTab]);

    const handleGallerySubmit = async (e) => {
        e.preventDefault();
        if (galleryUploadType === "file" && !galleryFile) return addToast("Please select a file", "error");
        if (galleryUploadType === "url" && !newGalleryImage.imageUrl) return addToast("Please enter an image URL", "error");

        const fd = new FormData();
        ["title", "category"].forEach(k => fd.append(k, newGalleryImage[k]));
        if (galleryUploadType === "url") fd.append("imageUrl", newGalleryImage.imageUrl);
        else if (galleryFile) fd.append("image", galleryFile);
        
        try {
            await api.post(`/gallery`, fd, { headers: { "Content-Type": "multipart/form-data" } });
            setNewGalleryImage({ title: "", category: "Clinic", imageUrl: "" });
            setGalleryFile(null);
            fetchGalleryImages();
            addToast("Gallery Image uploaded!", "success");
        } catch { addToast("Error uploading gallery image", "error"); }
    };

    const handleDeleteGalleryImage = async (id) => {
        if (!window.confirm("Delete this image?")) return;
        try {
            await api.delete(`/gallery/${id}`);
            fetchGalleryImages();
            addToast("Image deleted", "success");
        } catch { addToast("Error", "error"); }
    };

    // ── Videos Management ──────────────────────────────────────────────────
    const [videos, setVideos] = useState([]);
    const [newVideo, setNewVideo] = useState({ title: "", videoUrl: "", category: "General" });
    const fetchVideos = async () => {
        try {
            const r = await api.get(`/videos`);
            setVideos(Array.isArray(r.data) ? r.data : []);
        } catch { setVideos([]); }
    };
    useEffect(() => { if (activeTab === "videos") fetchVideos(); }, [activeTab]);

    const handleVideoSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/videos`, newVideo);
            setNewVideo({ title: "", videoUrl: "", category: "General" });
            fetchVideos();
            addToast("Video added successfully!", "success");
        } catch { addToast("Error adding video", "error"); }
    };

    const handleDeleteVideo = async (id) => {
        if (!window.confirm("Delete this video?")) return;
        try {
            await api.delete(`/videos/${id}`);
            fetchVideos();
            addToast("Video deleted", "success");
        } catch { addToast("Error", "error"); }
    };

    // ── Contact Messages ────────────────────────────────────────────────────────
    const [messages, setMessages] = useState([]);
    const fetchMessages = async () => {
        try {
            const r = await api.get(`/contacts`);
            setMessages(Array.isArray(r.data) ? r.data : []);
        } catch { setMessages([]); }
    };
    // Fetch once on load to get the unread count for badge
    useEffect(() => { fetchMessages(); }, []);
    // Re-fetch when tab is opened
    useEffect(() => { if (activeTab === "messages") fetchMessages(); }, [activeTab]);

    const handleDeleteMessage = async (id) => {
        if (!window.confirm("Delete this message?")) return;
        try {
            await api.delete(`/contacts/${id}`);
            fetchMessages();
            addToast("Message deleted", "success");
        } catch { addToast("Error", "error"); }
    };

    const handleMarkRead = async (id) => {
        try {
            await api.patch(`/contacts/${id}/read`);
            fetchMessages();
            addToast("Marked as read", "success");
        } catch { addToast("Error", "error"); }
    };


    // ── Services ──────────────────────────────────────────────────────────────
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({ title: "", titleHi: "", id: "", icon: "fa-stethoscope", tagline: "", desc: "", content: "" });
    const [serviceUploadType, setServiceUploadType] = useState("url");
    const [serviceFile, setServiceFile] = useState(null);
    const [editingService, setEditingService] = useState(null);

    const fetchServices = async () => { try { const r = await api.get(`/services`); setServices(Array.isArray(r.data) ? r.data : []); } catch { setServices([]); } };
    useEffect(() => { if (activeTab === "services") fetchServices(); }, [activeTab]);

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        ["title", "titleHi", "id", "icon", "tagline", "desc", "content"].forEach(k => fd.append(k, editingService ? editingService[k] : newService[k]));
        if (serviceUploadType === "url") fd.append("imageUrl", editingService ? editingService.image : newService.imageUrl);
        else if (serviceFile) fd.append("image", serviceFile);

        try {
            if (editingService) {
                await updateService(editingService._id, fd);
                addToast("Service updated!", "success");
            } else {
                await postService(fd);
                addToast("Service added!", "success");
            }
            setNewService({ title: "", titleHi: "", id: "", icon: "fa-stethoscope", tagline: "", desc: "", content: "" });
            setEditingService(null);
            setServiceFile(null);
            fetchServices();
        } catch { addToast("Error saving service", "error"); }
    };

    const handleDeleteService = async (id) => {
        if (!window.confirm("Delete this service?")) return;
        try { await deleteService(id); fetchServices(); addToast("Service deleted", "success"); }
        catch { addToast("Error deleting service", "error"); }
    };

    // ── Exercises ─────────────────────────────────────────────────────────────
    const [exercises, setExercises] = useState([]);
    const [newExercise, setNewExercise] = useState({ title: "", hindi: "", id: "", icon: "fa-person-running" });
    const [exerciseUploadType, setExerciseUploadType] = useState("url");
    const [exerciseFile, setExerciseFile] = useState(null);
    const [editingExercise, setEditingExercise] = useState(null);

    const fetchExercises = async () => { try { const r = await api.get(`/exercises`); setExercises(Array.isArray(r.data) ? r.data : []); } catch { setExercises([]); } };
    useEffect(() => { if (activeTab === "exercises") fetchExercises(); }, [activeTab]);

    const handleExerciseSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        ["title", "hindi", "id", "icon"].forEach(k => fd.append(k, editingExercise ? editingExercise[k] : newExercise[k]));
        if (exerciseUploadType === "url") fd.append("imageUrl", editingExercise ? editingExercise.image : newExercise.imageUrl);
        else if (exerciseFile) fd.append("image", exerciseFile);

        try {
            if (editingExercise) {
                await updateExercise(editingExercise._id, fd);
                addToast("Exercise updated!", "success");
            } else {
                await postExercise(fd);
                addToast("Exercise added!", "success");
            }
            setNewExercise({ title: "", hindi: "", id: "", icon: "fa-person-running" });
            setEditingExercise(null);
            setExerciseFile(null);
            fetchExercises();
        } catch { addToast("Error saving exercise", "error"); }
    };

    const handleDeleteExercise = async (id) => {
        if (!window.confirm("Delete this exercise?")) return;
        try { await deleteExercise(id); fetchExercises(); addToast("Exercise deleted", "success"); }
        catch { addToast("Error deleting exercise", "error"); }
    };

    const unreadMessagesCount = messages.filter(m => m.status === 'Unread').length;



    const navItems = [
        { id: "appointments", icon: "fa-calendar-check", label: "Appointments", badge: stats.pending > 0 ? stats.pending : null },
        { id: "patients", icon: "fa-users", label: "Patients" },
        { id: "messages", icon: "fa-envelope", label: "Messages", badge: unreadMessagesCount > 0 ? unreadMessagesCount : null },
        { id: "services", icon: "fa-stethoscope", label: "Services" },
        { id: "exercises", icon: "fa-person-running", label: "Exercises" },
        { id: "reports", icon: "fa-chart-pie", label: "Reports" },
        { id: "stories", icon: "fa-heart-pulse", label: "Patient Stories" },
        { id: "gallery", icon: "fa-photo-film", label: "Gallery" },
        { id: "videos", icon: "fa-circle-play", label: "Videos" },
        { id: "posters", icon: "fa-image", label: "Blogs" },
        { id: "banners", icon: "fa-images", label: "Banners" },
        { id: "doctors", icon: "fa-user-doctor", label: "Doctors" },
        { id: "testimonials", icon: "fa-star", label: "Testimonials" },
        { id: "settings", icon: "fa-gear", label: "Settings" },
    ];

    // ── Unique patients derived from appointments ──────────────────────────────
    const uniquePatients = Object.values(
        (Array.isArray(appointments) ? appointments : []).reduce((acc, a) => {
            if (!acc[a.phone]) acc[a.phone] = { name: a.patientName, phone: a.phone, gender: a.gender, age: a.age, visits: 0, lastVisit: a.date, statuses: [] };
            acc[a.phone].visits++;
            acc[a.phone].statuses.push(a.status);
            if (new Date(a.date) > new Date(acc[a.phone].lastVisit)) acc[a.phone].lastVisit = a.date;
            return acc;
        }, {})
    );

    // ── Live clock ────────────────────────────────────────────────────────────
    const [clock, setClock] = useState(new Date());
    useEffect(() => { const t = setInterval(() => setClock(new Date()), 1000); return () => clearInterval(t); }, []);

    const statusColor = (s) => {
        switch (s) {
            case "Confirmed": return "bg-emerald-50 text-emerald-600 border border-emerald-100";
            case "Pending": return "bg-amber-50 text-amber-600 border border-amber-100";
            case "Completed": return "bg-blue-50 text-blue-600 border border-blue-100";
            case "Cancelled": return "bg-rose-50 text-rose-600 border border-rose-100";
            default: return "bg-slate-50 text-slate-600 border border-slate-100";
        }
    };

    return (
        <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
            <Toast toasts={toasts} removeToast={removeToast} />

            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm transition-opacity"></div>
            )}

            {/* ── Sidebar ── */}
            <aside className={`w-64 flex-shrink-0 bg-[#0f172a] text-white flex flex-col shadow-2xl z-40 fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} border-r border-slate-800`}>
                <div className="p-5 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-full bg-white border-2 border-blue-500/50 shadow-lg shrink-0 overflow-hidden flex items-center justify-center">
                            <img src={logo} alt="RK" className="w-10 h-10 object-contain" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-white leading-tight">RK The Complete Care</p>
                            <p className="text-[10px] font-black text-blue-500 leading-tight">MANAGEMENT</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group ${activeTab === item.id
                                ? "bg-blue-600 text-white"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <i className={`fa-solid ${item.icon} w-4 text-center ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}></i>
                            <span>{item.label}</span>
                            {item.badge && (
                                <span className="ml-auto bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{item.badge}</span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-3 py-2 mb-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black text-white">A</div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">Administrator</p>
                            <p className="text-[10px] text-slate-500">Super Admin</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:bg-rose-500 hover:text-white transition-all text-xs font-bold">
                        <i className="fa-solid fa-right-from-bracket w-4"></i> Logout
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between flex-shrink-0 shadow-sm z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-500 hover:text-blue-600 transition-colors p-2 -ml-2">
                            <i className="fa-solid fa-bars text-xl"></i>
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 capitalize">{activeTab === "appointments" ? "Dashboard" : activeTab}</h1>
                            <p className="text-xs text-slate-400 font-medium hidden sm:block">{clock.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-2xl font-black text-blue-600 tabular-nums">{clock.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                        
                        {/* 🔔 Notification Bell */}
                        <div className="relative" ref={notificationRef}>
                            <button 
                                onClick={() => {
                                    setShowNotifications(!showNotifications);
                                    if (!showNotifications) {
                                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                                    }
                                }}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative ${showNotifications ? "bg-blue-600 text-white shadow-lg" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                            >
                                <i className="fa-solid fa-bell"></i>
                                {notifications.filter(n => !n.read).length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                                        {notifications.filter(n => !n.read).length}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[100]"
                                    >
                                        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                            <h4 className="font-black text-slate-800 text-sm uppercase tracking-wide">Recent Bookings</h4>
                                            <button onClick={() => setNotifications([])} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase">Clear All</button>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map((n, i) => (
                                                    <div key={i} className="p-4 border-b border-slate-50 hover:bg-blue-50/50 transition-colors cursor-default">
                                                        <div className="flex gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-black text-xs uppercase">
                                                                {n.patientName?.charAt(0)}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-bold text-slate-800 truncate">{n.patientName}</p>
                                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{n.slot} &bull; {new Date(n.date).toLocaleDateString()}</p>
                                                                <p className="text-[10px] text-blue-600 font-black mt-1 uppercase">New Appointment Received</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-slate-400">
                                                    <i className="fa-solid fa-bell-slash text-2xl mb-2 opacity-20"></i>
                                                    <p className="text-xs font-bold">No new notifications</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {activeTab === "appointments" && (
                            <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all">
                                <i className="fa-solid fa-plus"></i> New Appointment
                            </button>
                        )}
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">

                    {/* ── Stats Row ── */}
                    {
                        activeTab === "appointments" && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                                <StatCard title="Total" value={stats.total} icon="fa-calendar-days" color="blue" onClick={() => setStatusFilter('All')} isActive={statusFilter === 'All'} />
                                <StatCard title="Pending" value={stats.pending} icon="fa-clock" color="amber" onClick={() => setStatusFilter('Pending')} isActive={statusFilter === 'Pending'} />
                                <StatCard title="Confirmed" value={stats.confirmed} icon="fa-check-circle" color="emerald" onClick={() => setStatusFilter('Confirmed')} isActive={statusFilter === 'Confirmed'} />
                                <StatCard title="Completed" value={stats.completed} icon="fa-flag-checkered" color="blue" onClick={() => setStatusFilter('Completed')} isActive={statusFilter === 'Completed'} />
                                <StatCard title="Cancelled" value={stats.cancelled} icon="fa-ban" color="rose" onClick={() => setStatusFilter('Cancelled')} isActive={statusFilter === 'Cancelled'} />
                                <StatCard title="Today" value={stats.today} icon="fa-user-clock" color="emerald" sub="Live" onClick={() => setStatusFilter('Today')} isActive={statusFilter === 'Today'} />
                            </div>
                        )
                    }

                    {/* ── Appointments Tab ── */}
                    {
                        activeTab === "appointments" && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                {/* Table toolbar */}
                                <div className="p-5 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">
                                    <div className="flex gap-2 flex-wrap">
                                        {["All", "Pending", "Confirmed", "Completed", "Cancelled", "Today"].map(s => (
                                            <button key={s} onClick={() => setStatusFilter(s)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === s ? "bg-blue-600 text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                        <input type="text" placeholder="Search patient, phone..." value={search} onChange={e => setSearch(e.target.value)}
                                            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[rgba(13, 148, 136,0.30)] text-sm w-64 transition-all" />
                                        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><i className="fa-solid fa-xmark text-xs"></i></button>}
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="w-10 h-10 border-4 border-blue-100/50 border-t-indigo-600 rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-5 py-4 border-b border-slate-100">ID</th>
                                                    <th className="px-5 py-4 border-b border-slate-100">Patient</th>
                                                    <th className="px-5 py-4 border-b border-slate-100">Date & Slot</th>
                                                    <th className="px-5 py-4 border-b border-slate-100">Problem</th>
                                                    <th className="px-5 py-4 border-b border-slate-100">Status</th>
                                                    <th className="px-5 py-4 border-b border-slate-100 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {filteredAppointments.map(app => (
                                                    <motion.tr key={app._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-blue-50/30 transition-colors group">
                                                        <td className="px-5 py-4">
                                                            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">{app.appointmentId || "—"}</span>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm flex-shrink-0">
                                                                    {app.patientName?.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-slate-800 text-sm">{app.patientName}</p>
                                                                    <p className="text-xs text-slate-400">{app.age}y &bull; {app.gender} &bull; {app.phone}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <p className="text-sm font-semibold text-slate-700">{new Date(app.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                                                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">{app.slot}</span>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <p className="text-sm text-slate-600 max-w-[160px] truncate" title={app.problem}>{app.problem}</p>
                                                            {app.clinicVisit && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold mt-1 inline-block mr-1"><i className="fa-solid fa-stethoscope mr-1"></i>Clinic Visit</span>}
                                                            {app.videoConsultation && <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-bold mt-1 inline-block"><i className="fa-solid fa-video mr-1"></i>Video Consult</span>}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <select value={app.status} onChange={e => handleStatusUpdate(app._id, e.target.value)}
                                                                className={`text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer border-0 focus:outline-none focus:ring-2 ring-offset-1 ${statusColor(app.status)}`}>
                                                                <option value="Pending">Pending</option>
                                                                <option value="Confirmed">Confirmed</option>
                                                                <option value="Completed">Completed</option>
                                                                <option value="Cancelled">Cancelled</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="flex justify-end gap-1.5">
                                                                <button onClick={() => {
                                                                    const msg = encodeURIComponent(`Hello ${app.patientName},\nYour appointment on ${new Date(app.date).toLocaleDateString("en-IN")} at ${app.slot} is confirmed.\n\nRegards,\nRK - The Complete Care Physiotherapy Centre`);
                                                                    window.open(`https://wa.me/91${app.phone}?text=${msg}`, "_blank");
                                                                }} className="w-8 h-8 rounded-lg bg-[rgba(74,138,104,0.10)] text-[#4a8a68] hover:bg-[rgba(74,138,104,0.10)] flex items-center justify-center transition-all" title="WhatsApp Confirm"><i className="fa-brands fa-whatsapp text-xs"></i></button>
                                                                <button onClick={() => setViewAppointment(app)} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-all" title="View"><i className="fa-solid fa-eye text-xs"></i></button>
                                                                <button onClick={() => setEditingAppointment({ ...app })} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-all" title="Edit"><i className="fa-solid fa-pen text-xs"></i></button>
                                                                <button onClick={() => handleDelete(app._id)} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-all" title="Delete"><i className="fa-solid fa-trash text-xs"></i></button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))}
                                                {filteredAppointments.length === 0 && (
                                                    <tr><td colSpan="6" className="py-16 text-center text-slate-400">
                                                        <i className="fa-regular fa-calendar-xmark text-4xl mb-3 block opacity-40"></i>
                                                        <p className="font-semibold">No appointments found</p>
                                                    </td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )
                    }

                    {/* ── Patients Tab ── */}
                    {
                        activeTab === "patients" && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                    <h2 className="font-black text-slate-800">Patient Directory <span className="ml-2 text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{uniquePatients.length}</span></h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                            <tr>
                                                <th className="px-5 py-4 border-b border-slate-100">Patient</th>
                                                <th className="px-5 py-4 border-b border-slate-100">Phone</th>
                                                <th className="px-5 py-4 border-b border-slate-100">Age / Gender</th>
                                                <th className="px-5 py-4 border-b border-slate-100">Total Visits</th>
                                                <th className="px-5 py-4 border-b border-slate-100">Last Visit</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {uniquePatients.map((p, i) => (
                                                <tr key={p.phone} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm">{p.name?.charAt(0)}</div>
                                                            <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-sm text-slate-600 font-mono">{p.phone}</td>
                                                    <td className="px-5 py-4 text-sm text-slate-600">{p.age}y &bull; {p.gender}</td>
                                                    <td className="px-5 py-4">
                                                        <span className="bg-blue-50 text-blue-600 text-xs font-black px-3 py-1 rounded-full">{p.visits} visit{p.visits !== 1 ? "s" : ""}</span>
                                                    </td>
                                                    <td className="px-5 py-4 text-sm text-slate-500">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span>{new Date(p.lastVisit).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                                                            <div className="flex gap-1 ml-4">
                                                                <button onClick={() => setEditingPatient({ ...p, originalPhone: p.phone })} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-all" title="Edit Details">
                                                                    <i className="fa-solid fa-pen text-[10px]"></i>
                                                                </button>
                                                                <button onClick={() => setViewPatientHistory(p.phone)} className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all">
                                                                    <i className="fa-solid fa-clock-rotate-left mr-1.5"></i>History
                                                                </button>
                                                                <button onClick={() => setDeletingPatient(p)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-all" title="Delete Patient">
                                                                    <i className="fa-solid fa-trash text-[10px]"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {uniquePatients.length === 0 && (
                                                <tr><td colSpan="5" className="py-16 text-center text-slate-400">
                                                    <i className="fa-solid fa-users text-4xl mb-3 block opacity-30"></i>
                                                    <p className="font-semibold">No patients yet. Appointments will appear here.</p>
                                                </td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    }

                    {/* ── Messages Tab ── */}
                    {
                        activeTab === "messages" && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                    <h2 className="font-black text-slate-800">Messages <span className="ml-2 text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{messages.length}</span></h2>
                                    <button onClick={fetchMessages} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
                                        <i className="fa-solid fa-rotate-right mr-1.5"></i> Refresh
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                            <tr>
                                                <th className="px-5 py-4 border-b border-slate-100 w-1/4">Sender Details</th>
                                                <th className="px-5 py-4 border-b border-slate-100 w-[15%]">Topic</th>
                                                <th className="px-5 py-4 border-b border-slate-100 w-[40%]">Message</th>
                                                <th className="px-5 py-4 border-b border-slate-100 w-[10%]">Status</th>
                                                <th className="px-5 py-4 border-b border-slate-100 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {messages.map((m) => (
                                                <tr key={m._id} className={`hover:bg-slate-50 transition-colors ${m.status === 'Unread' ? 'bg-blue-50/20' : ''}`}>
                                                    <td className="px-5 py-4">
                                                        <p className="font-bold text-slate-800 text-sm mb-1">{m.name}</p>
                                                        <p className="text-xs text-slate-500 mb-0.5"><i className="fa-solid fa-phone text-[10px] mr-1.5 text-slate-400"></i>{m.phone}</p>
                                                        <p className="text-xs text-slate-500"><i className="fa-solid fa-envelope text-[10px] mr-1.5 text-slate-400"></i>{m.email}</p>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <span className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">{m.topic}</span>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <p className="text-sm text-slate-600 leading-relaxed max-h-20 overflow-y-auto pr-2 custom-scrollbar">{m.message}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium mt-2">{new Date(m.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        {m.status === 'Unread' ? (
                                                            <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold px-2.5 py-1 rounded-full"><i className="fa-solid fa-circle text-[8px] mr-1.5"></i>Unread</span>
                                                        ) : (
                                                            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold px-2.5 py-1 rounded-full"><i className="fa-solid fa-check text-[8px] mr-1.5"></i>Read</span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <div className="flex justify-end gap-1.5">
                                                            {m.status === 'Unread' && (
                                                                <button onClick={() => handleMarkRead(m._id)} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-all" title="Mark as Read">
                                                                    <i className="fa-solid fa-check text-xs"></i>
                                                                </button>
                                                            )}
                                                            <a href={`mailto:${m.email}`} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-all" title="Reply via Email">
                                                                <i className="fa-solid fa-reply text-xs"></i>
                                                            </a>
                                                            <button onClick={() => handleDeleteMessage(m._id)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-all" title="Delete Message">
                                                                <i className="fa-solid fa-trash text-[10px]"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {messages.length === 0 && (
                                                <tr><td colSpan="5" className="py-16 text-center text-slate-400">
                                                    <i className="fa-solid fa-inbox text-4xl mb-3 block opacity-30"></i>
                                                    <p className="font-semibold">No messages yet. They will appear here when submitted.</p>
                                                </td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    }

                    {/* ── Services Tab ── */}
                    {
                        activeTab === "services" && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                    <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                                        <i className="fa-solid fa-plus-circle text-blue-600"></i>
                                        {editingService ? "Edit Service" : "Add New Service"}
                                    </h2>
                                    <form onSubmit={handleServiceSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title (English)</label>
                                            <input type="text" placeholder="Neck Pain" value={editingService ? editingService.title : newService.title} onChange={e => editingService ? setEditingService({ ...editingService, title: e.target.value }) : setNewService({ ...newService, title: e.target.value })} className={inp} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title (Hindi)</label>
                                            <input type="text" placeholder="गर्दन का दर्द" value={editingService ? editingService.titleHi : newService.titleHi} onChange={e => editingService ? setEditingService({ ...editingService, titleHi: e.target.value }) : setNewService({ ...newService, titleHi: e.target.value })} className={inp} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slug/ID (URL)</label>
                                            <input type="text" placeholder="neck-pain" value={editingService ? editingService.id : newService.id} onChange={e => editingService ? setEditingService({ ...editingService, id: e.target.value }) : setNewService({ ...newService, id: e.target.value })} className={inp} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">FontAwesome Icon</label>
                                            <input type="text" placeholder="fa-user-doctor" value={editingService ? editingService.icon : newService.icon} onChange={e => editingService ? setEditingService({ ...editingService, icon: e.target.value }) : setNewService({ ...newService, icon: e.target.value })} className={inp} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tagline</label>
                                            <input type="text" placeholder="Cervical Spondylosis" value={editingService ? editingService.tagline : newService.tagline} onChange={e => editingService ? setEditingService({ ...editingService, tagline: e.target.value }) : setNewService({ ...newService, tagline: e.target.value })} className={inp} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Short Desc (Grid)</label>
                                            <input type="text" placeholder="Relieve chronic neck stiffness..." value={editingService ? editingService.desc : newService.desc} onChange={e => editingService ? setEditingService({ ...editingService, desc: e.target.value }) : setNewService({ ...newService, desc: e.target.value })} className={inp} required />
                                        </div>
                                        <div className="md:col-span-2 lg:col-span-3 space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Details Content (Paragraphs)</label>
                                            <textarea rows="4" placeholder="Enter service details. Use new lines for separate paragraphs." value={editingService ? (Array.isArray(editingService.content) ? editingService.content.join('\n') : editingService.content) : (Array.isArray(newService.content) ? newService.content.join('\n') : newService.content)} onChange={e => {
                                                const lines = e.target.value.split('\n');
                                                editingService ? setEditingService({ ...editingService, content: lines }) : setNewService({ ...newService, content: lines })
                                            }} className={inp} required></textarea>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image Upload</label>
                                            <div className="flex gap-2">
                                                <select value={serviceUploadType} onChange={e => setServiceUploadType(e.target.value)} className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none">
                                                    <option value="url">URL</option>
                                                    <option value="file">File</option>
                                                </select>
                                                {serviceUploadType === "url" ? (
                                                    <input type="text" placeholder="Image URL" value={editingService ? editingService.image : newService.imageUrl} onChange={e => editingService ? setEditingService({ ...editingService, image: e.target.value }) : setNewService({ ...newService, imageUrl: e.target.value })} className={inp} />
                                                ) : (
                                                    <input type="file" onChange={e => setServiceFile(e.target.files[0])} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 mt-4">
                                            {editingService && (
                                                <button type="button" onClick={() => { setEditingService(null); setServiceFile(null); }} className="px-6 py-2.5 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-100 transition-all">Cancel</button>
                                            )}
                                            <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all">
                                                {editingService ? "Update Service" : "Add Service"}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="p-5 border-b border-slate-100">
                                        <h2 className="font-black text-slate-800">Current Services <span className="ml-2 text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{services.length}</span></h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
                                        {services.map(s => (
                                            <div key={s._id} className="group relative bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
                                                <div className="h-32 relative">
                                                    <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                                    <div className="absolute bottom-2 left-3">
                                                        <p className="text-white font-black text-sm">{s.title} ({s.titleHi})</p>
                                                        <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest">{s.id}</p>
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{s.desc}</p>
                                                    <div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3">
                                                        <button onClick={() => { setEditingService({ ...s }); setServiceUploadType("url"); }} className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-100 text-slate-500 hover:text-blue-600 flex items-center justify-center transition-all"><i className="fa-solid fa-pen text-xs"></i></button>
                                                        <button onClick={() => handleDeleteService(s._id)} className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-100 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-all"><i className="fa-solid fa-trash text-xs"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* ── Exercises Tab ── */}
                    {
                        activeTab === "exercises" && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                    <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                                        <i className="fa-solid fa-plus-circle text-emerald-600"></i>
                                        {editingExercise ? "Edit Exercise" : "Add New Exercise"}
                                    </h2>
                                    <form onSubmit={handleExerciseSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                                            <input type="text" placeholder="Neck Stretch" value={editingExercise ? editingExercise.title : newExercise.title} onChange={e => editingExercise ? setEditingExercise({ ...editingExercise, title: e.target.value }) : setNewExercise({ ...newExercise, title: e.target.value })} className={inp} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hindi Label</label>
                                            <input type="text" placeholder="(गर्दन का व्यायाम)" value={editingExercise ? editingExercise.hindi : newExercise.hindi} onChange={e => editingExercise ? setEditingExercise({ ...editingExercise, hindi: e.target.value }) : setNewExercise({ ...newExercise, hindi: e.target.value })} className={inp} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Slug/ID</label>
                                            <input type="text" placeholder="neck-stretch" value={editingExercise ? editingExercise.id : newExercise.id} onChange={e => editingExercise ? setEditingExercise({ ...editingExercise, id: e.target.value }) : setNewExercise({ ...newExercise, id: e.target.value })} className={inp} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">FontAwesome Icon</label>
                                            <input type="text" placeholder="fa-person-running" value={editingExercise ? editingExercise.icon : newExercise.icon} onChange={e => editingExercise ? setEditingExercise({ ...editingExercise, icon: e.target.value }) : setNewExercise({ ...newExercise, icon: e.target.value })} className={inp} required />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image Upload</label>
                                            {/* Current image preview when editing */}
                                            {editingExercise && editingExercise.image && (
                                                <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-emerald-200 mb-2">
                                                    <img src={editingExercise.image} alt="Current" className="w-full h-full object-cover" />
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm px-3 py-1.5">
                                                        <p className="text-white text-[9px] font-black uppercase tracking-widest">Current Image</p>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <select value={exerciseUploadType} onChange={e => setExerciseUploadType(e.target.value)} className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none">
                                                    <option value="url">URL</option>
                                                    <option value="file">File</option>
                                                </select>
                                                {exerciseUploadType === "url" ? (
                                                    <input type="text" placeholder="Image URL" value={editingExercise ? editingExercise.image : newExercise.imageUrl} onChange={e => editingExercise ? setEditingExercise({ ...editingExercise, image: e.target.value }) : setNewExercise({ ...newExercise, imageUrl: e.target.value })} className={inp} />
                                                ) : (
                                                    <input type="file" onChange={e => setExerciseFile(e.target.files[0])} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 mt-4">
                                            {editingExercise && (
                                                <button type="button" onClick={() => { setEditingExercise(null); setExerciseFile(null); }} className="px-6 py-2.5 rounded-xl text-slate-500 font-bold text-sm hover:bg-slate-100 transition-all">Cancel</button>
                                            )}
                                            <button type="submit" className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-emerald-700 transition-all">
                                                {editingExercise ? "Update Exercise" : "Add Exercise"}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="p-5 border-b border-slate-100">
                                        <h2 className="font-black text-slate-800">Current Exercises <span className="ml-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{exercises.length}</span></h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
                                        {exercises.map(ex => (
                                            <div key={ex._id} className="group relative bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
                                                <div className="h-32 relative">
                                                    <img src={ex.image} alt={ex.title} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                                    <div className="absolute bottom-2 left-3">
                                                        <p className="text-white font-black text-sm">{ex.title} ({ex.hindi})</p>
                                                        <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest">{ex.id}</p>
                                                    </div>
                                                </div>
                                                <div className="p-3">
                                                    <div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3">
                                                        <button onClick={() => { setEditingExercise({ ...ex }); setExerciseUploadType("url"); }} className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-100 text-slate-500 hover:text-emerald-600 flex items-center justify-center transition-all"><i className="fa-solid fa-pen text-xs"></i></button>
                                                        <button onClick={() => handleDeleteExercise(ex._id)} className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-100 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-all"><i className="fa-solid fa-trash text-xs"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    }



                    {/* ── Reports Tab ── */}
                    {
                        activeTab === "reports" && (
                            <div className="space-y-6">
                                {/* Summary cards */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { label: "Total Appointments", value: stats.total, color: "text-blue-600", bg: "bg-blue-50" },
                                        { label: "Completion Rate", value: stats.total ? `${Math.round((stats.completed / stats.total) * 100)}%` : "0%", color: "text-emerald-600", bg: "bg-emerald-50" },
                                        { label: "Pending Rate", value: stats.total ? `${Math.round((stats.pending / stats.total) * 100)}%` : "0%", color: "text-amber-600", bg: "bg-amber-50" },
                                        { label: "Unique Patients", value: uniquePatients.length, color: "text-blue-600", bg: "bg-blue-50" },
                                    ].map(c => (
                                        <div key={c.label} className={`${c.bg} rounded-2xl p-5 border border-white/10`}>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{c.label}</p>
                                            <p className={`text-3xl font-black ${c.color}`}>{c.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Status breakdown */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                        <h3 className="font-black text-slate-800 mb-6">Appointment Status Breakdown</h3>
                                        <div className="space-y-4">
                                            {[
                                                { label: "Confirmed", count: stats.confirmed, color: "bg-emerald-500", light: "bg-emerald-50" },
                                                { label: "Pending", count: stats.pending, color: "bg-amber-500", light: "bg-amber-50" },
                                                { label: "Completed", count: stats.completed, color: "bg-blue-600", light: "bg-blue-50" },
                                                { label: "Cancelled", count: stats.cancelled, color: "bg-rose-500", light: "bg-rose-50" },
                                            ].map(row => (
                                                <div key={row.label}>
                                                    <div className="flex justify-between text-sm font-semibold text-slate-700 mb-1.5">
                                                        <span>{row.label}</span>
                                                        <span>{row.count} ({stats.total ? Math.round((row.count / stats.total) * 100) : 0}%)</span>
                                                    </div>
                                                    <div className={`h-3 rounded-full ${row.light} overflow-hidden`}>
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: stats.total ? `${(row.count / stats.total) * 100}%` : "0%" }}
                                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                                            className={`h-full rounded-full ${row.color}`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                        <h3 className="font-black text-slate-800 mb-6">Visit Type Distribution</h3>
                                        <div className="space-y-4">
                                            {(() => {
                                                const safeAppts = Array.isArray(appointments) ? appointments : [];
                                                const clinicVisits = safeAppts.filter(a => a.clinicVisit).length;
                                                const videoVisits = safeAppts.filter(a => a.videoConsultation).length;
                                                const otherVisits = safeAppts.length - clinicVisits - videoVisits;
                                                return [
                                                    { label: "Clinic Visits", count: clinicVisits + otherVisits, color: "bg-blue-600", light: "bg-blue-50" },
                                                    { label: "Video Consults", count: videoVisits, color: "bg-purple-600", light: "bg-purple-100" },
                                                ].map(row => (
                                                    <div key={row.label}>
                                                        <div className="flex justify-between text-sm font-semibold text-slate-700 mb-1.5">
                                                            <span>{row.label}</span>
                                                            <span>{row.count} ({safeAppts.length ? Math.round((row.count / safeAppts.length) * 100) : 0}%)</span>
                                                        </div>
                                                        <div className={`h-3 rounded-full ${row.light} overflow-hidden`}>
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: safeAppts.length ? `${(row.count / safeAppts.length) * 100}%` : "0%" }}
                                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                                                className={`h-full rounded-full ${row.color}`}
                                                            />
                                                        </div>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-slate-100">
                                            <h4 className="font-bold text-slate-700 mb-3 text-sm">Slot Preference</h4>
                                            {(() => {
                                                const safeAppts = Array.isArray(appointments) ? appointments : [];
                                                const morning = safeAppts.filter(a => a.slot?.includes("Morning")).length;
                                                const evening = safeAppts.filter(a => a.slot?.includes("Evening")).length;
                                                return [
                                                    { label: "Morning (9AM–1PM)", count: morning, color: "bg-[#d97706]", light: "bg-[rgba(217, 119, 6,0.12)]" },
                                                    { label: "Evening (4PM–8PM)", count: evening, color: "bg-blue-600", light: "bg-blue-50" },
                                                ].map(row => (
                                                    <div key={row.label} className="mb-3">
                                                        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                                                            <span>{row.label}</span><span>{row.count}</span>
                                                        </div>
                                                        <div className={`h-2 rounded-full ${row.light} overflow-hidden`}>
                                                            <motion.div initial={{ width: 0 }} animate={{ width: safeAppts.length ? `${(row.count / safeAppts.length) * 100}%` : "0%" }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${row.color}`} />
                                                        </div>
                                                    </div>
                                                ));
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* ── Banners Tab ── */}
                    {
                        activeTab === "banners" && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                    <h3 className="font-black text-slate-800 mb-4">Add New Banner</h3>
                                    <div className="flex gap-3 mb-4">
                                        {["url", "file"].map(t => (
                                            <button key={t} type="button" onClick={() => setUploadType(t)}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${uploadType === t ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                                                <i className={`fa-solid ${t === "url" ? "fa-link" : "fa-upload"} mr-2`}></i>{t === "url" ? "Image URL" : "Upload File"}
                                            </button>
                                        ))}
                                    </div>
                                    <form onSubmit={handleBannerSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{uploadType === "url" ? "Image URL" : "Select File"}</label>
                                            {uploadType === "url" ? (
                                                <input type="text" placeholder="https://..." value={newBanner.image} onChange={e => setNewBanner({ ...newBanner, image: e.target.value })} required className={inp} />
                                            ) : (
                                                <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} required className={`${inp} file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600`} />
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
                                            <input type="text" placeholder="Banner title" value={newBanner.title} onChange={e => setNewBanner({ ...newBanner, title: e.target.value })} className={inp} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subtitle</label>
                                            <input type="text" placeholder="Subtitle" value={newBanner.subtitle} onChange={e => setNewBanner({ ...newBanner, subtitle: e.target.value })} className={inp} />
                                        </div>
                                        <button type="submit" className="md:col-start-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all">
                                            <i className="fa-solid fa-plus mr-2"></i>Add Banner
                                        </button>
                                    </form>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {(Array.isArray(banners) ? banners : []).map(b => (
                                        <div key={b._id} className="group relative rounded-2xl overflow-hidden shadow-md h-52 border border-slate-200">
                                            <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                                                <h4 className="font-bold text-base leading-tight">{b.title}</h4>
                                                <p className="text-sm opacity-80">{b.subtitle}</p>
                                            </div>
                                            <button onClick={() => handleDeleteBanner(b._id)} className="absolute top-3 right-3 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600 shadow-lg">
                                                <i className="fa-solid fa-trash text-xs"></i>
                                            </button>
                                        </div>
                                    ))}
                                    {banners.length === 0 && <div className="col-span-3 py-16 text-center text-slate-400"><i className="fa-solid fa-images text-4xl mb-3 block opacity-30"></i><p className="font-semibold">No banners yet</p></div>}
                                </div>
                            </div>
                        )
                    }

                    {/* ── Gallery Tab ── */}
                    {
                        activeTab === "gallery" && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                    <h3 className="font-black text-slate-800 mb-4">Add Gallery Image</h3>
                                    <div className="flex gap-3 mb-4">
                                        {["url", "file"].map(t => (
                                            <button key={t} type="button" onClick={() => setGalleryUploadType(t)}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${galleryUploadType === t ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                                                <i className={`fa-solid ${t === "url" ? "fa-link" : "fa-upload"} mr-2`}></i>{t === "url" ? "Image URL" : "Upload File"}
                                            </button>
                                        ))}
                                    </div>
                                    <form onSubmit={handleGallerySubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                        <div className="md:col-span-2 space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{galleryUploadType === "url" ? "Image URL" : "Select File"}</label>
                                            {galleryUploadType === "url" ? (
                                                <input type="text" placeholder="https://..." value={newGalleryImage.imageUrl} onChange={e => setNewGalleryImage({ ...newGalleryImage, imageUrl: e.target.value })} required className={inp} />
                                            ) : (
                                                <input type="file" accept="image/*" onChange={e => setGalleryFile(e.target.files[0])} required className={`${inp} file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600`} />
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title/Alt Text</label>
                                            <input type="text" placeholder="Clinic interior..." value={newGalleryImage.title} onChange={e => setNewGalleryImage({ ...newGalleryImage, title: e.target.value })} className={inp} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                                            <select value={newGalleryImage.category} onChange={e => setNewGalleryImage({ ...newGalleryImage, category: e.target.value })} className={inp}>
                                                {GALLERY_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <button type="submit" className="md:col-start-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all">
                                            <i className="fa-solid fa-plus mr-2"></i>Upload Image
                                        </button>
                                    </form>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                                    {(Array.isArray(galleryImages) ? galleryImages : []).map(g => (
                                        <div key={g._id} className="group relative rounded-2xl overflow-hidden shadow-md h-48 border border-slate-200">
                                            <img src={g.image} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col justify-end p-4 text-white">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">{g.category}</span>
                                                <h4 className="font-bold text-sm leading-tight truncate">{g.title || 'Untitled Image'}</h4>
                                            </div>
                                            <button onClick={() => handleDeleteGalleryImage(g._id)} className="absolute top-3 right-3 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600 shadow-lg">
                                                <i className="fa-solid fa-trash text-xs"></i>
                                            </button>
                                        </div>
                                    ))}
                                    {galleryImages.length === 0 && <div className="col-span-full py-16 text-center text-slate-400"><i className="fa-solid fa-camera text-4xl mb-3 block opacity-30"></i><p className="font-semibold">No gallery images yet</p></div>}
                                </div>
                            </div>
                        )
                    }

                    {/* ── Videos Tab ── */}
                    {
                        activeTab === "videos" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-black text-slate-800">Video Gallery</h2>
                                        <p className="text-sm text-slate-400 mt-0.5">Manage clinical and informational videos</p>
                                    </div>
                                    <a href="/gallery?tab=videos" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors">
                                        <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i> View Gallery
                                    </a>
                                </div>

                                {/* Add Video Form */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                    <h3 className="font-black text-slate-800 mb-5 flex items-center gap-2 text-base">
                                        <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm"><i className="fa-solid fa-plus"></i></span>
                                        Add New Video
                                    </h3>
                                    <form onSubmit={handleVideoSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Video Title *</label>
                                                <input required type="text" placeholder="e.g. Spine Recovery Exercises" value={newVideo.title} onChange={e => setNewVideo({ ...newVideo, title: e.target.value })} className={inp} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                                                <select value={newVideo.category} onChange={e => setNewVideo({ ...newVideo, category: e.target.value })} className={inp}>
                                                    <option value="General">General</option>
                                                    <option value="Clinical">Clinical</option>
                                                    <option value="Tutorial">Tutorial</option>
                                                    <option value="Success Stories">Success Stories</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Video URL (YouTube/Vimeo) *</label>
                                            <div className="relative">
                                                <i className="fa-solid fa-link absolute left-3 top-3.5 text-slate-400 text-xs"></i>
                                                <input required type="url" placeholder="https://www.youtube.com/watch?v=..." value={newVideo.videoUrl} onChange={e => setNewVideo({ ...newVideo, videoUrl: e.target.value })} className={`${inp} pl-9`} />
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Paste the full URL from your browser address bar.</p>
                                        </div>
                                        <div className="flex justify-end">
                                            <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-sm shadow-md hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
                                                <i className="fa-solid fa-circle-play mr-2"></i>Add Video
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Videos List */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {(Array.isArray(videos) ? videos : []).map(video => (
                                        <div key={video._id} className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
                                            <div className="relative aspect-video bg-slate-900 flex items-center justify-center">
                                                <i className="fa-solid fa-circle-play text-4xl text-white/20 group-hover:text-blue-500 transition-colors"></i>
                                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button onClick={() => handleDeleteVideo(video._id)} className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transform scale-90 group-hover:scale-100 transition-all shadow-lg">
                                                        <i className="fa-solid fa-trash text-sm"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-2 inline-block">{video.category}</span>
                                                <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{video.title}</h4>
                                                <p className="text-[10px] text-slate-400 mt-1 truncate">{video.videoUrl}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {videos.length === 0 && (
                                        <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                                            <i className="fa-solid fa-film text-4xl mb-3 block opacity-30"></i>
                                            <p className="font-semibold italic">No videos added yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }

                    {/* ── Doctors Tab ── */}
                    {
                        activeTab === "doctors" && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                    <h3 className="font-black text-slate-800 mb-4">Add New Doctor</h3>
                                    <div className="flex gap-3 mb-4">
                                        {["url", "file"].map(t => (
                                            <button key={t} type="button" onClick={() => setDoctorUploadType(t)}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${doctorUploadType === t ? "bg-blue-50 text-white shadow-md shadow-[rgba(13, 148, 136,0.25)]" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                                                <i className={`fa-solid ${t === "url" ? "fa-link" : "fa-upload"} mr-2`}></i>{t === "url" ? "Image URL" : "Upload File"}
                                            </button>
                                        ))}
                                    </div>
                                    <form onSubmit={handleDoctorSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label><input required type="text" placeholder="Dr. Full Name" value={newDoctor.name} onChange={e => setNewDoctor({ ...newDoctor, name: e.target.value })} className={inp} /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Qualification</label><input required type="text" placeholder="MPT (Ortho)" value={newDoctor.qualification} onChange={e => setNewDoctor({ ...newDoctor, qualification: e.target.value })} className={inp} /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Specialty</label><input required type="text" placeholder="Orthopedic Physiotherapy" value={newDoctor.specialty} onChange={e => setNewDoctor({ ...newDoctor, specialty: e.target.value })} className={inp} /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Designation</label><input required type="text" placeholder="HOD – Physiotherapy" value={newDoctor.designation} onChange={e => setNewDoctor({ ...newDoctor, designation: e.target.value })} className={inp} /></div>
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{doctorUploadType === "url" ? "Photo URL" : "Upload Photo"}</label>
                                            {doctorUploadType === "url" ? <input type="text" placeholder="https://..." value={newDoctor.imageUrl} onChange={e => setNewDoctor({ ...newDoctor, imageUrl: e.target.value })} className={inp} /> : <input type="file" accept="image/*" onChange={e => setDoctorFile(e.target.files[0])} className={`${inp} file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600`} />}
                                        </div>
                                        <div className="md:col-span-2 flex justify-end">
                                            <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all"><i className="fa-solid fa-plus mr-2"></i>Add Doctor</button>
                                        </div>
                                    </form>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {(Array.isArray(doctors) ? doctors : []).map(doc => (
                                        <div key={doc._id} className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                            <div className="h-52 overflow-hidden bg-slate-100">
                                                <img src={doc.image} alt={doc.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" onError={e => { e.target.src = "https://placehold.co/400x300?text=Doctor"; }} />
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-black text-slate-800">{doc.name}</h4>
                                                <p className="text-xs font-bold text-blue-600 mt-0.5">{doc.qualification}</p>
                                                <span className="inline-block mt-2 text-xs bg-blue-50/50 text-[#0f766e] px-2 py-0.5 rounded-full font-semibold">{doc.specialty}</span>
                                                <p className="text-xs text-slate-400 mt-1">{doc.designation}</p>
                                            </div>
                                            <button onClick={() => handleDeleteDoctor(doc._id)} className="absolute top-3 right-3 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600 shadow-lg">
                                                <i className="fa-solid fa-trash text-xs"></i>
                                            </button>
                                        </div>
                                    ))}
                                    {doctors.length === 0 && <div className="col-span-3 py-16 text-center text-slate-400"><i className="fa-solid fa-user-doctor text-4xl mb-3 block opacity-30"></i><p className="font-semibold">No doctors added yet</p></div>}
                                </div>
                            </div>
                        )
                    }

                    {/* ── Testimonials Tab ── */}
                    {
                        activeTab === "testimonials" && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                    <h3 className="font-black text-slate-800 mb-4">Add New Testimonial</h3>
                                    <form onSubmit={handleTestimonialSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</label><input required type="text" placeholder="Full Name" value={newTestimonial.name} onChange={e => setNewTestimonial({ ...newTestimonial, name: e.target.value })} className={inp} /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label><input required type="text" placeholder="e.g. Jaipur" value={newTestimonial.location} onChange={e => setNewTestimonial({ ...newTestimonial, location: e.target.value })} className={inp} /></div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</label>
                                            <select value={newTestimonial.rating} onChange={e => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })} className={inp}>
                                                <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                                                <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                                                <option value={3}>⭐⭐⭐ 3 Stars</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1 md:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Review Message</label><textarea required rows={3} placeholder="Patient's review..." value={newTestimonial.message} onChange={e => setNewTestimonial({ ...newTestimonial, message: e.target.value })} className={`${inp} resize-none`} /></div>
                                        <div className="md:col-span-2 flex justify-end"><button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all"><i className="fa-solid fa-plus mr-2"></i>Add Testimonial</button></div>
                                    </form>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(Array.isArray(testimonials) ? testimonials : []).map(t => (
                                        <div key={t._id} className="group bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all relative">
                                            <div className="flex items-start gap-4">
                                                <div className="w-11 h-11 rounded-full bg-blue-50 text-[#0f766e] flex items-center justify-center font-black text-lg flex-shrink-0">{t.name?.charAt(0)}</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <div><p className="font-black text-slate-800 text-sm">{t.name}</p><p className="text-xs text-slate-400">{t.location}</p></div>
                                                        <div className="text-[#d97706] text-xs">{[...Array(t.rating)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}</div>
                                                    </div>
                                                    <p className="text-sm text-slate-600 mt-2 italic leading-relaxed">"{t.message}"</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDeleteTestimonial(t._id)} className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                <i className="fa-solid fa-trash text-xs"></i>
                                            </button>
                                        </div>
                                    ))}
                                    {testimonials.length === 0 && <div className="col-span-2 py-16 text-center text-slate-400"><i className="fa-solid fa-star text-4xl mb-3 block opacity-30"></i><p className="font-semibold">No testimonials yet</p></div>}
                                </div>
                            </div>
                        )
                    }

                    {/* ── Settings Tab ── */}
                    {
                        activeTab === "settings" && (
                            <form onSubmit={handleClinicInfoSubmit} className="space-y-6 max-w-4xl">
                                {[
                                    {
                                        title: "Contact Information", icon: "fa-phone", content: (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone 1</label><input type="text" placeholder="+91 XXXXXXXXXX" value={clinicInfo.phones?.[0] || ""} onChange={e => setClinicInfo({ ...clinicInfo, phones: [e.target.value, clinicInfo.phones?.[1] || ""] })} className={inp} /></div>
                                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone 2</label><input type="text" placeholder="+91 XXXXXXXXXX" value={clinicInfo.phones?.[1] || ""} onChange={e => setClinicInfo({ ...clinicInfo, phones: [clinicInfo.phones?.[0] || "", e.target.value] })} className={inp} /></div>
                                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label><input type="email" placeholder="info@clinic.com" value={clinicInfo.email || ""} onChange={e => setClinicInfo({ ...clinicInfo, email: e.target.value })} className={inp} /></div>
                                                <div className="space-y-1 md:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Address</label><textarea rows={2} placeholder="Full clinic address" value={clinicInfo.address || ""} onChange={e => setClinicInfo({ ...clinicInfo, address: e.target.value })} className={`${inp} resize-none`} /></div>
                                            </div>
                                        )
                                    },
                                    {
                                        title: "Opening Hours", icon: "fa-clock", content: (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Morning (Mon–Sat)</label><input type="text" placeholder="09:00 AM – 01:00 PM" value={clinicInfo.openingHours?.morning || ""} onChange={e => setClinicInfo({ ...clinicInfo, openingHours: { ...clinicInfo.openingHours, morning: e.target.value } })} className={inp} /></div>
                                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evening (Mon–Sat)</label><input type="text" placeholder="04:00 PM – 08:00 PM" value={clinicInfo.openingHours?.evening || ""} onChange={e => setClinicInfo({ ...clinicInfo, openingHours: { ...clinicInfo.openingHours, evening: e.target.value } })} className={inp} /></div>
                                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sunday</label><input type="text" placeholder="09:00 AM – 12:00 PM" value={clinicInfo.openingHours?.sunday || ""} onChange={e => setClinicInfo({ ...clinicInfo, openingHours: { ...clinicInfo.openingHours, sunday: e.target.value } })} className={inp} /></div>
                                            </div>
                                        )
                                    },
                                    {
                                        title: "Booking Configuration", icon: "fa-calendar-check", content: (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Max Patients Per Slot</label>
                                                    <div className="flex items-center gap-3">
                                                        <input type="number" min="0" placeholder="e.g. 10" value={clinicInfo.maxBookingsPerSlot} onChange={e => setClinicInfo({ ...clinicInfo, maxBookingsPerSlot: Number(e.target.value) })} className={inp} />
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">(0 = Unlimited)</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Show Availability to Patients</label>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setClinicInfo({ ...clinicInfo, showSlotAvailability: !clinicInfo.showSlotAvailability })}
                                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${clinicInfo.showSlotAvailability ? 'bg-blue-600' : 'bg-slate-200'}`}
                                                        >
                                                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${clinicInfo.showSlotAvailability ? 'translate-x-5' : 'translate-x-0'}`} />
                                                        </button>
                                                        <span className="text-xs font-semibold text-slate-600">{clinicInfo.showSlotAvailability ? "Enabled" : "Disabled"}</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 mt-1 italic">When enabled, patients see "X slots left". When disabled, they only see slot names.</p>
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        title: "Automations", icon: "fa-robot", content: (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {[
                                                    { id: 'birthday', label: 'Birthday Wishes', icon: 'fa-cake-candles', desc: 'Daily at 9:00 AM' },
                                                    { id: 'followUp', label: 'Follow-up Alerts', icon: 'fa-stethoscope', desc: 'Daily at 10:00 AM' },
                                                    { id: 'medicine', label: 'Meds Reminders', icon: 'fa-pills', desc: 'Coming soon' },
                                                ].map(auto => (
                                                    <div key={auto.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <i className={`fa-solid ${auto.icon} text-blue-600`}></i>
                                                                <span className="text-xs font-black text-slate-800">{auto.label}</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleAutomation(auto.id)}
                                                                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${clinicInfo?.automations?.[auto.id] !== false ? 'bg-blue-600' : 'bg-slate-300'}`}
                                                            >
                                                                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${clinicInfo?.automations?.[auto.id] !== false ? 'translate-x-4' : 'translate-x-0'}`} />
                                                            </button>
                                                        </div>
                                                        <p className="text-[9px] text-slate-400 font-bold uppercase">{auto.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    },
                                    {
                                        title: "Weekly Slot Schedule", icon: "fa-calendar-days", content: (
                                            <div className="space-y-6">
                                                <p className="text-[10px] text-slate-500 italic uppercase font-bold tracking-widest border-l-2 border-blue-500 pl-3">
                                                    Define custom time slots for each day. If a day has no custom slots, the system uses default "Morning" and "Evening" slots.
                                                </p>
                                                <div className="grid grid-cols-1 gap-6">
                                                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(day => (
                                                        <div key={day} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                                                                    <i className="fa-solid fa-calendar-minus text-blue-400"></i> {day}
                                                                </h4>
                                                                <div className="flex items-center gap-2">
                                                                    <input 
                                                                        type="text" 
                                                                        placeholder="e.g. 10AM - 12PM" 
                                                                        className="text-[10px] py-1 px-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                e.preventDefault();
                                                                                const val = e.target.value.trim();
                                                                                if (val) {
                                                                                    const currentSlots = clinicInfo.dayWiseSlots?.[day] || [];
                                                                                    if (!currentSlots.includes(val)) {
                                                                                        setClinicInfo({
                                                                                            ...clinicInfo,
                                                                                            dayWiseSlots: {
                                                                                                ...(clinicInfo.dayWiseSlots || {}),
                                                                                                [day]: [...currentSlots, val]
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                    e.target.value = '';
                                                                                }
                                                                            }
                                                                        }}
                                                                    />
                                                                    <span className="text-[9px] text-slate-400 italic font-medium">Press Enter to add</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
                                                                {(clinicInfo.dayWiseSlots?.[day] || []).length === 0 ? (
                                                                    <span className="text-[10px] text-slate-300 font-bold tracking-widest uppercase py-1 px-3 border border-dashed border-slate-200 rounded-lg">Using Defaults</span>
                                                                ) : (
                                                                    (clinicInfo.dayWiseSlots?.[day] || []).map((slot, idx) => (
                                                                        <span key={idx} className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-100 text-blue-600 rounded-lg text-[10px] font-black group shadow-sm">
                                                                            {slot}
                                                                            <button 
                                                                                type="button" 
                                                                                onClick={() => {
                                                                                    const updated = (clinicInfo.dayWiseSlots?.[day] || []).filter(s => s !== slot);
                                                                                    setClinicInfo({
                                                                                        ...clinicInfo,
                                                                                        dayWiseSlots: {
                                                                                            ...(clinicInfo.dayWiseSlots || {}),
                                                                                            [day]: updated
                                                                                        }
                                                                                    });
                                                                                }}
                                                                                className="text-slate-300 hover:text-red-500 transition-colors"
                                                                            >
                                                                                <i className="fa-solid fa-xmark"></i>
                                                                            </button>
                                                                        </span>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        title: "Social Links", icon: "fa-share-nodes", content: (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[{ key: "facebook", icon: "fa-facebook-f", label: "Facebook" }, { key: "instagram", icon: "fa-instagram", label: "Instagram" }, { key: "twitter", icon: "fa-twitter", label: "Twitter" }, { key: "whatsapp", icon: "fa-whatsapp", label: "WhatsApp" }, { key: "google", icon: "fa-google", label: "Google Reviews" }].map(({ key, icon, label }) => (
                                                    <div key={key} className="space-y-1">
                                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><i className={`fa-brands ${icon}`}></i>{label}</label>
                                                        <input type="text" placeholder="https://..." value={clinicInfo.socialLinks?.[key] || ""} onChange={e => setClinicInfo({ ...clinicInfo, socialLinks: { ...clinicInfo.socialLinks, [key]: e.target.value } })} className={inp} />
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                    },
                                ].map(section => (
                                    <div key={section.title} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                        <h3 className="font-black text-slate-800 mb-5 flex items-center gap-2 text-base">
                                            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm"><i className={`fa-solid ${section.icon}`}></i></span>
                                            {section.title}
                                        </h3>
                                        {section.content}
                                    </div>
                                ))}
                                <div className="flex justify-end">
                                    <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                                        <i className="fa-solid fa-floppy-disk mr-2"></i>Save All Settings
                                    </button>
                                </div>
                            </form>
                        )
                    }

                    {/* Patient Stories Tab */}
                    {
                        activeTab === "stories" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-black text-slate-800">Patient Stories</h2>
                                        <p className="text-sm text-slate-400 mt-0.5">Add and manage patient recovery stories</p>
                                    </div>
                                    <a href="/patient-stories" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors">
                                        <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i> View Public Page
                                    </a>
                                </div>

                                {/* Add/Edit Story Form */}
                                <div id="story-form" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                    <h3 className="font-black text-slate-800 mb-5 flex items-center gap-2 text-base">
                                        <span className={`w-8 h-8 rounded-lg ${editingStory ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'} flex items-center justify-center text-sm`}>
                                            <i className={`fa-solid ${editingStory ? 'fa-pen-to-square' : 'fa-plus'}`}></i>
                                        </span>
                                        {editingStory ? 'Edit Story' : 'Add New Story'}
                                    </h3>
                                    <form onSubmit={handleStorySubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name *</label><input required type="text" placeholder="e.g. Ramesh Kumar" value={newStory.patientName} onChange={e => setNewStory({ ...newStory, patientName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 ring-blue-500/30 focus:border-blue-100/50" /></div>
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Age</label><input type="text" placeholder="e.g. 45" value={newStory.age} onChange={e => setNewStory({ ...newStory, age: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 ring-blue-500/30 focus:border-blue-100/50" /></div>
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label><input type="text" placeholder="e.g. Jaipur, Rajasthan" value={newStory.location} onChange={e => setNewStory({ ...newStory, location: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 ring-blue-500/30 focus:border-blue-100/50" /></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Condition / Diagnosis *</label><input required type="text" placeholder="e.g. Lower Back Pain" value={newStory.condition} onChange={e => setNewStory({ ...newStory, condition: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 ring-blue-500/30 focus:border-blue-100/50" /></div>
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Condition (Hindi)</label><input type="text" placeholder="e.g. कमर दर्द" value={newStory.conditionHi} onChange={e => setNewStory({ ...newStory, conditionHi: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 ring-blue-500/30 focus:border-blue-100/50" /></div>
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Outcome / Result</label><input type="text" placeholder="e.g. Fully recovered in 4 weeks" value={newStory.outcome} onChange={e => setNewStory({ ...newStory, outcome: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 ring-blue-500/30 focus:border-blue-100/50" /></div>
                                        </div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Story *</label><textarea required rows={4} placeholder="Write the patient's recovery story in their own words..." value={newStory.story} onChange={e => setNewStory({ ...newStory, story: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 ring-blue-500/30 focus:border-blue-100/50 resize-none" /></div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</label>
                                                <select value={newStory.rating} onChange={e => setNewStory({ ...newStory, rating: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 ring-blue-500/30 focus:border-blue-100/50">
                                                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image Source</label>
                                                <select value={storyUploadType} onChange={e => setStoryUploadType(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 ring-blue-500/30 focus:border-blue-100/50">
                                                    <option value="url">Image URL</option>
                                                    <option value="file">Upload File</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Featured Story?</label>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <input type="checkbox" id="storyFeatured" checked={newStory.featured} onChange={e => setNewStory({ ...newStory, featured: e.target.checked })} className="w-4 h-4 accent-indigo-600" />
                                                    <label htmlFor="storyFeatured" className="text-sm text-slate-600 font-semibold">Mark as featured</label>
                                                </div>
                                            </div>
                                        </div>
                                        {storyUploadType === "url" ? (
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image URL</label><input type="url" placeholder="https://..." value={newStory.imageUrl} onChange={e => setNewStory({ ...newStory, imageUrl: e.target.value })} className={inp} /></div>
                                        ) : (
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upload Image</label><input type="file" accept="image/*" onChange={e => setStoryFile(e.target.files[0])} className={`${inp} file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100`} /></div>
                                        )}
                                        <div className="flex justify-end gap-3">
                                            {editingStory && (
                                                <button type="button" onClick={() => {
                                                    setEditingStory(null);
                                                    setNewStory({ patientName: "", age: "", location: "", condition: "", conditionHi: "", story: "", outcome: "", imageUrl: "", rating: 5, featured: false });
                                                }} className="px-6 py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl font-bold text-sm transition-all">
                                                    Cancel
                                                </button>
                                            )}
                                            <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-sm shadow-md hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                                                <i className={`fa-solid ${editingStory ? 'fa-save' : 'fa-heart-pulse'} mr-2`}></i>{editingStory ? 'Update Story' : 'Add Story'}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Stories List */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {(Array.isArray(stories) ? stories : []).map(story => (
                                        <div key={story._id} className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
                                            {story.image && <img src={story.image} alt={story.patientName} className="w-full h-40 object-cover" />}
                                            <div className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="font-black text-slate-800 text-sm">{story.patientName}</p>
                                                        <p className="text-xs text-slate-400">{story.age && story.age + "y"}{story.location && " � " + story.location}</p>
                                                    </div>
                                                    {story.featured && <span className="bg-[rgba(217, 119, 6,0.12)] text-[#d97706] text-xs font-bold px-2 py-0.5 rounded-full">Featured</span>}
                                                </div>
                                                <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full mb-2">{story.condition} {story.conditionHi && <span className="font-black">({story.conditionHi})</span>}</span>
                                                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 italic">"{story.story}"</p>
                                                {story.outcome && <p className="text-[#4a8a68] text-xs font-bold mt-2"><i className="fa-solid fa-circle-check mr-1"></i>{story.outcome}</p>}
                                            </div>
                                            <div className="px-4 pb-4 flex justify-end gap-3">
                                                <button onClick={() => setViewingStory(story)} className="text-xs text-slate-500 hover:text-slate-700 font-bold flex items-center gap-1 transition-colors">
                                                    <i className="fa-solid fa-eye text-[10px]"></i> View
                                                </button>
                                                <button onClick={() => handleEditStory(story)} className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 transition-colors">
                                                    <i className="fa-solid fa-pen-to-square text-[10px]"></i> Edit
                                                </button>
                                                <button onClick={() => handleDeleteStory(story._id)} className="text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 transition-colors">
                                                    <i className="fa-solid fa-trash text-[10px]"></i> Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {stories.length === 0 && <div className="col-span-3 py-16 text-center text-slate-400"><i className="fa-solid fa-heart-pulse text-4xl mb-3 block opacity-30"></i><p className="font-semibold">No stories yet</p></div>}
                                </div>
                            </div>
                        )
                    }

                    {/* Clinic Posters Tab */}
                    {
                        activeTab === "posters" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-black text-slate-800">Blogs</h2>
                                        <p className="text-sm text-slate-400 mt-0.5">Upload and manage clinic blogs</p>
                                    </div>
                                    <a href="/clinic-posters" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors">
                                        <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i> View Public Page
                                    </a>
                                </div>

                                {/* Upload Poster Form */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                    <h3 className="font-black text-slate-800 mb-5 flex items-center gap-2 text-base">
                                        <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm"><i className="fa-solid fa-upload"></i></span>
                                        Upload New Blog
                                    </h3>
                                    <form onSubmit={handlePosterSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label><input type="text" placeholder="e.g. World Physiotherapy Day" value={newPoster.title} onChange={e => setNewPoster({ ...newPoster, title: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(13, 148, 136,0.25)] focus:border-[#0d9488]" /></div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                                                <select value={newPoster.category} onChange={e => setNewPoster({ ...newPoster, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(13, 148, 136,0.25)] focus:border-[#0d9488]">
                                                    {POSTER_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image Source</label>
                                                <select value={posterUploadType} onChange={e => setPosterUploadType(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(13, 148, 136,0.25)] focus:border-[#0d9488]">
                                                    <option value="file">Upload File</option>
                                                    <option value="url">Image URL</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label><input type="text" placeholder="Short description (optional)" value={newPoster.description} onChange={e => setNewPoster({ ...newPoster, description: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(13, 148, 136,0.25)] focus:border-[#0d9488]" /></div>
                                        {posterUploadType === "file" ? (
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upload Poster Image *</label>
                                                <div className="border-2 border-dashed border-blue-100/50 rounded-2xl p-8 text-center hover:border-[#0d9488] transition-colors cursor-pointer" onClick={() => document.getElementById("posterFileInput").click()}>
                                                    {posterFile ? (
                                                        <div className="flex items-center justify-center gap-3">
                                                            <i className="fa-solid fa-image text-blue-600 text-2xl"></i>
                                                            <span className="text-sm font-bold text-slate-700">{posterFile.name}</span>
                                                            <button type="button" onClick={e => { e.stopPropagation(); setPosterFile(null); }} className="text-rose-400 hover:text-rose-600"><i className="fa-solid fa-xmark"></i></button>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <i className="fa-solid fa-cloud-arrow-up text-blue-400 text-4xl mb-2 block"></i>
                                                            <p className="text-sm font-bold text-slate-500">Click to upload poster</p>
                                                            <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP supported</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <input id="posterFileInput" type="file" accept="image/*" className="hidden" onChange={e => setPosterFile(e.target.files[0])} />
                                            </div>
                                        ) : (
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image URL *</label><input required type="url" placeholder="https://..." value={newPoster.imageUrl} onChange={e => setNewPoster({ ...newPoster, imageUrl: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(13, 148, 136,0.25)] focus:border-[#0d9488]" /></div>
                                        )}
                                        <div className="flex justify-end">
                                            <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-sm shadow-md hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                                                <i className="fa-solid fa-upload mr-2"></i>Upload Poster
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Posters Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {(Array.isArray(posters) ? posters : []).map(poster => (
                                        <div key={poster._id} className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                            <img src={poster.image} alt={poster.title || "Poster"} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ minHeight: "160px" }} onError={e => { e.target.src = "https://placehold.co/400x500?text=Poster"; }} />
                                            {poster.category && poster.category !== "General" && (
                                                <div className="absolute top-2 left-2"><span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">{poster.category}</span></div>
                                            )}
                                            <button onClick={() => handleDeletePoster(poster._id)} className="absolute top-2 right-2 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600 shadow-lg">
                                                <i className="fa-solid fa-trash text-xs"></i>
                                            </button>
                                            {(poster.title || poster.description) && (
                                                <div className="p-3">
                                                    {poster.title && <p className="font-black text-slate-800 text-xs">{poster.title}</p>}
                                                    {poster.description && <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">{poster.description}</p>}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {posters.length === 0 && <div className="col-span-4 py-16 text-center text-slate-400"><i className="fa-solid fa-image text-4xl mb-3 block opacity-30"></i><p className="font-semibold">No posters uploaded yet</p></div>}
                                </div>
                            </div>
                        )
                    }
                </div >
            </main >


            {/* ── Create Modal ── */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <div><h3 className="text-lg font-black text-slate-800">New Appointment</h3><p className="text-xs text-slate-400 mt-0.5">Enter patient details manually</p></div>
                                <button onClick={() => setIsCreateModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-500 flex items-center justify-center transition-all"><i className="fa-solid fa-xmark"></i></button>
                            </div>
                            <form onSubmit={handleCreateSubmit} className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</label><div className="relative"><i className="fa-solid fa-user absolute left-3 top-3 text-slate-400 text-xs"></i><input required type="text" name="patientName" value={newAppointment.patientName} onChange={handleCreateChange} placeholder="Full Name" className={`${inp} pl-9`} /></div></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label><div className="relative"><i className="fa-solid fa-phone absolute left-3 top-3 text-slate-400 text-xs"></i><input required type="tel" name="phone" value={newAppointment.phone} onChange={handleCreateChange} placeholder="10-digit number" className={`${inp} pl-9`} /></div></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Age</label><input required type="number" name="age" value={newAppointment.age} onChange={handleCreateChange} placeholder="Age" className={inp} /></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gender</label><select name="gender" value={newAppointment.gender} onChange={handleCreateChange} className={inp}><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label><input required type="date" name="date" value={newAppointment.date} onChange={handleCreateChange} className={inp} /></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Slot</label><select name="slot" value={newAppointment.slot} onChange={handleCreateChange} className={inp}><option value="Morning (9AM–1PM)">Morning (9AM–1PM)</option><option value="Evening (4PM–8PM)">Evening (4PM–8PM)</option></select></div>
                                </div>
                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Problem Description</label><input required type="text" name="problem" value={newAppointment.problem} onChange={handleCreateChange} placeholder="Briefly describe the issue..." className={inp} /></div>
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100/50 flex flex-col gap-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" name="clinicVisit" checked={newAppointment.clinicVisit} onChange={(e) => { handleCreateChange(e); if (e.target.checked) setNewAppointment(p => ({ ...p, videoConsultation: false })); }} className="w-4 h-4 rounded text-blue-600 focus:ring-[rgba(13, 148, 136,0.30)] border-slate-300" />
                                        <span className="text-sm font-bold text-slate-700"><i className="fa-solid fa-stethoscope mr-2 text-blue-600"></i>Clinic Visit</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" name="videoConsultation" checked={newAppointment.videoConsultation} onChange={(e) => { handleCreateChange(e); if (e.target.checked) setNewAppointment(p => ({ ...p, clinicVisit: false })); }} className="w-4 h-4 rounded accent-purple-600 focus:ring-purple-600 border-slate-300" />
                                        <span className="text-sm font-bold text-slate-700"><i className="fa-solid fa-video mr-2 text-purple-600"></i>Video Consultation</span>
                                    </label>
                                </div>
                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doctor's Notes (Internal)</label><textarea name="notes" value={newAppointment.notes} onChange={handleCreateChange} placeholder="Add notes..." className={`${inp} resize-none`} rows={2}></textarea></div>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
                                        <input type="checkbox" name="whatsappNotify" checked={newAppointment.whatsappNotify} onChange={handleCreateChange} className="rounded text-[#4a8a68] focus:ring-green-500" />
                                        <span>Notify via <span className="text-[#4a8a68] font-bold"><i className="fa-brands fa-whatsapp"></i> WhatsApp</span></span>
                                    </label>
                                    <div className="flex gap-3">
                                        <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2 text-slate-500 hover:bg-slate-100 rounded-xl font-semibold text-sm transition-all">Cancel</button>
                                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all">Create Appointment</button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── View Modal ── */}
            <AnimatePresence>
                {viewAppointment && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800">Appointment Details</h3>
                                    <p className="text-xs font-mono text-blue-600 mt-0.5">{viewAppointment.appointmentId}</p>
                                </div>
                                <button onClick={() => setViewAppointment(null)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-500 flex items-center justify-center transition-all"><i className="fa-solid fa-xmark"></i></button>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="flex justify-end">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wide ${statusColor(viewAppointment.status)}`}>{viewAppointment.status}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Patient</p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0f766e] flex items-center justify-center text-xl font-black">{viewAppointment.patientName?.charAt(0)}</div>
                                                <div><p className="font-black text-slate-800">{viewAppointment.patientName}</p><p className="text-sm text-slate-400">{viewAppointment.age} Years &bull; {viewAppointment.gender}</p></div>
                                            </div>
                                        </div>
                                        <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Contact</p><p className="text-slate-700 font-mono font-semibold"><i className="fa-solid fa-phone text-slate-300 mr-2"></i>{viewAppointment.phone}</p></div>
                                    </div>
                                    <div className="space-y-4">
                                        <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date & Time</p><p className="font-semibold text-slate-700"><i className="fa-solid fa-calendar text-slate-300 mr-2"></i>{new Date(viewAppointment.date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p><p className="font-semibold text-slate-700 mt-1"><i className="fa-solid fa-clock text-slate-300 mr-2"></i>{viewAppointment.slot}</p></div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-100"><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Problem</p><p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">{viewAppointment.problem}</p></div>
                                {viewAppointment.clinicVisit && <div><p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2"><i className="fa-solid fa-stethoscope mr-1"></i>Clinic Visit</p><p className="text-slate-700 bg-blue-50 p-4 rounded-xl border border-purple-100">This is a clinic visit.</p></div>}
                                {viewAppointment.videoConsultation && <div><p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2"><i className="fa-solid fa-video mr-1"></i>Video Consultation</p><p className="text-slate-700 bg-purple-50 p-4 rounded-xl border border-purple-100">This is a video consultation.</p></div>}
                                {viewAppointment.notes && <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Doctor's Notes</p><p className="text-slate-600 italic bg-[rgba(217, 119, 6,0.12)] p-4 rounded-xl border border-[rgba(217, 119, 6,0.30)]">{viewAppointment.notes}</p></div>}
                            </div>
                            <div className="p-5 border-t border-slate-100 flex justify-end">
                                <button onClick={() => setViewAppointment(null)} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm">Close</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Edit Modal ── */}
            <AnimatePresence>
                {editingAppointment && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <div><h3 className="text-lg font-black text-slate-800">Edit Appointment</h3><p className="text-xs font-mono text-blue-600 mt-0.5">{editingAppointment.appointmentId}</p></div>
                                <button onClick={() => setEditingAppointment(null)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-500 flex items-center justify-center transition-all"><i className="fa-solid fa-xmark"></i></button>
                            </div>
                            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</label><div className="relative"><i className="fa-solid fa-user absolute left-3 top-3 text-slate-400 text-xs"></i><input required type="text" name="patientName" value={editingAppointment.patientName} onChange={handleEditChange} className={`${inp} pl-9`} /></div></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label><div className="relative"><i className="fa-solid fa-phone absolute left-3 top-3 text-slate-400 text-xs"></i><input required type="text" name="phone" value={editingAppointment.phone} onChange={handleEditChange} className={`${inp} pl-9`} /></div></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Age</label><input required type="number" name="age" value={editingAppointment.age} onChange={handleEditChange} className={inp} /></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gender</label><select name="gender" value={editingAppointment.gender} onChange={handleEditChange} className={inp}><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label><input required type="date" name="date" value={editingAppointment.date?.split("T")[0]} onChange={handleEditChange} className={inp} /></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Slot</label><select name="slot" value={editingAppointment.slot} onChange={handleEditChange} className={inp}><option value="Morning (9AM–1PM)">Morning (9AM–1PM)</option><option value="Evening (4PM–9PM)">Evening (4PM–9PM)</option></select></div>
                                </div>
                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Problem</label><input required type="text" name="problem" value={editingAppointment.problem} onChange={handleEditChange} className={inp} /></div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" name="clinicVisit" checked={editingAppointment.clinicVisit} onChange={(e) => { handleEditChange(e); if (e.target.checked) setEditingAppointment(p => ({ ...p, videoConsultation: false })); }} className="w-4 h-4 rounded text-blue-600 focus:ring-[rgba(13, 148, 136,0.30)] border-slate-300" />
                                        <span className="text-sm font-bold text-slate-700">Clinic Visit</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" name="videoConsultation" checked={editingAppointment.videoConsultation} onChange={(e) => { handleEditChange(e); if (e.target.checked) setEditingAppointment(p => ({ ...p, clinicVisit: false })); }} className="w-4 h-4 rounded accent-purple-600 focus:ring-purple-600 border-slate-300" />
                                        <span className="text-sm font-bold text-slate-700">Video Consultation</span>
                                    </label>
                                </div>
                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doctor's Notes</label><textarea name="notes" value={editingAppointment.notes || ""} onChange={handleEditChange} placeholder="Add notes..." className={`${inp} resize-none`} rows={2}></textarea></div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button type="button" onClick={() => setEditingAppointment(null)} className="px-5 py-2 text-slate-500 hover:bg-slate-100 rounded-xl font-semibold text-sm transition-all">Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all">Save Changes</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* -- Patient History Modal -- */}
            <AnimatePresence>
                {viewPatientHistory && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800">Patient History</h3>
                                    <p className="text-xs text-slate-400 mt-0.5"><i className="fa-solid fa-phone mr-1"></i>{viewPatientHistory}</p>
                                </div>
                                <button onClick={() => setViewPatientHistory(null)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-500 flex items-center justify-center transition-all"><i className="fa-solid fa-xmark"></i></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-0">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider sticky top-0">
                                        <tr>
                                            <th className="px-6 py-4 border-b border-slate-100">Date</th>
                                            <th className="px-6 py-4 border-b border-slate-100">Problem</th>
                                            <th className="px-6 py-4 border-b border-slate-100">Doctor's Notes</th>
                                            <th className="px-6 py-4 border-b border-slate-100">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {(Array.isArray(patientHistory) ? patientHistory : []).map(app => (
                                            <tr key={app._id} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-slate-700 text-sm mb-0.5">{new Date(app.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                                                    <p className="text-xs text-slate-400">{app.slot}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{app.problem}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500 italic max-w-xs">{app.notes || "�"}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === "Confirmed" ? "bg-emerald-50 text-emerald-600" :
                                                        app.status === "Completed" ? "bg-blue-50 text-blue-600" :
                                                            app.status === "Cancelled" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                                                        }`}>{app.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Visits: {patientHistory.length}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* -- Edit Patient Modal -- */}
            <AnimatePresence>
                {editingPatient && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                                <div>
                                    <h3 className="text-lg font-black text-slate-800">Edit Patient Details</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Updating for phone: {editingPatient.phone}</p>
                                </div>
                                <button onClick={() => setEditingPatient(null)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-500 flex items-center justify-center transition-all"><i className="fa-solid fa-xmark"></i></button>
                            </div>
                            <form onSubmit={handlePatientUpdateSubmit} className="p-6 space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</label>
                                    <input required type="text" value={editingPatient.name} onChange={e => setEditingPatient({ ...editingPatient, name: e.target.value })} className={inp} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                                    <input required type="text" value={editingPatient.phone} onChange={e => setEditingPatient({ ...editingPatient, phone: e.target.value })} className={inp} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Age</label>
                                        <input required type="number" value={editingPatient.age} onChange={e => setEditingPatient({ ...editingPatient, age: e.target.value })} className={inp} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gender</label>
                                        <select value={editingPatient.gender} onChange={e => setEditingPatient({ ...editingPatient, gender: e.target.value })} className={inp}>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100/50">
                                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest leading-normal">
                                        <i className="fa-solid fa-circle-info mr-1"></i> These changes will be applied to all past and future appointment records associated with this phone number.
                                    </p>
                                </div>
                                <div className="flex gap-3 pt-4 border-t border-slate-100">
                                    <button type="button" onClick={() => setEditingPatient(null)} className="flex-1 px-5 py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl font-semibold text-sm transition-all border border-transparent">Cancel</button>
                                    <button type="submit" className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all">Save Changes</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* -- Delete Patient Confirmation Modal -- */}
            <AnimatePresence>
                {deletingPatient && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden text-center">
                            <div className="p-8">
                                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-2">Delete Patient?</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Are you sure you want to delete all <span className="font-bold text-slate-700">{deletingPatient.visits}</span> record(s) for <span className="font-bold text-slate-700">{deletingPatient.name}</span>? This action cannot be undone.
                                </p>
                            </div>
                            <div className="p-4 bg-slate-50 flex gap-3">
                                <button onClick={() => setDeletingPatient(null)} className="flex-1 px-4 py-2.5 bg-white text-slate-600 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-100 transition-all">No, Cancel</button>
                                <button onClick={handlePatientDelete} className="flex-1 px-4 py-2.5 bg-rose-500 text-white rounded-xl font-bold text-sm shadow-md hover:bg-rose-600 transition-all">Yes, Delete All</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* -- Patient Story View Modal -- */}
            <AnimatePresence>
                {viewingStory && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setViewingStory(null)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            {viewingStory.image && <img src={viewingStory.image} alt={viewingStory.patientName} className="w-full h-64 object-cover rounded-t-3xl" />}
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800">{viewingStory.patientName}</h3>
                                        <p className="text-slate-400 text-sm mt-0.5">{viewingStory.age && `${viewingStory.age} years`}{viewingStory.location && ` · ${viewingStory.location}`}</p>
                                    </div>
                                    <button onClick={() => setViewingStory(null)} className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-500 flex items-center justify-center transition-all flex-shrink-0"><i className="fa-solid fa-xmark"></i></button>
                                </div>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="bg-indigo-100 text-indigo-700 text-sm font-bold px-3 py-1 rounded-full">{viewingStory.condition} {viewingStory.conditionHi && <span className="font-black">({viewingStory.conditionHi})</span>}</span>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <i key={i} className={`fa-star text-sm ${i <= viewingStory.rating ? "fa-solid text-amber-400" : "fa-regular text-slate-300"}`}></i>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-slate-700 leading-relaxed text-base italic mb-6">"{viewingStory.story}"</p>
                                {viewingStory.outcome && (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                                        <i className="fa-solid fa-circle-check text-emerald-500 mt-0.5 flex-shrink-0"></i>
                                        <div>
                                            <p className="font-black text-emerald-800 text-sm mb-0.5">Outcome</p>
                                            <p className="text-emerald-700 text-sm">{viewingStory.outcome}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                                    <button onClick={() => setViewingStory(null)} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm">Close</button>
                                    <button onClick={() => { handleEditStory(viewingStory); setViewingStory(null); }} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-sm shadow-md">Edit Story</button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default Admin;


