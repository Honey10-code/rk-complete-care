import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API = "/api";

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
                    className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white text-sm font-semibold min-w-[280px] border border-white/10 backdrop-blur-xl ${t.type === "success" ? "bg-[rgba(74,138,104,0.10)]" :
                        t.type === "error" ? "bg-rose-600" : "bg-[rgba(13, 148, 136,0.10)]"
                        }`}
                >
                    <i className={`fa-solid ${t.type === "success" ? "fa-circle-check" : t.type === "error" ? "fa-circle-xmark" : "fa-circle-info"} text-lg`}></i>
                    <span className="flex-1">{t.message}</span>
                    <button onClick={() => removeToast(t.id)} className="opacity-70 hover:opacity-100 transition-opacity ml-2">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </motion.div>
            ))}
        </AnimatePresence>
    </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon, gradient, sub }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.02 }}
        className={`relative p-6 rounded-2xl text-white overflow-hidden ${gradient} shadow-xl`}
    >
        <div className="absolute inset-0 bg-white/5 rounded-2xl"></div>
        <div className="absolute -right-4 -bottom-4 text-white/10 text-8xl pointer-events-none">
            <i className={`fa-solid ${icon}`}></i>
        </div>
        <div className="relative z-10">
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-4xl font-black mb-1">{value}</h3>
            {sub && <p className="text-white/60 text-xs">{sub}</p>}
        </div>
    </motion.div>
);

// ─── Input Style ─────────────────────────────────────────────────────────────
const inp = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[rgba(13, 148, 136,0.30)] focus:border-[rgba(13, 148, 136,0.25)] transition-all text-slate-700 text-sm";

// ─── Main Admin Component ─────────────────────────────────────────────────────
const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("appointments");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState([]);

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
            const res = await axios.get(`${API}/appointments?search=${search}`);
            setAppointments(res.data);
        } catch (err) {
            if (err.response?.status === 401) navigate("/login");
        } finally { setLoading(false); }
    }, [search, navigate]);

    useEffect(() => { if (activeTab === "appointments") fetchAppointments(); }, [search, activeTab, fetchAppointments]);

    useEffect(() => {
        const today = new Date().toDateString();
        setStats({
            total: appointments.length,
            pending: appointments.filter(a => a.status === "Pending").length,
            confirmed: appointments.filter(a => a.status === "Confirmed").length,
            completed: appointments.filter(a => a.status === "Completed").length,
            cancelled: appointments.filter(a => a.status === "Cancelled").length,
            today: appointments.filter(a => new Date(a.date).toDateString() === today).length,
        });
    }, [appointments]);

    const filteredAppointments = appointments.filter(a =>
        statusFilter === "All" ? true : a.status === statusFilter
    );

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.patch(`${API}/appointments/${id}`, { status: newStatus });
            fetchAppointments();
            addToast(`Status updated to ${newStatus}`, "success");
        } catch { addToast("Error updating status", "error"); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this appointment?")) return;
        try {
            await axios.delete(`${API}/appointments/${id}`);
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
            await axios.patch(`${API}/appointments/${editingAppointment._id}`, editingAppointment);
            setEditingAppointment(null);
            fetchAppointments();
            addToast("Appointment updated!", "success");
        } catch { addToast("Error updating appointment", "error"); }
    };

    // ── View Appointment ──────────────────────────────────────────────────────
    // -- View Appointment --------------------------------------------------------
    const [viewAppointment, setViewAppointment] = useState(null);

    // -- Patient History ---------------------------------------------------------
    const [viewPatientHistory, setViewPatientHistory] = useState(null); // stores patient phone
    const patientHistory = viewPatientHistory ? appointments.filter(a => a.phone === viewPatientHistory).sort((a, b) => new Date(b.date) - new Date(a.date)) : [];

    // ── Create Appointment ────────────────────────────────────────────────────
    const blankAppt = { patientName: "", phone: "", age: "", gender: "Male", date: new Date().toISOString().split("T")[0], slot: "Morning (9AM - 1PM)", problem: "", clinicVisit: true, videoConsultation: false, notes: "", whatsappNotify: false, status: "Pending" };
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newAppointment, setNewAppointment] = useState(blankAppt);
    const handleCreateChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewAppointment(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/appointments`, newAppointment);
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
    const fetchDoctors = async () => { try { const r = await axios.get(`${API}/doctors`); setDoctors(r.data); } catch { } };
    useEffect(() => { if (activeTab === "doctors") fetchDoctors(); }, [activeTab]);
    const handleDoctorSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        ["name", "qualification", "specialty", "designation"].forEach(k => fd.append(k, newDoctor[k]));
        if (doctorUploadType === "url") fd.append("imageUrl", newDoctor.imageUrl);
        else if (doctorFile) fd.append("image", doctorFile);
        try {
            await axios.post(`${API}/doctors`, fd, { headers: { "Content-Type": "multipart/form-data" } });
            setNewDoctor({ name: "", qualification: "", specialty: "", designation: "", imageUrl: "" });
            setDoctorFile(null);
            fetchDoctors();
            addToast("Doctor added!", "success");
        } catch { addToast("Error adding doctor", "error"); }
    };
    const handleDeleteDoctor = async (id) => {
        if (!window.confirm("Delete this doctor?")) return;
        try { await axios.delete(`${API}/doctors/${id}`); fetchDoctors(); addToast("Doctor deleted", "success"); }
        catch { addToast("Error deleting doctor", "error"); }
    };

    // ── Testimonials ──────────────────────────────────────────────────────────
    const [testimonials, setTestimonials] = useState([]);
    const [newTestimonial, setNewTestimonial] = useState({ name: "", location: "", message: "", rating: 5 });
    const fetchTestimonials = async () => { try { const r = await axios.get(`${API}/testimonials`); setTestimonials(r.data); } catch { } };
    useEffect(() => { if (activeTab === "testimonials") fetchTestimonials(); }, [activeTab]);
    const handleTestimonialSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/testimonials`, newTestimonial);
            setNewTestimonial({ name: "", location: "", message: "", rating: 5 });
            fetchTestimonials();
            addToast("Testimonial added!", "success");
        } catch { addToast("Error adding testimonial", "error"); }
    };
    const handleDeleteTestimonial = async (id) => {
        if (!window.confirm("Delete this testimonial?")) return;
        try { await axios.delete(`${API}/testimonials/${id}`); fetchTestimonials(); addToast("Deleted", "success"); }
        catch { addToast("Error", "error"); }
    };

    // ── Clinic Info ───────────────────────────────────────────────────────────
    const [clinicInfo, setClinicInfo] = useState({ phones: ["", ""], email: "", address: "", openingHours: { morning: "", evening: "", sunday: "" }, socialLinks: { facebook: "", instagram: "", twitter: "", whatsapp: "", google: "" } });
    const [clinicInfoLoaded, setClinicInfoLoaded] = useState(false);
    const fetchClinicInfo = async () => { try { const r = await axios.get(`${API}/clinic-info`); if (r.data) { setClinicInfo(r.data); setClinicInfoLoaded(true); } } catch { } };
    useEffect(() => { if (activeTab === "settings" && !clinicInfoLoaded) fetchClinicInfo(); }, [activeTab]);
    const handleClinicInfoSubmit = async (e) => {
        e.preventDefault();
        try { await axios.post(`${API}/clinic-info`, clinicInfo); addToast("Settings saved!", "success"); }
        catch { addToast("Error saving settings", "error"); }
    };

    // ── Banners ───────────────────────────────────────────────────────────────
    const [banners, setBanners] = useState([]);
    const [newBanner, setNewBanner] = useState({ image: "", title: "", subtitle: "" });
    const [uploadType, setUploadType] = useState("url");
    const [file, setFile] = useState(null);
    const fetchBanners = async () => { try { const r = await axios.get(`${API}/banners`); setBanners(r.data); } catch { } };
    useEffect(() => { if (activeTab === "banners") fetchBanners(); }, [activeTab]);
    const handleBannerSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append("title", newBanner.title);
        fd.append("subtitle", newBanner.subtitle);
        if (uploadType === "url") fd.append("imageUrl", newBanner.image);
        else if (file) fd.append("image", file);
        try {
            await axios.post(`${API}/banners`, fd, { headers: { "Content-Type": "multipart/form-data" } });
            setNewBanner({ image: "", title: "", subtitle: "" }); setFile(null);
            fetchBanners(); addToast("Banner added!", "success");
        } catch { addToast("Error adding banner", "error"); }
    };
    const handleDeleteBanner = async (id) => {
        if (!window.confirm("Delete this banner?")) return;
        try { await axios.delete(`${API}/banners/${id}`); fetchBanners(); addToast("Banner deleted", "success"); }
        catch { addToast("Error", "error"); }
    };

    // ── Nav items ─────────────────────────────────────────────────────────────
    // Patient Stories state
    const [stories, setStories] = useState([]);
    const [newStory, setNewStory] = useState({ patientName: "", age: "", location: "", condition: "", story: "", outcome: "", imageUrl: "", rating: 5, featured: false });
    const [storyUploadType, setStoryUploadType] = useState("url");
    const [storyFile, setStoryFile] = useState(null);
    const fetchStories = async () => { try { const r = await axios.get(API + "/patient-stories"); setStories(r.data); } catch { } };
    useEffect(() => { if (activeTab === "stories") fetchStories(); }, [activeTab]);
    const handleStorySubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        ["patientName", "age", "location", "condition", "story", "outcome", "rating"].forEach(k => fd.append(k, newStory[k]));
        fd.append("featured", String(newStory.featured));
        if (storyUploadType === "url") fd.append("imageUrl", newStory.imageUrl);
        else if (storyFile) fd.append("image", storyFile);
        try {
            await axios.post(API + "/patient-stories", fd, { headers: { "Content-Type": "multipart/form-data" } });
            setNewStory({ patientName: "", age: "", location: "", condition: "", story: "", outcome: "", imageUrl: "", rating: 5, featured: false });
            setStoryFile(null); fetchStories(); addToast("Story added!", "success");
        } catch { addToast("Error adding story", "error"); }
    };
    const handleDeleteStory = async (id) => {
        if (!window.confirm("Delete this story?")) return;
        try { await axios.delete(API + "/patient-stories/" + id); fetchStories(); addToast("Story deleted", "success"); }
        catch { addToast("Error", "error"); }
    };

    // Clinic Posters state
    const [posters, setPosters] = useState([]);
    const [newPoster, setNewPoster] = useState({ title: "", description: "", category: "General", imageUrl: "" });
    const [posterUploadType, setPosterUploadType] = useState("file");
    const [posterFile, setPosterFile] = useState(null);
    const POSTER_CATS = ["General", "Awareness", "Services", "Events", "Health Tips", "Offers"];
    const fetchPosters = async () => { try { const r = await axios.get(API + "/clinic-posters"); setPosters(r.data); } catch { } };
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
            await axios.post(API + "/clinic-posters", fd, { headers: { "Content-Type": "multipart/form-data" } });
            setNewPoster({ title: "", description: "", category: "General", imageUrl: "" });
            setPosterFile(null); fetchPosters(); addToast("Poster uploaded!", "success");
        } catch { addToast("Error uploading poster", "error"); }
    };
    const handleDeletePoster = async (id) => {
        if (!window.confirm("Delete this poster?")) return;
        try { await axios.delete(API + "/clinic-posters/" + id); fetchPosters(); addToast("Poster deleted", "success"); }
        catch { addToast("Error", "error"); }
    };

    const navItems = [
        { id: "appointments", icon: "fa-calendar-check", label: "Appointments", badge: stats.pending > 0 ? stats.pending : null },
        { id: "patients", icon: "fa-users", label: "Patients" },
        { id: "reports", icon: "fa-chart-pie", label: "Reports" },
        { id: "stories", icon: "fa-heart-pulse", label: "Patient Stories" },
        { id: "posters", icon: "fa-image", label: "Clinic Posters" },
        { id: "banners", icon: "fa-images", label: "Banners" },
        { id: "doctors", icon: "fa-user-doctor", label: "Doctors" },
        { id: "testimonials", icon: "fa-star", label: "Testimonials" },
        { id: "settings", icon: "fa-gear", label: "Settings" },
    ];

    // ── Unique patients derived from appointments ──────────────────────────────
    const uniquePatients = Object.values(
        appointments.reduce((acc, a) => {
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

    const statusColor = (s) => s === "Confirmed" ? "bg-[rgba(74,138,104,0.10)] text-[#4a8a68]" : s === "Pending" ? "bg-[rgba(217, 119, 6,0.12)] text-[#d97706]" : s === "Completed" ? "bg-blue-100 text-blue-700" : "bg-rose-100 text-rose-700";

    return (
        <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
            <Toast toasts={toasts} removeToast={removeToast} />

            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm transition-opacity"></div>
            )}

            {/* ── Sidebar ── */}
            <aside className={`w-64 flex-shrink-0 bg-gradient-to-b from-slate-900 via-[#0f766e] to-slate-900 text-white flex flex-col shadow-2xl z-40 fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} overflow-hidden`}>
                {/* Decorative glow */}
                <div className="absolute top-0 left-0 w-full h-48 bg-[rgba(13, 148, 136,0.10)]/20 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-[rgba(13, 148, 136,0.15)] blur-3xl pointer-events-none"></div>

                {/* Logo */}
                <div className="relative z-10 p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d9488] to-[#0f766e] flex items-center justify-center shadow-lg shadow-[rgba(13, 148, 136,0.30)]">
                            <i className="fa-solid fa-staff-snake text-white text-lg"></i>
                        </div>
                        <div>
                            <p className="text-xs font-black text-white leading-tight">RK The Complete Care</p>
                            <p className="text-xs font-black text-[#0d9488] leading-tight">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1 relative z-10 overflow-y-auto">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative group ${activeTab === item.id
                                ? "bg-[#0d9488] text-white shadow-lg shadow-[rgba(13, 148, 136,0.25)]"
                                : "text-slate-400 hover:bg-white/8 hover:text-white"
                                }`}
                        >
                            <i className={`fa-solid ${item.icon} w-4 text-center`}></i>
                            <span>{item.label}</span>
                            {item.badge && (
                                <span className="ml-auto bg-[rgba(217, 119, 6,0.12)] text-[#d97706] text-xs font-black px-2 py-0.5 rounded-full">{item.badge}</span>
                            )}
                            {activeTab === item.id && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full"></div>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-white/10 relative z-10">
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <img src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff&bold=true" alt="Admin" className="w-8 h-8 rounded-full ring-2 ring-[rgba(13, 148, 136,0.30)]/50" />
                        <div>
                            <p className="text-xs font-bold text-white">Administrator</p>
                            <p className="text-xs text-[#0d9488]">Super Admin</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all text-sm font-semibold">
                        <i className="fa-solid fa-right-from-bracket w-4"></i> Logout
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between flex-shrink-0 shadow-sm z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-500 hover:text-[#0d9488] transition-colors p-2 -ml-2">
                            <i className="fa-solid fa-bars text-xl"></i>
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 capitalize">{activeTab === "appointments" ? "Dashboard" : activeTab}</h1>
                            <p className="text-xs text-slate-400 font-medium hidden sm:block">{clock.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-2xl font-black text-[#0d9488] tabular-nums">{clock.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                        {activeTab === "appointments" && (
                            <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-[#0d9488] text-white rounded-xl font-bold text-sm shadow-lg shadow-[rgba(13, 148, 136,0.25)] hover:shadow-[rgba(13, 148, 136,0.35)] hover:-translate-y-0.5 transition-all">
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
                                <StatCard title="Total" value={stats.total} icon="fa-calendar-days" gradient="bg-gradient-to-br from-[#0d9488] to-[#0f766e]" />
                                <StatCard title="Pending" value={stats.pending} icon="fa-clock" gradient="bg-[#d97706]" />
                                <StatCard title="Confirmed" value={stats.confirmed} icon="fa-check-circle" gradient="bg-gradient-to-br from-emerald-400 to-emerald-600" />
                                <StatCard title="Completed" value={stats.completed} icon="fa-flag-checkered" gradient="bg-gradient-to-br from-blue-500 to-blue-700" />
                                <StatCard title="Cancelled" value={stats.cancelled} icon="fa-ban" gradient="bg-gradient-to-br from-rose-400 to-rose-600" />
                                <StatCard title="Today" value={stats.today} icon="fa-user-clock" gradient="bg-gradient-to-br from-[#0d9488] to-[#0f172a]" />
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
                                        {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(s => (
                                            <button key={s} onClick={() => setStatusFilter(s)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === s ? "bg-[rgba(13, 148, 136,0.10)] text-white shadow-md shadow-[rgba(13, 148, 136,0.25)]" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
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
                                        <div className="w-10 h-10 border-4 border-[rgba(13, 148, 136,0.25)] border-t-indigo-600 rounded-full animate-spin"></div>
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
                                                    <motion.tr key={app._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-[rgba(13, 148, 136,0.10)]/30 transition-colors group">
                                                        <td className="px-5 py-4">
                                                            <span className="text-xs font-mono font-bold text-[#0d9488] bg-[rgba(13, 148, 136,0.10)] px-2 py-1 rounded-lg">{app.appointmentId || "—"}</span>
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 rounded-full bg-[rgba(13, 148, 136,0.10)] text-[#0f766e] flex items-center justify-center font-black text-sm flex-shrink-0">
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
                                                            {app.clinicVisit && <span className="text-[10px] bg-[rgba(13, 148, 136,0.10)] text-[#0d9488] px-2 py-0.5 rounded-full font-bold mt-1 inline-block mr-1"><i className="fa-solid fa-stethoscope mr-1"></i>Clinic Visit</span>}
                                                            {app.videoConsultation && <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold mt-1 inline-block"><i className="fa-solid fa-video mr-1"></i>Video Consult</span>}
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
                                                                <button onClick={() => setViewAppointment(app)} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-[rgba(13, 148, 136,0.10)] hover:text-[#0d9488] flex items-center justify-center transition-all" title="View"><i className="fa-solid fa-eye text-xs"></i></button>
                                                                <button onClick={() => setEditingAppointment({ ...app })} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-[rgba(13, 148, 136,0.10)] hover:text-[#0d9488] flex items-center justify-center transition-all" title="Edit"><i className="fa-solid fa-pen text-xs"></i></button>
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
                                    <h2 className="font-black text-slate-800">Patient Directory <span className="ml-2 text-sm font-bold text-[#0d9488] bg-[rgba(13, 148, 136,0.10)] px-2 py-0.5 rounded-full">{uniquePatients.length}</span></h2>
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
                                                <tr key={p.phone} className="hover:bg-[rgba(13, 148, 136,0.10)]/30 transition-colors">
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-[rgba(13, 148, 136,0.10)] text-[#0d9488] flex items-center justify-center font-black text-sm">{p.name?.charAt(0)}</div>
                                                            <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-5 py-4 text-sm text-slate-600 font-mono">{p.phone}</td>
                                                    <td className="px-5 py-4 text-sm text-slate-600">{p.age}y &bull; {p.gender}</td>
                                                    <td className="px-5 py-4">
                                                        <span className="bg-[rgba(13, 148, 136,0.10)] text-[#0d9488] text-xs font-black px-3 py-1 rounded-full">{p.visits} visit{p.visits !== 1 ? "s" : ""}</span>
                                                    </td>
                                                    <td className="px-5 py-4 text-sm text-slate-500">
                                                        <div className="flex items-center justify-between">
                                                            <span>{new Date(p.lastVisit).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                                                            <button onClick={() => setViewPatientHistory(p.phone)} className="text-xs font-bold text-[#0d9488] hover:text-[#0d9488] bg-[rgba(13, 148, 136,0.10)] hover:bg-[rgba(13, 148, 136,0.10)] px-3 py-1.5 rounded-lg transition-all">
                                                                <i className="fa-solid fa-clock-rotate-left mr-1.5"></i>History
                                                            </button>
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

                    {/* ── Reports Tab ── */}
                    {
                        activeTab === "reports" && (
                            <div className="space-y-6">
                                {/* Summary cards */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { label: "Total Appointments", value: stats.total, color: "text-[#0d9488]", bg: "bg-[rgba(13, 148, 136,0.10)]" },
                                        { label: "Completion Rate", value: stats.total ? `${Math.round((stats.completed / stats.total) * 100)}%` : "0%", color: "text-[#4a8a68]", bg: "bg-[rgba(74,138,104,0.10)]" },
                                        { label: "Pending Rate", value: stats.total ? `${Math.round((stats.pending / stats.total) * 100)}%` : "0%", color: "text-[#d97706]", bg: "bg-[rgba(217, 119, 6,0.12)]" },
                                        { label: "Unique Patients", value: uniquePatients.length, color: "text-[#0d9488]", bg: "bg-[rgba(13, 148, 136,0.08)]" },
                                    ].map(c => (
                                        <div key={c.label} className={`${c.bg} rounded-2xl p-5`}>
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
                                                { label: "Confirmed", count: stats.confirmed, color: "bg-[#4a8a68]", light: "bg-[rgba(74,138,104,0.10)]" },
                                                { label: "Pending", count: stats.pending, color: "bg-[#d97706]", light: "bg-[rgba(217, 119, 6,0.12)]" },
                                                { label: "Completed", count: stats.completed, color: "bg-blue-600", light: "bg-blue-100" },
                                                { label: "Cancelled", count: stats.cancelled, color: "bg-rose-500", light: "bg-rose-100" },
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
                                                const clinicVisits = appointments.filter(a => a.clinicVisit).length;
                                                const videoVisits = appointments.filter(a => a.videoConsultation).length;
                                                const otherVisits = appointments.length - clinicVisits - videoVisits;
                                                return [
                                                    { label: "Clinic Visits", count: clinicVisits + otherVisits, color: "bg-[#0d9488]", light: "bg-[rgba(13, 148, 136,0.10)]" },
                                                    { label: "Video Consults", count: videoVisits, color: "bg-purple-600", light: "bg-purple-100" },
                                                ].map(row => (
                                                    <div key={row.label}>
                                                        <div className="flex justify-between text-sm font-semibold text-slate-700 mb-1.5">
                                                            <span>{row.label}</span>
                                                            <span>{row.count} ({appointments.length ? Math.round((row.count / appointments.length) * 100) : 0}%)</span>
                                                        </div>
                                                        <div className={`h-3 rounded-full ${row.light} overflow-hidden`}>
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: appointments.length ? `${(row.count / appointments.length) * 100}%` : "0%" }}
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
                                                const morning = appointments.filter(a => a.slot?.includes("Morning")).length;
                                                const evening = appointments.filter(a => a.slot?.includes("Evening")).length;
                                                return [
                                                    { label: "Morning (9AM–1PM)", count: morning, color: "bg-[#d97706]", light: "bg-[rgba(217, 119, 6,0.12)]" },
                                                    { label: "Evening (4PM–9PM)", count: evening, color: "bg-[#0d9488]", light: "bg-[rgba(13, 148, 136,0.10)]" },
                                                ].map(row => (
                                                    <div key={row.label} className="mb-3">
                                                        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                                                            <span>{row.label}</span><span>{row.count}</span>
                                                        </div>
                                                        <div className={`h-2 rounded-full ${row.light} overflow-hidden`}>
                                                            <motion.div initial={{ width: 0 }} animate={{ width: appointments.length ? `${(row.count / appointments.length) * 100}%` : "0%" }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${row.color}`} />
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
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${uploadType === t ? "bg-[rgba(13, 148, 136,0.10)] text-white shadow-md shadow-[rgba(13, 148, 136,0.25)]" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
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
                                                <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} required className={`${inp} file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[rgba(13, 148, 136,0.10)] file:text-[#0d9488]`} />
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
                                        <button type="submit" className="md:col-start-4 px-5 py-2.5 bg-[#0d9488] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all">
                                            <i className="fa-solid fa-plus mr-2"></i>Add Banner
                                        </button>
                                    </form>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {banners.map(b => (
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

                    {/* ── Doctors Tab ── */}
                    {
                        activeTab === "doctors" && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                    <h3 className="font-black text-slate-800 mb-4">Add New Doctor</h3>
                                    <div className="flex gap-3 mb-4">
                                        {["url", "file"].map(t => (
                                            <button key={t} type="button" onClick={() => setDoctorUploadType(t)}
                                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${doctorUploadType === t ? "bg-[rgba(13, 148, 136,0.10)] text-white shadow-md shadow-[rgba(13, 148, 136,0.25)]" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
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
                                            {doctorUploadType === "url" ? <input type="text" placeholder="https://..." value={newDoctor.imageUrl} onChange={e => setNewDoctor({ ...newDoctor, imageUrl: e.target.value })} className={inp} /> : <input type="file" accept="image/*" onChange={e => setDoctorFile(e.target.files[0])} className={`${inp} file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[rgba(13, 148, 136,0.10)] file:text-[#0d9488]`} />}
                                        </div>
                                        <div className="md:col-span-2 flex justify-end">
                                            <button type="submit" className="px-6 py-2.5 bg-[#0d9488] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"><i className="fa-solid fa-plus mr-2"></i>Add Doctor</button>
                                        </div>
                                    </form>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {doctors.map(doc => (
                                        <div key={doc._id} className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                            <div className="h-52 overflow-hidden bg-slate-100">
                                                <img src={doc.image} alt={doc.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" onError={e => { e.target.src = "https://placehold.co/400x300?text=Doctor"; }} />
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-black text-slate-800">{doc.name}</h4>
                                                <p className="text-xs font-bold text-[#0d9488] mt-0.5">{doc.qualification}</p>
                                                <span className="inline-block mt-2 text-xs bg-[rgba(13, 148, 136,0.08)] text-[#0f766e] px-2 py-0.5 rounded-full font-semibold">{doc.specialty}</span>
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
                                        <div className="md:col-span-2 flex justify-end"><button type="submit" className="px-6 py-2.5 bg-[#0d9488] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"><i className="fa-solid fa-plus mr-2"></i>Add Testimonial</button></div>
                                    </form>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {testimonials.map(t => (
                                        <div key={t._id} className="group bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all relative">
                                            <div className="flex items-start gap-4">
                                                <div className="w-11 h-11 rounded-full bg-[rgba(13, 148, 136,0.10)] text-[#0f766e] flex items-center justify-center font-black text-lg flex-shrink-0">{t.name?.charAt(0)}</div>
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
                                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evening (Mon–Sat)</label><input type="text" placeholder="04:00 PM – 07:00 PM" value={clinicInfo.openingHours?.evening || ""} onChange={e => setClinicInfo({ ...clinicInfo, openingHours: { ...clinicInfo.openingHours, evening: e.target.value } })} className={inp} /></div>
                                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sunday</label><input type="text" placeholder="10:00 AM – 02:00 PM" value={clinicInfo.openingHours?.sunday || ""} onChange={e => setClinicInfo({ ...clinicInfo, openingHours: { ...clinicInfo.openingHours, sunday: e.target.value } })} className={inp} /></div>
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
                                            <span className="w-8 h-8 rounded-lg bg-[rgba(13, 148, 136,0.10)] text-[#0d9488] flex items-center justify-center text-sm"><i className={`fa-solid ${section.icon}`}></i></span>
                                            {section.title}
                                        </h3>
                                        {section.content}
                                    </div>
                                ))}
                                <div className="flex justify-end">
                                    <button type="submit" className="px-8 py-3 bg-[#0d9488] text-white rounded-xl font-black shadow-xl shadow-[rgba(13, 148, 136,0.25)] hover:shadow-[rgba(13, 148, 136,0.35)] hover:-translate-y-0.5 transition-all">
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
                                    <a href="/patient-stories" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-[rgba(13, 148, 136,0.10)] text-[#0d9488] rounded-xl font-bold text-sm hover:bg-[rgba(13, 148, 136,0.10)] transition-colors">
                                        <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i> View Public Page
                                    </a>
                                </div>

                                {/* Add Story Form */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                    <h3 className="font-black text-slate-800 mb-5 flex items-center gap-2 text-base">
                                        <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center text-sm"><i className="fa-solid fa-plus"></i></span>
                                        Add New Story
                                    </h3>
                                    <form onSubmit={handleStorySubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name *</label><input required type="text" placeholder="e.g. Ramesh Kumar" value={newStory.patientName} onChange={e => setNewStory({ ...newStory, patientName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(13, 148, 136,0.30)]/30 focus:border-[rgba(13, 148, 136,0.25)]" /></div>
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Age</label><input type="text" placeholder="e.g. 45" value={newStory.age} onChange={e => setNewStory({ ...newStory, age: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(13, 148, 136,0.30)]/30 focus:border-[rgba(13, 148, 136,0.25)]" /></div>
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label><input type="text" placeholder="e.g. Jaipur, Rajasthan" value={newStory.location} onChange={e => setNewStory({ ...newStory, location: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(13, 148, 136,0.30)]/30 focus:border-[rgba(13, 148, 136,0.25)]" /></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Condition / Diagnosis *</label><input required type="text" placeholder="e.g. Lower Back Pain, Knee Injury" value={newStory.condition} onChange={e => setNewStory({ ...newStory, condition: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(13, 148, 136,0.30)]/30 focus:border-[rgba(13, 148, 136,0.25)]" /></div>
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Outcome / Result</label><input type="text" placeholder="e.g. Fully recovered in 4 weeks" value={newStory.outcome} onChange={e => setNewStory({ ...newStory, outcome: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(13, 148, 136,0.30)]/30 focus:border-[rgba(13, 148, 136,0.25)]" /></div>
                                        </div>
                                        <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Story *</label><textarea required rows={4} placeholder="Write the patient's recovery story in their own words..." value={newStory.story} onChange={e => setNewStory({ ...newStory, story: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(13, 148, 136,0.30)]/30 focus:border-[rgba(13, 148, 136,0.25)] resize-none" /></div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</label>
                                                <select value={newStory.rating} onChange={e => setNewStory({ ...newStory, rating: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(13, 148, 136,0.30)]/30 focus:border-[rgba(13, 148, 136,0.25)]">
                                                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image Source</label>
                                                <select value={storyUploadType} onChange={e => setStoryUploadType(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(13, 148, 136,0.30)]/30 focus:border-[rgba(13, 148, 136,0.25)]">
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
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image URL</label><input type="url" placeholder="https://..." value={newStory.imageUrl} onChange={e => setNewStory({ ...newStory, imageUrl: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(13, 148, 136,0.30)]/30 focus:border-[rgba(13, 148, 136,0.25)]" /></div>
                                        ) : (
                                            <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upload Image</label><input type="file" accept="image/*" onChange={e => setStoryFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[rgba(13, 148, 136,0.10)] file:text-[#0d9488] hover:file:bg-[rgba(13, 148, 136,0.10)]" /></div>
                                        )}
                                        <div className="flex justify-end">
                                            <button type="submit" className="px-6 py-2.5 bg-[#0d9488] text-white rounded-xl font-black text-sm shadow-lg shadow-[rgba(13, 148, 136,0.25)] hover:-translate-y-0.5 transition-all">
                                                <i className="fa-solid fa-heart-pulse mr-2"></i>Add Story
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Stories List */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {stories.map(story => (
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
                                                <span className="inline-block bg-[rgba(13, 148, 136,0.10)] text-[#0d9488] text-xs font-bold px-2 py-0.5 rounded-full mb-2">{story.condition}</span>
                                                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 italic">"{story.story}"</p>
                                                {story.outcome && <p className="text-[#4a8a68] text-xs font-bold mt-2"><i className="fa-solid fa-circle-check mr-1"></i>{story.outcome}</p>}
                                            </div>
                                            <div className="px-4 pb-4 flex justify-end">
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
                                        <h2 className="text-xl font-black text-slate-800">Clinic Posters</h2>
                                        <p className="text-sm text-slate-400 mt-0.5">Upload and manage clinic promotional posters</p>
                                    </div>
                                    <a href="/clinic-posters" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-[rgba(13, 148, 136,0.08)] text-[#0f766e] rounded-xl font-bold text-sm hover:bg-[rgba(13, 148, 136,0.12)] transition-colors">
                                        <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i> View Public Page
                                    </a>
                                </div>

                                {/* Upload Poster Form */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                    <h3 className="font-black text-slate-800 mb-5 flex items-center gap-2 text-base">
                                        <span className="w-8 h-8 rounded-lg bg-[rgba(13, 148, 136,0.12)] text-[#0d9488] flex items-center justify-center text-sm"><i className="fa-solid fa-upload"></i></span>
                                        Upload New Poster
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
                                                <div className="border-2 border-dashed border-[rgba(13, 148, 136,0.25)] rounded-2xl p-8 text-center hover:border-[#0d9488] transition-colors cursor-pointer" onClick={() => document.getElementById("posterFileInput").click()}>
                                                    {posterFile ? (
                                                        <div className="flex items-center justify-center gap-3">
                                                            <i className="fa-solid fa-image text-[#0d9488] text-2xl"></i>
                                                            <span className="text-sm font-bold text-slate-700">{posterFile.name}</span>
                                                            <button type="button" onClick={e => { e.stopPropagation(); setPosterFile(null); }} className="text-rose-400 hover:text-rose-600"><i className="fa-solid fa-xmark"></i></button>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <i className="fa-solid fa-cloud-arrow-up text-[#2dd4bf] text-4xl mb-2 block"></i>
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
                                            <button type="submit" className="px-6 py-2.5 bg-[#0d9488] text-white rounded-xl font-black text-sm shadow-lg shadow-[rgba(13, 148, 136,0.25)] hover:-translate-y-0.5 transition-all">
                                                <i className="fa-solid fa-upload mr-2"></i>Upload Poster
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Posters Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {posters.map(poster => (
                                        <div key={poster._id} className="group relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                            <img src={poster.image} alt={poster.title || "Poster"} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" style={{ minHeight: "160px" }} onError={e => { e.target.src = "https://placehold.co/400x500?text=Poster"; }} />
                                            {poster.category && poster.category !== "General" && (
                                                <div className="absolute top-2 left-2"><span className="bg-[#0d9488] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">{poster.category}</span></div>
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
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
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Slot</label><select name="slot" value={newAppointment.slot} onChange={handleCreateChange} className={inp}><option value="Morning (9AM - 1PM)">Morning (9AM–1PM)</option><option value="Evening (4PM - 9PM)">Evening (4PM–9PM)</option></select></div>
                                </div>
                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Problem Description</label><input required type="text" name="problem" value={newAppointment.problem} onChange={handleCreateChange} placeholder="Briefly describe the issue..." className={inp} /></div>
                                <div className="bg-[rgba(13, 148, 136,0.10)] p-4 rounded-xl border border-[rgba(13, 148, 136,0.25)] flex flex-col gap-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" name="clinicVisit" checked={newAppointment.clinicVisit} onChange={(e) => { handleCreateChange(e); if (e.target.checked) setNewAppointment(p => ({ ...p, videoConsultation: false })); }} className="w-4 h-4 rounded text-[#0d9488] focus:ring-[rgba(13, 148, 136,0.30)] border-slate-300" />
                                        <span className="text-sm font-bold text-slate-700"><i className="fa-solid fa-stethoscope mr-2 text-[#0d9488]"></i>Clinic Visit</span>
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
                                        <button type="submit" className="px-6 py-2 bg-[#0d9488] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all">Create Appointment</button>
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
                                    <p className="text-xs font-mono text-[#0d9488] mt-0.5">{viewAppointment.appointmentId}</p>
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
                                                <div className="w-12 h-12 rounded-full bg-[rgba(13, 148, 136,0.10)] text-[#0f766e] flex items-center justify-center text-xl font-black">{viewAppointment.patientName?.charAt(0)}</div>
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
                                {viewAppointment.clinicVisit && <div><p className="text-xs font-bold text-[#0d9488] uppercase tracking-widest mb-2"><i className="fa-solid fa-stethoscope mr-1"></i>Clinic Visit</p><p className="text-slate-700 bg-[rgba(13, 148, 136,0.10)] p-4 rounded-xl border border-purple-100">This is a clinic visit.</p></div>}
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
                                <div><h3 className="text-lg font-black text-slate-800">Edit Appointment</h3><p className="text-xs font-mono text-[#0d9488] mt-0.5">{editingAppointment.appointmentId}</p></div>
                                <button onClick={() => setEditingAppointment(null)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-rose-100 hover:text-rose-500 flex items-center justify-center transition-all"><i className="fa-solid fa-xmark"></i></button>
                            </div>
                            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Name</label><div className="relative"><i className="fa-solid fa-user absolute left-3 top-3 text-slate-400 text-xs"></i><input required type="text" name="patientName" value={editingAppointment.patientName} onChange={handleEditChange} className={`${inp} pl-9`} /></div></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label><div className="relative"><i className="fa-solid fa-phone absolute left-3 top-3 text-slate-400 text-xs"></i><input required type="text" name="phone" value={editingAppointment.phone} onChange={handleEditChange} className={`${inp} pl-9`} /></div></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Age</label><input required type="number" name="age" value={editingAppointment.age} onChange={handleEditChange} className={inp} /></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gender</label><select name="gender" value={editingAppointment.gender} onChange={handleEditChange} className={inp}><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label><input required type="date" name="date" value={editingAppointment.date?.split("T")[0]} onChange={handleEditChange} className={inp} /></div>
                                    <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Slot</label><select name="slot" value={editingAppointment.slot} onChange={handleEditChange} className={inp}><option value="Morning (9AM - 1PM)">Morning (9AM–1PM)</option><option value="Evening (4PM - 9PM)">Evening (4PM–9PM)</option></select></div>
                                </div>
                                <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Problem</label><input required type="text" name="problem" value={editingAppointment.problem} onChange={handleEditChange} className={inp} /></div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" name="clinicVisit" checked={editingAppointment.clinicVisit} onChange={(e) => { handleEditChange(e); if (e.target.checked) setEditingAppointment(p => ({ ...p, videoConsultation: false })); }} className="w-4 h-4 rounded text-[#0d9488] focus:ring-[rgba(13, 148, 136,0.30)] border-slate-300" />
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
                                    <button type="submit" className="px-6 py-2 bg-[#0d9488] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all">Save Changes</button>
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
                                        {patientHistory.map(app => (
                                            <tr key={app._id} className="hover:bg-[rgba(13, 148, 136,0.10)]/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-slate-700 text-sm mb-0.5">{new Date(app.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                                                    <p className="text-xs text-slate-400">{app.slot}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{app.problem}</td>
                                                <td className="px-6 py-4 text-sm text-slate-500 italic max-w-xs">{app.notes || "�"}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === "Confirmed" ? "bg-[rgba(74,138,104,0.10)] text-[#4a8a68]" :
                                                        app.status === "Completed" ? "bg-[rgba(13, 148, 136,0.10)] text-[#0d9488]" :
                                                            app.status === "Cancelled" ? "bg-rose-100 text-rose-700" : "bg-[rgba(217, 119, 6,0.12)] text-[#d97706]"
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
        </div >
    );
};

export default Admin;


